var bean = require('bean')
var classie = require('classie')

require('compose-tap-event')

var AutoNavigate = {
  listen: function(){
    bean.on(document, "click", ".auto-navigate", AutoNavigate.trigger)
  },

  trigger: function(event) {
    var target = event.target
    if (target.tagName.toLowerCase() != 'a') {
      var link = event.currentTarget.querySelector('a.navigate')
      if (event.metaKey) {
        window.open(link)
      } else {
        bean.fire(link, 'click')
      }
    }
  }
}

module.exports = AutoNavigate
