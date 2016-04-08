var event = require('compose-event')
var notify = require('notify')

module.exports = {
  notify: function formNotify(el, type){
    if(type == 'success')
      notify.success(this.getMessage(el, 'success'))
    else if(type == 'error')
      notify.error(this.getMessage(el, 'error'))
    else if(type == 'beforeSend')
      notify.progress(this.getMessage(el, 'beforeSend'))
  },

  getMessage: function formGetMessage(el, type){
    if (el.dataset[type])
      return el.dataset[type]
    else {
      var msg_object = document.querySelector('script.'+type)

      if (msg_object) {
        var msg = msg_object.innerHTML
        if (msg)
          return msg
        else
          return this.defaultMessages[type]
      }
    }
  },

  listen: function formListen() {
    event.on(document.querySelector('body'), 'submit', 'form', function(event){
      if(!event.target.dataset['remote']) {
        event.preventDefault()
        setTimeout(function(){event.target.submit()}, 100)
        this.notify(event.target, 'beforeSend')
      }
    }.bind(this))
  }
}
