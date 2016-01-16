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
    // If there are no custom labels, automatically add a default label.
    if (RangeInputHelper.objectSize(RangeInputHelper.getLabels(slider)) == 0) {
      slider.dataset['labelDefault' + String(parseInt(Math.random() * 10000))] = true
    }

    return "<div class='slider-container'>"
      + RangeInputHelper.segmentTemplate(slider)
      + RangeInputHelper.labelTemplate(slider)
      + "</div>"
      + RangeInputHelper.inputTemplate(slider)
  },
  
  segmentTemplate: function(slider){
    var html = ""

    if (slider.dataset.mark) {
      var mark = []
      var segments = RangeInputHelper.segments(slider)

      slider.className += ' range-input-slider'
      mark = slider.dataset.mark.split(',').map(Number)
  
      for(var i = 0; i < segments; i++) {
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
        var altKey = RangeInputHelper.camelCase(key)
        var before = slider.dataset.beforeLabel || slider.dataset[altKey+'BeforeLabel']
        var after  = slider.dataset.afterLabel || slider.dataset[altKey+'AfterLabel']

        html += "<span class='range-label-"+key+"'>"
        if (before) { html += "<span class='before-label'>"+before+"</span>" }
        html += "<span data-label='"+key+"'></span>"
        if (after)  { html += "<span class='after-label'>"+after+"</span>" }
        html += "</span> "
      }
    }

    html = "<div class='range-label'>" + html + "</div>"

    return html
  },

  inputTemplate: function(slider) {
    var html = ""
    if (slider.dataset.input) {
      if (!document.querySelector('[name="'+slider.dataset.input+'"]')) html += "<input type='hidden' name='"+slider.dataset.input+"'>"
    }
    return html
  },
  
  getLabels: function(slider) {
    var labels = {}
  
    // Find all data-label attributes
    for (var i = 0; i < slider.attributes.length; i++){
      var name = slider.attributes[i].nodeName

      if(/^data-label-/.test(name)) {

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
        if (labels[key] == 'true') {
          if(slider.dataset.values){
            target.innerHTML = slider.dataset.values.split(',')[RangeInputHelper.rangeValueIndex(slider)]
          } else {
            target.innerHTML = slider.value
          }
        } else {
          target.innerHTML = labels[key].split(';')[RangeInputHelper.rangeValueIndex(slider)]
        }
      })
    }
  },

  setInput: function(slider) {
    if(slider.dataset.input && slider.dataset.values) {
      var value = slider.dataset.values.split(',')[RangeInputHelper.rangeValueIndex(slider)]
      var input = document.querySelector("input[name="+slider.dataset.input+"]")
      if(input) input.value = value
    }
  },
  
  segments: function(slider){
    return Number(slider.getAttribute('max')) - Number(slider.getAttribute('min')) + 1
  },
  
  rangeValueIndex: function(slider){
    return Number(slider.value) - Number(slider.getAttribute('min'))
  },

  objectSize: function(object) {
    var length = 0; for(var i in object) { length++ }
    return length
  },

  camelCase: function(input) {
    return input.toLowerCase().replace(/-(.)/g, function(match, group) {
      return group.toUpperCase();
    });
  }
}

module.exports = RangeInputHelper
