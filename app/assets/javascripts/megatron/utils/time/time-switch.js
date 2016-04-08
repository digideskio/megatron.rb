var timeago = require('./timeago')
var dateToHtml = require('./date-to-html')
var event = require('compose-event')

var TimeSwitch = {

  // Attach listeners, setup HTML templates
  setup: function timeSwitchSetup() {
    if(!timeago.browserSupport()) return false
    if(!this.listening)   this.listen()

    var timeEls = document.querySelectorAll('.time-switch[datetime]')

    Array.prototype.forEach.call(timeEls, function(el) {
      var datetime = el.getAttribute('datetime')
      var timeagoPosition = el.dataset.timeago
      var timeagoStyle = el.dataset.timeagoStyle
      el.innerHTML = TimeSwitch.template(datetime, timeagoPosition, timeagoStyle)
      el.classList.add('time-switch')
      el.setAttribute('title', 'toggle timezones')
    })
  },

  // Attach listeners to toggle time zones whine clicked
  listen: function timeSwitchListen() {
    event.on(document, "click", ".time-switch", TimeSwitch.toggle)
    this.listening = true
  },

  // Switch between UTC and local time
  toggle: function timeSwitchToggle(event) {
    var timeEls = document.querySelectorAll('.time-switch')

    Array.prototype.forEach.call(timeEls, function(el) {
      el.classList.toggle('alt-zone')
    })
  },

  // Supply HTML for UTC and local datetime
  //
  // Input:
  //  - date (a date object)
  //  - timeagoPosition, String, either 'before' or 'after'
  //
  template: function timeSwitchTemplate(date, timeagoPosition, timeagoStyle) {
    var utc = dateToHtml(date, 'UTC')
    var local = dateToHtml(date)
    var t = '';

    if (timeagoPosition === 'before') {
      t += this.timeagoTemplate(date, timeagoPosition, timeagoStyle)
    }

    t += "<span class='utc'><span class='clock_line_icon'></span> "
    t += utc + "</span>"
    t += "<span class='local'><span class='clock_fill_icon'></span> "
    t += local + "</span>"

    if (timeagoPosition === 'after') {
      t += this.timeagoTemplate(date, timeagoPosition, timeagoStyle)
    }

    return t
  },

  // Converts a date to relative time string wrapped in a span
  timeagoTemplate: function timeSwitchTimeagoTemplate(date, position, style) {
    var relative = timeago.parse(date, style)
    var dash = "<span class='dash'>&nbsp;-&nbsp;</span>"
    var html = ''

    if(relative) {
      if (position === 'after') html += dash
      html += "<span class='timeago'>"+ relative +"</span> "
      return html
    } else {
      return ''
    }
  }

}

module.exports = TimeSwitch

