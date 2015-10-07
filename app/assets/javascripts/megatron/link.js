var domify = require('domify')
var Dialog = require('dialog')
var bean = require('bean')

module.exports = Link

var counter = 0
var DEFAULT_CONTINUE_BUTTON = 'Yes'

function Link(){}

Link.click = function linkClick(event){
  event.preventDefault()
  var el = event.currentTarget
  var form = null
  if (el.dataset.method) {
    form = Link.buildForm(el)
    document.body.appendChild(form)
  }

  if (el.dataset.confirm) {
    var opts = {
      title: el.dataset.confirm,
      message: el.dataset.message || null,
      continue: el.dataset.continue || DEFAULT_CONTINUE_BUTTON
    }
    if (el.dataset.method) {
      opts.submit = '#' + form.getAttribute('id')
      if (el.dataset.method.toLowerCase() === 'delete') {
        opts.destructive = true
        opts.continue = el.dataset.continue || 'Delete'
      }
    } else {
      opts.follow = el.getAttribute('href')
      opts.destructive = !!el.dataset.destructive
      opts.submit = el.dataset.submit
    }

    new Dialog(opts).show()
  } else {
    form.submit()
  }
}

Link.buildForm = function buildForm(el){
  var method = el.dataset.method || 'post'
  var csrfToken = document.querySelector('meta[name=csrf-token]')
  var csrfParam = document.querySelector('meta[name=csrf-param]')

  var form = domify('<form id="link-'+ (++counter) +'" class="hidden" action="'+el.href+'" method="post"></form>')

  form.appendChild(domify('<input name="_method" value="' + method + '" type="hidden">'))

  if (csrfToken && csrfParam)
    form.appendChild(domify('<input name="' + csrfParam.getAttribute('content') + '" value="' + csrfToken.getAttribute('content') + '" type="hidden" />'))

  return form
}
