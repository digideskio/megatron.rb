Rails.application.routes.draw do
  resources :pages, param: :page
  get :status, to: proc { [200, {}, ['']] }
end
