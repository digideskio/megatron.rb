var bean = require('bean')
var Clipboard = require('./clipboard')

var TextHelpers = {
  listen: function(){
    bean.on(document, "click", ".click-select, [data-click-select]", TextHelpers.selectOnClick)
  },

  setup: function() {
    TextHelpers.linkHeadings()
    TextHelpers.autoSizeTextarea()
    TextHelpers.autofocus()
    Clipboard.setup()
  },

  selectOnClick(event) {
    var select = event.currentTarget.dataset['click-select']
    var target = [event.target]

    if (select) {
      target = document.querySelectorAll(select)
    }

    Array.prototype.forEach.call(target, function(el){
      if(el.hasAttribute('contenteditable')) {
        el.focus()
        document.execCommand('selectAll', false)
      } else {
        el.select()
      }
    })
  },

  linkHeadings: function linkHeadings(){
    var headings = document.querySelectorAll('h2[id], h3[id], h4[id], h5[id]')
    Array.prototype.forEach.call(headings, function(heading) {
      heading.innerHTML = "<a href='#"+heading.id+"' class='heading-link'>"+ heading.innerHTML +"</a>"
      heading.className = heading.className + " linked_heading";
    })
  },

  autoSizeTextarea: function autoSizeTextarea() {

    var wrapTextarea = function(node) {
      if (!node.classList.contains('fixed')) {
        if (!node.parentElement.classList.contains('textarea-size-wrapper')) {
          node.outerHTML = "<div class='textarea-size-wrapper'>"+node.outerHTML+"</div>"
        }
      }
    }
    var autoHeight = function(node) {
      if (!node.classList.contains('fixed')) {
        node.parentElement.style.height = node.style.height

        var offset = node.offsetHeight - node.clientHeight
        node.style.height = 'auto'
        var newHeight = (node.scrollHeight  + offset )
        var maxHeight = window.innerHeight * .95

        if (newHeight < maxHeight)
          node.style.height = newHeight + 'px'
        else
          node.style.height = maxHeight + 'px'

        node.parentElement.style.height = 'auto';
      }
    }
    Array.prototype.forEach.call(document.querySelectorAll('textarea'), wrapTextarea)
    Array.prototype.forEach.call(document.querySelectorAll('.textarea-size-wrapper textarea'), autoHeight)

    bean.on(document.querySelector('body'), 'keyup toggler:show', 'textarea', function(event){
      autoHeight(event.currentTarget)
    })
  },

  autofocus: function autofocus() {
    var focus_el = document.querySelector('.autofocus')
    if (focus_el) {
      focus_el.focus()
    }
  }
}

module.exports = TextHelpers
