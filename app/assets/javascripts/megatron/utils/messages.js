var request = require('superagent')
var Event = require('compose-event')

var Messages = {
  el: function messagesEl(){
    return document.querySelector('.pop-message')
  },

  fetch: function messagesFetch(){
    request.get('/messages.json').end(this.end.bind(this));
  },

  dismiss: function messagesDismiss(event){
    self = this
    event.preventDefault()
    event.stopPropagation()

    // Track dismissal
    request.get(event.currentTarget.getAttribute('href')).end(function(error, response){
      // Ask for any new messages
      self.fetch()
    })
    
    // Remove element and clear cache
    this.el().remove()
    window.Megatron.accountMessage = null

  },

  end: function messagesEnd(error, response) {
    if (error || response.serverError) {
      return
    } else {
      var options = JSON.parse(response.text)[0]
      if(options) {
        var html = this.messageHTML(options)
        this.saveMessage(html)
        this.showMessage(html)
        Event.on(this.el(), 'click', '.dismiss', this.dismiss.bind(this))
      }
    }
  },

  messageHTML: function messagesMessageHTML(options){
    options.style = options.style || ''
    var classnames = "message-content "
    if (options.style) 
      classnames += options.style
    if (options.url)
      classnames += " with-url"
    if (options.dismissable)
      classnames += " dismissable"

    var html = "<div class='"+classnames+"'>"
    if (options.dismissable)
      html += "<a href='/messages/"+options.id+"/dismiss' class='dismiss' data-no-turbolink><span class='dismiss-icon x_circle_icon'></span><span class='hidden_label'>dismiss message</span></a>"

    html += "<p>"
    if (options.url)
      html += "<a href='/messages/"+options.id+"/link'>"+options.body+"</a>"
    else
      html += options.body
    html += "</p></div>"

    return html
  },

  saveMessage: function messagesSaveMessage(content){
    window.Megatron.accountMessage = content
  },

  showMessage: function messagesShowMessage(content) {
    if(this.el()) {
      this.el().innerHTML = content
    } else {
      var header = document.querySelector('.site-header')
      
      // if message display isn't disabled by data-no-messages=true
      if (header.dataset.noMessages == null) { 
        header.innerHTML = "<div class='pop-message'>"+content+"</div>" + header.innerHTML
      }
    }
  },

  load: function messagesLoad(){
    if(window.location.hostname.match(/app\.compose/)){
      var message = window.Megatron.accountMessage
      if(!message) {
        this.fetch()
      } else {
        this.showMessage(message)
      }
    }
  }
}

Event.ready(Messages.load)
