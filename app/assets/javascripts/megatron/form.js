var Event = require('compose-event')
var notify = require('notify')

var defaultMessages = {
  beforeSend: 'Submitting...',
  success: 'Success!',
  error: 'Something went wrong.'
}

var notifyForm = function(event) {
  var message = getMessage(event.target, event.type)

  if (event.type == 'beforeSend')
    notify.progress(message)
  else
    notify[type](message)
}

var getMessage = function(form, type) {
  if (form.dataset[type])
    return form.dataset[type]

  var el = form.querySelector('[data-ajax-event='+type+'], script.'+type)

  if (el)
    return el.innerHTML
  else
    return defaultMessages[type]
}

Event.on(document, 'beforeSend success error', 'form[data-remote]', notifyForm)
