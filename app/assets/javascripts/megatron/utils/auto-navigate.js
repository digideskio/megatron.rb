var event = require('compose-event')

var AutoNavigate = {
  listen: function autoNavigateListen(){
    event.on(document, "click", ".auto-navigate", AutoNavigate.trigger)
  },

  trigger: function autoNavigateTrigger(event) {
    var target = event.target
    if (target.tagName.toLowerCase() != 'a') {
      var link = event.currentTarget.querySelector('a.navigate')
      if (event.metaKey) {
        window.open(link)
      } else {
        event.fire(link, 'click')
      }
    }
  }
}

module.exports = AutoNavigate
