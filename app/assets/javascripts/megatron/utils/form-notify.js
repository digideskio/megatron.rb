var Event = require('compose-event')
var Notify = require('notify')


// Notify user of actions on ajax forms.
// Default messages are:
//
//  beforeSend: 'Submitting...',
//  success: 'Success!',
//  error: 'Something went wrong.'
//
//  You can customize form messages by nesting scripts
//  inside your form. Note, the classnames of the scripts
//  should match the message type.
//
//  <form data-remote='true'>
//    <script class='beforeSend'>Submitting form</script>
//    <script class='success'>You did it!</script>
//    <script class='error'>Try again</script>
//

var defaultMessages = {
  beforeSend: 'Submitting...',
  success: 'Success!',
  error: 'Something went wrong.'
}

var notifyForm = function(event) {
  var message = getMessage(event.target, event.type)

  if (event.type == 'beforeSend')
    Notify.progress(message)
  else
    Notify[type](message)
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

Event.ready(function() {
  Event.on(document, 'beforeSend success error', 'form[data-remote]', notifyForm)
})
