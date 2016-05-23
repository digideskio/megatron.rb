var Event = require('compose-event')
var CodeMirror = require('codemirror')

var aliasLang = function(lang) {
  var aliases = {
    'markup': 'htmlmixed',
    'html': 'htmlmixed',
    'json': 'javascript',
  }

  return(aliases[lang] || lang)
}

var highlightCode = function() {
  var elements = document.querySelectorAll('[class*="language-"], [class*="lang-"]');

  if (elements == null) { return }
  Array.prototype.forEach.call(elements, function(element) {
    var lang = element.className.match(/lang.*?-(\S+)/)[1]

    // Standardize classes: lang-[language]
    if (element.classList.contains('language-'+lang)) {
      element.classList.remove('language-'+lang)
      element.classList.add('lang-'+lang)
    }
    var code = element.textContent.trim()

    var options = {}
    if(lang == 'json') { 
      options.json = true 
    }

    CodeMirror.runMode(code, aliasLang(lang), element, options)
    element.innerHTML = "<code class='highlighted-code static-code cm-s-default'>" + element.innerHTML + "</code>"
    element.classList.add('highlighted')
  })
}

Event.change(highlightCode)
