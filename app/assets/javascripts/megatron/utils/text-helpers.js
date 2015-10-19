var bean = require('bean')

var helpers = {
  load: function(){
    bean.on(document, "click", ".click-select, [data-click-select]", helpers.selectOnClick)
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
  }
}

module.exports = helpers
