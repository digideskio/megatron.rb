module Megatron
  class Engine < ::Rails::Engine
    config.generators do |g|
      g.assets false
      g.helper false
    end

    initializer 'megatron.form_builder' do |app|
      ActionView::Base.default_form_builder = Megatron::Form
    end

    initializer "megatron.static_assets" do |app|
      app.middleware.insert_before(::ActionDispatch::Static, ::ActionDispatch::Static, "#{root}/public")
    end
  end
end
