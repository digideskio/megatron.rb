// Converts a simple date string into Date + Time + Timezone wrapped in HTML
//
// Input:
// - String, compatible with JS date parsing e.g. "2014-10-20" or "2014-05-21 10:63"
// - String, timezone: "UTC", "CST", etc.
//
// Returns: HTML which is "2014-01-28 18:00:00 CST", separated and wrapped with spans
// with classnames: date, time and timezone
//
var dateToHtml = function (dateString, zone) {

  if(isNaN(new Date("2014-01-29T18:14:29+00:00").getDate())) {
    return false
  }
  
  var date = new Date(dateString)
  var zone = zone || date.getTimezoneOffset()/-60

  if(zone === 'UTC') {
    var y  = date.getUTCFullYear()
    var mo = pad(date.getUTCMonth() + 1)
    var d  = pad(date.getUTCDate())
    var h  = pad(date.getUTCHours())
    var m  = pad(date.getUTCMinutes())
    var s  = pad(date.getUTCSeconds())
  } else {
    var y  = date.getFullYear()
    var mo = pad(date.getMonth() + 1)
    var d  = pad(date.getDate())
    var h  = pad(date.getHours())
    var m  = pad(date.getMinutes())
    var s  = pad(date.getSeconds())
    
    var tz = String(date).match(/\((.+)\)$/)

    if(tz) {
      var zone = tz[1]
    } else {
      var zone = "GMT " 
          zone += ((zone > 0) ? '+' : '')
          zone += " "+ pad(zone*100, 4)
    }
  }

  var str = '<span class="date">'+y+'-'+mo+'-'+d+'</span>'
  str += ' <span class="time">'+h+':'+m+':'+s+'</span>'
  str += ' <span class="timezone">'+zone+'</span>'
  return str
}

var pad = function(num, pad){
  pad = pad || 2
  while(String(num).length < pad) {
    num = '0' + num
  }
  return num
}

module.exports = dateToHtml
