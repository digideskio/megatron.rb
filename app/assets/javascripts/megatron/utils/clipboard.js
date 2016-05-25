var Event = require('compose-event')
var clipboard = require('clipboard')

// This handles the process of adding to clipboard,
// handling failure states, and hiding buttons when
// clipboard access is not supported.

var Clipboard = {
  setup: function() {
    if (document.queryCommandSupported('copy')) {
      var cbwatcher = new clipboard('[data-clipboard-target],[data-clipboard-text]')
      cbwatcher.on('success', Clipboard.success)
      cbwatcher.on('error', Clipboard.failure)
    } else {
      // Hide buttons which offer the option to copy to clipboard
      Array.prototype.forEach.call(document.querySelectorAll('[data-clipboard-target],[data-clipboard-text]'), function(el) {
        el.classList.add('hidden')
      })
    }
  },

  // Copied to clipboard
  success: function(cbEvent) {
    cbEvent.trigger.classList.add('clipboard-copied')
    setTimeout(function(){
      cbEvent.trigger.classList.remove('clipboard-copied')
    }, 1200)
  },

  // Failed: to copy to clipboard
  error: function(event) {
    cbEvent.trigger.classList.add('clipboard-failed')
    setTimeout(function(){
      cbEvent.trigger.classList.remove('clipboard-failed')
    }, 1200)
  }
}

Event.change(Clipboard.setup)
