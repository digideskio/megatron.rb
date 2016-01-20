var utils = require('./utils')
var bean = require('bean')
var Dialog = require('dialog')
var tap = require('tap-event')
var Form = require('./form')
var Link = require('./link')
var _ = require('lodash')
var notify = require('notify')
var request = require('superagent')
var NProgress = require('nprogress')
var esvg = require('./esvg')

window.Megatron = module.exports = {
  Dialog: Dialog,
  notify: notify,
  utils: utils,
  Event: bean,
  Toggler: utils.Toggler,
  Form: Form,
  request: request,
  Link: Link,
  esvg: esvg,
  _: _
}

bean.on(document, 'DOMContentLoaded', pageLoad)

// Support rails turbolinks page load event
bean.on(document, 'page:change', pageChange)

NProgress.configure({showSpinner: false})

bean.on(document, 'page:fetch', function() { NProgress.start() })
bean.on(document, 'page:change', function() { NProgress.done() })
bean.on(document, 'page:restore', function() { NProgress.remove() })

function pageLoad(){
  utils.Toggler.listen()
  utils.AutoNavigate.listen()
  utils.TextHelpers.load()
  if(!window.Turbolinks) {
    pageChange()
  }
}

function pageChange(){
  utils.linkHeadings()
  utils.toggleActiveNav()
  utils.autoSizeTextarea()
  utils.highlightCode()
  utils.Toggler.refresh()
  utils.autofocus()
  utils.notifyFormFlash()
  utils.TimeSwitch.setup()
  utils.Timeago.setup()
  utils.Messages.load()
  utils.RangeInputHelper.setup()
}

// Dialog document listener and auto-creator
bean.on(document, 'click', '[data-trigger=dialog]', handleDialogTrigger)
bean.on(document, 'click', '[data-trigger=dialog]', tap(handleDialogTrigger))
bean.on(document, 'click', '.nav_toggle', toggleNavigationMode)

function handleDialogTrigger(event){
  event.preventDefault()
  new Dialog(event.currentTarget.dataset).show()
}

function toggleNavigationMode(event) {
  event.target.blur()
  utils.Classie.toggle(document.querySelector('body'), 'active-nav')
}

function disableWith(event){
  var buttons = event.currentTarget.querySelectorAll('[data-disable-with]')
  Array.prototype.forEach.call(buttons, function(button){
    button.disabled = true
    utils.Classie.add(button, 'disabled')

    var buttonText = button.dataset.disableWith
    if (!buttonText || buttonText == '') { buttonText = button.innerHTML }

    button.innerHTML = buttonText.replace(/\.{3}/, '…')
  })
}

// If jQuery exists, be sure Rails UJS doesn't
if (!window.$ || !$.rails) {
  var boundForms = []
  // Form event listener
  bean.on(document, 'submit', 'form[data-remote]', handleRemoteFormSubmit)
  bean.on(document, 'submit', 'form', disableWith)
  bean.on(document, 'click', 'a[data-method], a[data-confirm], button[data-method], button[data-confirm]', Link.click)
}

function handleRemoteFormSubmit(event){
  if (_.find(boundForms, function(el){return el == event.currentTarget}))
    return
  new Form({el: event.currentTarget}).submit(event)
  boundForms.push(event.currentTarget)
}
