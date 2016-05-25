var Event = require('compose-event')

// Allow clicking an element with .auto-navigate transfers the 
// click to the link (a child element) with the class navigate
//
Event.ready(function(){ 
  Event.on(document, "click", ".auto-navigate", function(event) {
    var target = event.target

    if (target.tagName.toLowerCase() != 'a') {
      var link = event.currentTarget.querySelector('a.navigate')

      if (event.metaKey) {
        window.open(link)
      } else {
        Event.fire(link, 'click')
      }
    }
  })
})
