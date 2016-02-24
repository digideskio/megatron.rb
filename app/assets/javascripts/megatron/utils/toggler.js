var bean = require('bean')

require('compose-tap-event')

var Toggler = {
  checkboxSelector: "[type=checkbox][data-toggle], [type=checkbox][data-show], [type=checkbox][data-hide]",
  radioSelector: "input[type=radio][data-show], input[type=radio][data-add-class]",
  selectSelector: "option[data-show]",

  listen: function togglerListen(){
    bean.on(document, "click", "[data-toggle], [data-show], [data-hide], [data-toggle-class], [data-add-class], [data-remove-class]", Toggler.trigger)
    bean.on(document, "change", ".select-toggler", Toggler.trigger)
  },

  refresh: function togglerRefresh(){
    Toggler.toggleRadios()
    Toggler.toggleCheckboxes()
    Toggler.setupSelects()
  },

  trigger: function togglerTrigger(event) {
    var target = event.currentTarget

    if (target.tagName.toLowerCase() == 'a' && target.getAttribute('href') == "#") {
      event.preventDefault()
      event.stop()
    } 

    if (target.type == 'radio') {
      Toggler.toggleRadios(document.querySelectorAll('input[name="'+ target.name +'"]'))
      Toggler.dispatch(target, 'addClass')
    } else if (target.type == 'checkbox') {
      Toggler.toggleCheckbox(target)
    } else if (target.tagName.toLowerCase() == 'select') {
      Toggler.toggleSelect(target)
    } else {
      Toggler.dispatch(target, 'hide')
      Toggler.dispatch(target, 'toggle')
      Toggler.dispatch(target, 'show')
      Toggler.dispatch(target, 'removeClass')
      Toggler.dispatch(target, 'toggleClass')
      Toggler.dispatch(target, 'addClass')
    }
  },

  dispatch: function togglerDispatch(el, type, force) {
    var dispatchedElements

    if (el.dataset[type]){
      if (type.match(/class/i)){
        Toggler.setClass(el.dataset[type], type, el)
      } else {
        Toggler.setState(el.dataset[type], type)
      }
    }
  },

  // Add, remove, or toggle classnames, triggered by elements with:
  //  data-hide-class, data-show-class, and data-toggle-class values
  //
  //  Data value examples:
  //   - "classname" - add/remove/toggle classname on current element
  //   - "foo bar"   - multiple classnames, separated by spaces (like html class property)
  //   - "foo bar; selector" - change classnames on elements matched by selector
  //   - "foo bar; selector, selector" - match multiple selectors
  //

  setClass: function (selectors, action, el){
    if (typeof(action) == 'boolean') {
      action = (action ? 'add' : 'remove')
    }

    // Get selector and classnames, format: "classname classname; selector,selector"
    var settings = selectors.split(';')
    var classnames = settings[0].trim()
    var matches = []
    selectors = settings[1]

    // If no slectors are present, use the current el for classnames
    if (selectors) {
      matches = document.querySelectorAll(selectors)
    } else {
      matches = [el]
    }

    Array.prototype.forEach.call(matches, function(match){
      Array.prototype.forEach.call(classnames.split(' '), function(classname) {
        match.classList[action.replace(/Class/,'')](classname)
      })

      Toggler.triggerTogglerEventsOnChildren(match, 'class')
    })
  },

  setState: function(selectors, state) {
    var matches = document.querySelectorAll(selectors)

    Array.prototype.forEach.call(matches, function(match){
      var action = Toggler.toggleAction(match, state)

      Toggler[action](match)
      Toggler.triggerTogglerEventsOnChildren(match, action)
    })
  },

  toggleAction: function(el, action) {

    if (typeof(action) == 'boolean') {
      action = (action ? 'show' : 'hide')
    }

    if (action == 'toggle') {
      if (el.offsetParent === null) {
        action = 'show'
      } else {
        action = 'hide'
      }
    }

    return action

  },

  show: function(el) {
    el.classList.remove('hidden')
    el.classList.add('visible')

    // Focus on key element if an element expects focus
    var focusEl = el.querySelector('[data-focus]')
    if (focusEl) { focusEl.focus() }

    // Trigger input event on ranges that have been hidden
    var ranges = el.querySelectorAll('[type=range]')
  },

  hide: function togglerHide(el) {
    el.classList.remove('visible')
    el.classList.add('hidden')
  },

  getLeafNodes: function (parent) {
    // is the parent itself a leaf node?
    if (!parent.hasChildNodes()) return [parent]

    var nodes = Array.prototype.slice.call(parent.getElementsByTagName("*"), 0)

    return nodes.filter(function(elem) {
      return elem.children && elem.children.length === 0
    })
  },

  triggerTogglerEventsOnChildren: function(el, eventName){
    // we care about leaf nodes since the event will bubble to
    // non-leaf nodes from the leaf nodes
    var leafChildNodes = Toggler.getLeafNodes(el)

    Array.prototype.forEach.call(leafChildNodes, function(node) {
      // 'toggler:show', 'toggler:hide', etc
      bean.fire(node, "toggler:" + eventName)
    })
  },

  toggleRadios: function togglerToggleRadio(radios) {
    radios = radios || document.querySelectorAll('input[type=radio][data-show], input[type=radio][data-add-class]')

    var checked = []
    var process = function(radio) {
      if (radio.dataset.show)
        Toggler.setState(radio.dataset.show, radio.checked)

      if (radio.dataset.addClass)
        Toggler.setClass(radio.dataset.addClass, radio.checked)
    }

    Array.prototype.forEach.call(radios, function(radio){
      if (radio.checked) {
        checked.push(radio)
      } else {
        process(radio)
      }
    })

    Array.prototype.forEach.call(checked, process)
  },

  toggleCheckbox: function togglerToggeCheckbox(checkbox) {
    // Visibility toggling
    if (checkbox.dataset.hide)
      Toggler.setState(checkbox.dataset.hide, !checkbox.checked)
    if (checkbox.dataset.toggle)
      Toggler.setState(checkbox.dataset.toggle, 'toggle')
    if (checkbox.dataset.show)
      Toggler.setState(checkbox.dataset.show, checkbox.checked)

    // Class toggling
    if (checkbox.dataset.removeClass)
      Toggler.setClass(checkbox.dataset.removeClass, !checkbox.checked, checkbox)
    if (checkbox.dataset.toggleClass)
      Toggler.setClass(checkbox.dataset.toggleClass, 'toggle', checkbox)
    if (checkbox.dataset.addClass)
      Toggler.setClass(checkbox.dataset.addClass, checkbox.checked, checkbox)
  },

  toggleSelect: function togglerToggleSelect(select) {
    var option = select.selectedOptions[0]
    Toggler.dispatch(option, 'hide')
    Toggler.dispatch(option, 'show')
    Toggler.dispatch(option, 'addClass')
    Toggler.dispatch(option, 'removeClass')
  },

  toggleCheckboxes: function togglerToggleCheckboxes(checkboxes) {
    checkboxes = checkboxes || document.querySelectorAll(Toggler.checkboxSelector)

    Array.prototype.forEach.call(checkboxes, Toggler.toggleCheckbox)
  },

  // Add data-hide to each <option> containing the selectors from other
  // option's data-show. This makes the toggling of elements exclusive.
  //
  setupSelects: function togglerSetupSelects(selects){
    selects = selects || document.querySelectorAll(Toggler.selectSelector)

    Array.prototype.forEach.call(selects, function(option){
      if (!option.dataset.hide) {

        var select = Toggler.getSelectFromOption(option)
        select.classList.add('select-toggler')
        var options = select.querySelectorAll('option')
        var selectors = Toggler.showAttributes(options)

        Array.prototype.forEach.call(options, function(o) {
          option.dataset.hide = selectors.filter(function(selector){
            return option.dataset.show != selector && selector != ""
          }).join(',')
        })

        // Ensure that currently selected option is toggled properly
        //
        Toggler.toggleSelect(select)
      }
    })
  },

  // Find parent <select> for an option (accounts for option groups)
  //
  getSelectFromOption: function togglerGetSelectFromOption(el) {
    var p = el.parentElement

    if (p.tagName.toLowerCase() == 'select') {
      return p
    } else {
      return Toggler.getSelectFromOption(p)
    }
  },

  // Return an array of all data-show values from elements
  //
  showAttributes: function togglerShowAttributes(elements) {
    return Array.prototype.map.call(elements, function(el) { 
      return el.dataset.show
    })
  },

  toggleSelects: function togglerToggleSelects(selects) {
    var selects = selects || 'option[data-show]'

    Array.prototype.forEach.call(document.querySelectorAll(radios), function(radio) {
      Toggler.setState(radio.dataset.show, radio.checked)
    })
  }
}

module.exports = Toggler
