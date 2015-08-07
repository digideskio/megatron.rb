Rails.application.routes.draw do
  get :status, to: proc { [200, {}, ['']] }
end
