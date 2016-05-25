var Event = require('compose-event')
var Notify = require('notify')
var request = require('superagent')
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
require('./utils/progress-bar')

require('./shims/classlist')

window.Megatron = module.exports = {
  Dialog: Dialog,
  notify: Notify,
  Event: Event,
  request: request,
  esvg: esvg,
  utils: {
    CodeMirror: CodeMirror,
    Toggler: Toggler
  }
}

