var clipboard = require('clipboard')

var Clipboard = {
  setup: function() {
    if (document.queryCommandSupported('copy')) {
      var cbwatcher = new clipboard('[data-clipboard-target],[data-clipboard-text]')
      cbwatcher.on('success', Clipboard.success)
      cbwatcher.on('error', Clipboard.failure)
    } else {
      Array.prototype.forEach.call(document.querySelectorAll('[data-clipboard-target],[data-clipboard-text]'), function(el) {
        el.classList.add('hidden')
      })
    }
  },

  success: function(cbEvent) {
    cbEvent.trigger.classList.add('clipboard-copied')
    setTimeout(function(){
      cbEvent.trigger.classList.remove('clipboard-copied')
    }, 1200)
  },

  error: function(event) {
    cbEvent.trigger.classList.add('clipboard-failed')
    setTimeout(function(){
      cbEvent.trigger.classList.remove('clipboard-failed')
    }, 1200)
  }
}

Event.change(Clipboard.setup)
