var bean = require('bean')
var CodeMirror = require('codemirror')
var classie = require('classie')
var Toggler = require('./toggler')
var Messages = require('./messages')
var AutoNavigate = require('./auto-navigate')
var TextHelpers = require('./text-helpers')
var RangeInputHelper = require('./range-input-helper')
var Timeago = require('./time/timeago')
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
  Classie: classie,
  Toggler: Toggler,
  Messages: Messages,
  AutoNavigate: AutoNavigate,
  TextHelpers: TextHelpers,
  RangeInputHelper: RangeInputHelper,

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
      if (classie.has(element, 'language-'+lang)) {
        classie.remove(element, 'language-'+lang)
        classie.add(element, 'lang-'+lang)
      }
      var code = element.textContent.trim()

      var options = {}
      if(lang == 'json') { 
        options.json = true 
      }

      CodeMirror.runMode(code, aliasLang(lang), element, options)
      element.innerHTML = "<code class='highlighted-code static-code cm-s-default'>" + element.innerHTML + "</code>"
      classie.add(element, 'highlighted')
    }
  },

  linkHeadings: function linkHeadings(){
    var headings = document.querySelectorAll('h2, h3, h4')
    for(let i = 0; i < headings.length; i++){
      var heading = headings[i];
      if (heading.id != ''){
        heading.innerHTML = "<a href='#"+heading.id+"' class='heading-link'>"+ heading.innerHTML +"</a>"
        heading.className = heading.className + " linked_heading";
      }
    }
  },

  autoSizeTextarea: function autoSizeTextarea() {

    var autoHeight = function(node) {
      if (!node.className.match(/fixed/)) {
        var offset = node.offsetHeight - node.clientHeight;
        node.style.height = 'auto';
        node.style.height = (node.scrollHeight  + offset ) + 'px';
      }
    }
    Array.prototype.forEach.call(document.querySelectorAll('textarea'), autoHeight)

    bean.on(document.querySelector('body'), 'keyup', 'textarea', function(event){
      autoHeight(event.currentTarget)
    })
  },

  notifyFormFlash: function notifyFormFlash(){
    var flash = document.querySelector('.form-flash')
    if (flash) {
      var type = flash.dataset.type || 'error'
      if (type == 'info') type = 'action'
      notify[type](flash.textContent.trim())
      classie.add(flash, 'hidden')
    }
  },

  autofocus: function autofocus() {
    var focus_el = document.querySelector('.autofocus')
    if (focus_el) {
      focus_el.focus()
    }
  }
}
