var utils = require('./utils')
var Event = require('compose-event')
var Link = require('./link')
var notify = require('notify')
var request = require('superagent')
var NProgress = require('nprogress')
var esvg = require('./esvg')

var Dialog = require('compose-dialog')
require('compose-toggler')
require('compose-remote-form')
require('compose-time-toggle')

require('./shims/classlist')

window.Megatron = module.exports = {
  Dialog: Dialog,
  notify: notify,
  utils: utils,
  Event: Event,
  request: request,
  Link: Link,
  esvg: esvg,
}


NProgress.configure({showSpinner: false})

Event.on(document, 'page:fetch', function() { NProgress.start() })
Event.on(document, 'page:change', function() { NProgress.done() })
Event.on(document, 'page:restore', function() { NProgress.remove() })

Event.ready(function(){
  utils.AutoNavigate.listen()
  utils.TextHelpers.listen()
})

Event.change(function(){
  utils.toggleActiveNav()
  utils.highlightCode()
  utils.notifyFormFlash()
  utils.Messages.load()
  utils.RangeInputHelper.setup()
  utils.TextHelpers.setup()
})

Event.on(document, 'click', '.nav_toggle', toggleNavigationMode)

function toggleNavigationMode(event) {
  event.target.blur()
  document.querySelector('body').classList.toggle('active-nav')
}
