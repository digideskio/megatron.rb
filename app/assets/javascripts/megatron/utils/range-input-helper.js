var bean = require('bean')

require('compose-tap-event')
require('compose-dataset-shim')

var RangeInputHelper = {
  listen: function(){
    bean.on(document, "input", "[type=range], refresh", RangeInputHelper.change)
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
    return RangeInputHelper.rangeTemplate(slider)
      + RangeInputHelper.inputTemplate(slider)
  },
  
  rangeTemplate: function(slider){
    var html = ""
    var lineLabels = RangeInputHelper.lineLabels(slider)
    
    // If there are no custom labels, automatically add a default label.
    if (RangeInputHelper.objectSize(RangeInputHelper.getLabels(slider)) == 0) {
      slider.dataset['labelDefault' + String(parseInt(Math.random() * 10000))] = true
    }

    if (slider.dataset.mark || slider.dataset.lineLabels) {
      var segments = RangeInputHelper.segments(slider)

      slider.className += ' range-input-slider'
      var mark = slider.dataset.mark.split(',').map(Number)
      
      for(var i = 1; i <= segments; i++) {
        var markClass = ((mark.indexOf(i) != -1) ? ' mark' : '')
        var lineLabel = lineLabels[String(i)]
        
        html += "<div class='range-segment"+markClass+"'>"
        if (lineLabel) {
          html += "<span class='range-line-label'>"+lineLabel+"</span>"
        }
        html += "</div>"
      }

      html = "<div class='range-track'>" + html + "</div>"
      html = "<div class='range-input-container'>" + slider.outerHTML + html + "</div>"
    } else {
      html = slider.outerHTML
    }

    var labelHTML = RangeInputHelper.labelTemplate(slider)
    
    return "<div class='slider-container"
    + (RangeInputHelper.objectSize(lineLabels) > 0 ? " line-labels" : "")
    + (labelHTML.length > 0 ? " with-label" : " without-label")
    + "'>"
    + html
    + labelHTML
    + "</div>"
  },

  lineLabels: function(slider){
    var lineLabels = {}
    if(slider.dataset.lineLabels) {
      slider.dataset.lineLabels.split(';').map(function(labels){
        var l = labels.split(':')
        lineLabels[l[0]] = l[1]
      })
    }
    return lineLabels
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

    if (html.length > 0) {
      html = "<div class='range-label'>" + html + "</div>"
    }

    return html
  },

  inputTemplate: function(slider) {
    if (slider.dataset.input) {
      var classname = slider.dataset.input.replace(/\W/g,'-')
      return "<input class='"+classname+"' type='hidden' name='"+slider.dataset.input+"'>"
    } else return ""
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
        var index = RangeInputHelper.rangeValueIndex(slider)
        target.innerHTML = RangeInputHelper.getLabelsAtIndex(slider, index)[key]
      })
    }
  },

  setInput: function(slider) {
    if(slider.dataset.input && slider.dataset.values) {
      var value = slider.dataset.values.split(',')[RangeInputHelper.rangeValueIndex(slider)]
      var selector = "."+slider.dataset.input.replace(/\W/g,'-')
      var inputs = document.querySelectorAll(selector)

      Array.prototype.forEach.call(inputs, function(input){
        input.value = value
      })
    }
  },

  getLabelsAtIndex: function(slider, index){
    var labels = RangeInputHelper.getLabels(slider)
    for (var key in labels) {
      if (labels[key] == 'true') {
        if(slider.dataset.label) {
          labels[key] = slider.dataset.label.split(';')[index]
        } else if(slider.dataset.values){
          labels[key] = slider.dataset.values.split(',')[index]
        } else {
          labels[key] = slider.value
        }
      } else {
        labels[key] = labels[key].split(';')[index]
      }
    }
    return labels
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
