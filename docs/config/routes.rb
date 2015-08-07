Rails.application.routes.draw do
  resources :pages, param: :page, path: ''
  get :status, to: proc { [200, {}, ['']] }
end
