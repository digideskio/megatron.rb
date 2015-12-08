Rails.application.routes.draw do
  get :status, to: proc { [200, {}, ['']] }
  get "/assets/megatron/megatron.css", to: redirect("/assets/megatron/megatron-#{Megatron::VERSION}.css")
  get "/assets/megatron/megatron.js", to: redirect("/assets/megatron/megatron-#{Megatron::VERSION}.js")
  resources :demo, param: :page, path: 'demo'
  resources :errors, param: :page, path: 'errors'
  resources :pages, param: :page, path: ''
end
