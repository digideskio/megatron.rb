var bean = require('bean')

require('compose-tap-event')
require('compose-dataset-shim')

var RangeInputHelper = {
  listen: function(){
    bean.on(document, "input", "[type=range]", RangeInputHelper.change)
    bean.on(document, "click change input", "[type=range]", RangeInputHelper.focus)
  },

  change: function(event) {
    RangeInputHelper.refresh(event.currentTarget)
  },

  refresh: function (slider) {
    RangeInputHelper.setLabels(slider)
    RangeInputHelper.setInput(slider)
  },
  
  focus: function(event){
    event.currentTarget.focus()
  },
                              
  setup: function(){
    var ranges = document.querySelectorAll('[type=range]')
    Array.prototype.forEach.call(ranges, RangeInputHelper.initSlider)
    RangeInputHelper.listen()
  },
  
  initSlider: function(slider){
    RangeInputHelper.setLabels(slider)
    slider.insertAdjacentHTML('beforebegin', RangeInputHelper.template(slider))
    slider.remove()
    RangeInputHelper.refresh(slider)
  },
  
  template: function(slider){
    return "<div class='slider-container'>"
      + RangeInputHelper.segmentTemplate(slider)
      + RangeInputHelper.labelTemplate(slider)
      + "</div>"
      + RangeInputHelper.inputTemplate(slider)
  },
  
  segmentTemplate: function(slider){
    var html = ""

    if (slider.dataset['mark']) {
      var mark = []
      slider.className += ' range-input-slider'      
      mark = slider.dataset['mark'].split(',').map(Number)
      
      for(var i = 1; i <= Number(slider.getAttribute('max')); i++) {
        html += "<div class='range-segment"+((mark.indexOf(i) != -1) ? ' mark' : '')+"'></div>"
      }
    
      html = "<div class='range-track'>" + html + "</div>"
      html = "<div class='range-input-container'>" + slider.outerHTML + html + "</div>"
    } else {
      html = slider.outerHTML
    }
    
    return html
  },
  
  labelTemplate: function(slider){
    var html = ""
    
    for(var key in RangeInputHelper.getLabels(slider)){
      if (!document.querySelector('[data-label='+key+']')){
        html += "<span class='range-label-"+key+"' data-label='"+key+"'></span> "
      }
    }
    if (html != "") html = "<div class='range-label'>" + html + "</div>"

    return html
  },

  inputTemplate: function(slider) {
    var html = ""
    if (slider.dataset['input']) {
      if (!document.querySelector('[name="'+slider.dataset['input']+'"]')) html += "<input type='hidden' name='"+slider.dataset['input']+"'>"
    }
    return html
  },
  
  getLabels: function(slider) {
    var labels = {}
  
    // Find all data-label attributes
    for (var i = 0; i < slider.attributes.length; i++){
      var name = slider.attributes[i].nodeName

      if(/^data-label/.test(name)) {

        // Extract label name
        name = name.replace(/data-label-/, '')
        labels[name] = slider.attributes[i].nodeValue
      }
    }
    return labels
  },

  setLabels: function(slider) {
    var labels = RangeInputHelper.getLabels(slider)
    for (var key in labels) {
      var selector = '[data-label='+key+']'
      var els = document.querySelectorAll(selector)
      Array.prototype.forEach.call(els, function(target) {
        target.innerHTML = labels[key].split(';')[Number(slider.value) - 1]
      })
    }
  },

  setInput: function(slider) {
    if(slider.dataset['input'] && slider.dataset['values']) {
      var value = slider.dataset['values'].split(',')[Number(slider.value) - 1]
      var input = document.querySelector("input[name="+slider.dataset['input']+"]")
      if(input) input.value = value
    }
  }
}

module.exports = RangeInputHelper
