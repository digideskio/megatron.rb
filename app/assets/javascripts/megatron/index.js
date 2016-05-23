var Event = require('compose-event')
var Notify = require('notify')
var request = require('superagent')
var NProgress = require('nprogress')
var Dialog = require('compose-dialog')
var Toggler = require('compose-toggler')
var esvg = require('./esvg')

// CodeMirror Settings
var CodeMirror = require('codemirror')
require('codemirror/mode/htmlmixed/htmlmixed')
require('codemirror/mode/slim/slim')
require('codemirror/mode/javascript/javascript')
require('codemirror/mode/css/css')
require('codemirror/mode/sql/sql')
require('codemirror/addon/runmode/runmode.js')
require('codemirror/addon/edit/matchbrackets.js')

require('compose-remote-form')
require('compose-time-toggle')

require('./utils/activate-nav-items')
require('./utils/auto-navigate')
require('./utils/clipboard')
require('./utils/form-flash')
require('./utils/form-notify')
require('./utils/highlight-code')
require('./utils/messages')
require('./utils/range-input-helper')
require('./utils/text-helpers')

require('./shims/classlist')

window.Megatron = module.exports = {
  Dialog: Dialog,
  notify: Notify,
  utils: utils,
  Event: Event,
  request: request,
  esvg: esvg,
  utils: {
    CodeMirror: CodeMirror,
    Toggler: Toggler
  }
}

// NProgress loading bar visualization
NProgress.configure({showSpinner: false})
Event.on(document, 'page:fetch', function() { NProgress.start() })
Event.on(document, 'page:change', function() { NProgress.done() })
Event.on(document, 'page:restore', function() { NProgress.remove() })

Event.on(document, 'click', '.nav_toggle', toggleNavigationMode)

function toggleNavigationMode(event) {
  event.target.blur()
  document.querySelector('body').classList.toggle('active-nav')
}
