Rails.application.routes.draw do
  get :status, to: proc { [200, {}, ['']] }
  resources :pages, param: :page, path: ''
end
