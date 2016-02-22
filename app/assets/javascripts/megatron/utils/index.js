var bean = require('bean')
var CodeMirror = require('codemirror')
var Toggler = require('./toggler')
var Messages = require('./messages')
var AutoNavigate = require('./auto-navigate')
var TextHelpers = require('./text-helpers')
var RangeInputHelper = require('./range-input-helper')
var Timeago = require('./time/timeago')
var Clipboard = require('./clipboard')
var TimeSwitch = require('./time/time-switch')
var notify = require('notify')

require('codemirror/mode/htmlmixed/htmlmixed')
require('codemirror/mode/slim/slim')
require('codemirror/mode/javascript/javascript')
require('codemirror/mode/css/css')
require('codemirror/mode/sql/sql')
require('codemirror/addon/runmode/runmode.js')
require('codemirror/addon/edit/matchbrackets.js')

module.exports = {
  Timeago: Timeago,
  TimeSwitch: TimeSwitch,
  CodeMirror: CodeMirror,
  Toggler: Toggler,
  Messages: Messages,
  AutoNavigate: AutoNavigate,
  TextHelpers: TextHelpers,
  RangeInputHelper: RangeInputHelper,
  Clipboard: Clipboard,

  toggleActiveNav: function toggleActiveNav(){
    Array.prototype.forEach.call(document.querySelectorAll('[data-match-url]'), function(node){
      var matcher = node.getAttribute('data-match-url')
      if (matcher && new RegExp(node.getAttribute('data-match-url'), "i").test(location.pathname)) {
        node.className += ' here'
      }
    })
  },

  highlightCode: function highlightCode(){
    var aliasLang = function(lang) {
      var aliases = {
        'markup': 'htmlmixed',
        'html': 'htmlmixed',
        'json': 'javascript',
      }

      return(aliases[lang] || lang)
    }
    var elements = document.querySelectorAll('[class*="language-"], [class*="lang-"]');
    for (var i=0, element; element = elements[i++];) {
      var lang = element.className.match(/lang.*?-(\S+)/)[1]

      // Standardize classes: lang-[language]
      if (element.classList.contains('language-'+lang)) {
        element.classList.remove('language-'+lang)
        element.classList.add('lang-'+lang)
      }
      var code = element.textContent.trim()

      var options = {}
      if(lang == 'json') { 
        options.json = true 
      }

      CodeMirror.runMode(code, aliasLang(lang), element, options)
      element.innerHTML = "<code class='highlighted-code static-code cm-s-default'>" + element.innerHTML + "</code>"
      element.classList.add('highlighted')
    }
  },

  notifyFormFlash: function notifyFormFlash(){
    var flash = document.querySelector('.form-flash')
    if (flash) {
      var type = flash.dataset.type || 'error'
      if (type == 'info') type = 'action'
      notify[type](flash.textContent.trim())
      flash.classList.add('hidden')
    }
  }

}
