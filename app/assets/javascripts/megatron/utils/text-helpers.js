var bean = require('bean')

var TextHelpers = {
  listen: function(){
    bean.on(document, "click", ".click-select, [data-click-select]", TextHelpers.selectOnClick)
  },

  setup: function() {
    TextHelpers.linkHeadings()
    TextHelpers.autoSizeTextarea()
    TextHelpers.autofocus()
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

    var autoHeight = function(node) {
      if (!node.className.match(/fixed/)) {
        var offset = node.offsetHeight - node.clientHeight;
        node.style.height = 'auto';
        node.style.height = (node.scrollHeight  + offset ) + 'px';
      }
    }
    Array.prototype.forEach.call(document.querySelectorAll('textarea:not(.no-auto-size)'), autoHeight)

    bean.on(document.querySelector('body'), 'keyup', 'textarea', function(event){
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
