var Event = require('compose-event')

// Minor text behaviors

var TextHelpers = {
  listen: function(){
    Event.on(document, "click", ".click-select, [data-click-select]", TextHelpers.selectOnClick)
  },

  setup: function() {
    TextHelpers.linkHeadings()
    TextHelpers.autoSizeTextarea()
    TextHelpers.autofocus()
  },

  // Make it easy to set a range selection
  //
  selectOnClick(event) {
    var select = event.currentTarget.dataset.clickSelect
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

  // Use heading ids to create an on-page anchor
  // link to make it easy to link to headings on a page
  //
  linkHeadings: function linkHeadings(){
    var headings = document.querySelectorAll('h2[id], h3[id], h4[id], h5[id]')
    Array.prototype.forEach.call(headings, function(heading) {
      heading.innerHTML = "<a href='#"+heading.id+"' class='heading-link'>"+ heading.innerHTML +"</a>"
      heading.className = heading.className + " linked_heading";
    })
  },

  // Resize textareas to fit the contents as a user types
  //
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

    Event.on(document.querySelector('body'), 'keyup toggler:show', 'textarea', function(event){
      autoHeight(event.currentTarget)
    })
  },

  // Focus on the first element with the class .autofocus, when the page loads
  //
  autofocus: function autofocus() {
    var focus_el = document.querySelector('.autofocus')
    if (focus_el) {
      focus_el.focus()
    }
  }
}

Event.ready(TextHelpers.listen)
Event.change(TextHelpers.setup)
