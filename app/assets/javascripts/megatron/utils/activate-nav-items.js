var Event = require('compose-event')

// This module helps show which navigation elements match the current page.
// It assigns 'here' classes to all elements which match the current url.
//
// The value for data-match-url is converted to a regex to match the current url.
//
// Examples:
//   
//   a href='/users" data-match-url='^/users'
//   a href='/users/your-username/followers" data-match-url='/followers/'
//   
Event.change(function(){
  Array.prototype.forEach.call(document.querySelectorAll('[data-match-url]'), function(node){
    var matcher = node.getAttribute('data-match-url')
    if (matcher && new RegExp(node.dataset.matchUrl, "i").test(location.pathname)) {
      node.classList.add('here')
    }
  })
})
