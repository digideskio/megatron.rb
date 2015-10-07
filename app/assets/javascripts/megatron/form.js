var RemoteForm = require('remote-form')
var bean = require('bean')
var notify = require('notify')

var MegatronForm = module.exports = RemoteForm.extend({

  defaultMessages: {
    beforeSend: 'Submitting...',
    success: 'Success!',
    error: 'Something went wrong.'
  },

  messageFor: function formMessageFor(type){
    if (this.el.dataset[type])
      return this.el.dataset[type]
    else {
      var msg = this.$('[data-ajax-event='+type+']').innerHTML || this.$('script.'+type).innerHTML
      if (msg)
        return msg
      else
        return this.defaultMessages[type]
    }
  },

  beforeSend: function formBeforeSend(req){
    notify.progress(this.messageFor('beforeSend'))
  },
  
  success: function formSuccessHandler(body, status, xhr){
    notify.success(this.messageFor('success'))
  },

  error: function formErrorHandler(xhr, error){
    notify.error(this.messageFor('error'))
  }
})
