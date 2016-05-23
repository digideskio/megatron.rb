var Event = require('compose-event')

Event.change(function(){
  Array.prototype.forEach.call(document.querySelectorAll('[data-match-url]'), function(node){
    var matcher = node.getAttribute('data-match-url')
    if (matcher && new RegExp(node.getAttribute('data-match-url'), "i").test(location.pathname)) {
      node.className += ' here'
    }
  })
})
