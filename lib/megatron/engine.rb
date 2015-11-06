module Megatron
  class Engine < ::Rails::Engine
    config.generators do |g|
      g.assets false
      g.helper false
    end

    # TODO: Maybe at some point...
    # initializer 'megatron.form_builder' do |app|
    #   ActionView::Base.default_form_builder = Megatron::Form
    # end

    initializer 'megatron.assets' do |app|
      Rails.application.config.assets.paths << root.join('app', 'assets', 'stylesheets')
      Rails.application.config.assets.paths << root.join('app', 'assets', 'javascripts')
    end

    initializer "megatron.static_assets" do |app|
      app.middleware.insert_before(::ActionDispatch::Static, ::ActionDispatch::Static, "#{root}/public")
    end

    initializer "megatron.errors" do |app|
      Gaffe.configure do |config|
        config.errors_controller = 'Megatron::ErrorsController'
      end
      Gaffe.enable!
    end
  end
end
