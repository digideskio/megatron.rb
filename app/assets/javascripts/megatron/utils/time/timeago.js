// Timeago by Brandon Mathis, based on JavaScript Pretty Date Copyright (c) 2011 John Resig
// Returns relative time

let Timeago = {
  // setup HTML templates
  setup: function timeagoSetup() {

    var timeEls = document.querySelectorAll('.timeago[datetime]')

    Array.prototype.forEach.call(timeEls, function(el) {
      var datetime = el.attributes.datetime.value
      var style = el.dataset.timeagoStyle
      el.innerHTML = Timeago.parse(datetime, style)
    })
  },

  // If a browser can't handle dates, bail.
  browserSupport: function timeagoBrowserSupport() {
    return !isNaN(new Date("2014-01-29T18:14:29+00:00").getDate())
  },

  parse: function timeagoParse(time, style) {

    style = style || "normal"
    if (typeof(time) == 'string') {
      time = new Date(time)
    }

    if (style === 'short')
    var say = {
      just_now:    "now",
      minute_ago:  "1m",
      minutes_ago: "m",
      hour_ago:    "1h",
      hours_ago:   "h",
      yesterday:   "1d",
      days_ago:    "d",
      last_week:   "1w",
      weeks_ago:   "w"
    }

    if (style === 'normal')
    var say = {
      just_now:    "just now",
      minute_ago:  "1 minute",
      minutes_ago: " minutes",
      hour_ago:    "1 hour",
      hours_ago:   " hours",
      yesterday:   "1 day",
      days_ago:    " days",
      last_week:   "1 week",
      weeks_ago:   " weeks"
    }

    if (style === 'long')
    var say = {
      just_now:    "just now",
      minute_ago:  "1 minute ago",
      minutes_ago: " minutes ago",
      hour_ago:    "1 hour ago",
      hours_ago:   " hours ago",
      yesterday:   "1 day ago",
      days_ago:    " days ago",
      last_week:   "1 week ago",
      weeks_ago:   " weeks ago"
    }

    var secs   = ((new Date().getTime() - new Date(time).getTime()) / 1000)
    var mins   = Math.floor(secs / 60)
    var hours  = Math.floor(secs / 3600)
    var days   = Math.floor(secs / 86400)
    var weeks  = Math.floor(days / 7)
    var months = Math.floor(days / 30)

    if(isNaN(secs) || days < 0) {
      return false
    }

    if(days === 0) {
      if     (secs < 60)   return say.just_now
      else if(secs < 120)  return say.minute_ago 
      else if(secs < 3600) return mins + say.minutes_ago 
      else if(secs < 7200) return say.hour_ago
      else                 return hours + say.hours_ago
    } else {
      if(days === 1)       return say.yesterday
      else if(days < 7)    return days + say.days_ago
      else if(weeks === 1) return say.last_week
      else                 return weeks + say.weeks_ago
    }
  }
}

module.exports = Timeago

