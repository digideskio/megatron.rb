var Event = require('compose-event')
var NProgress = require('nprogress')

// NProgress loading bar visualization
//
NProgress.configure({showSpinner: false})
Event.on(document, 'page:fetch', function() { NProgress.start() })
Event.on(document, 'page:change', function() { NProgress.done() })
Event.on(document, 'page:restore', function() { NProgress.remove() })
