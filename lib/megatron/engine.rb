module Megatron
  class Engine < ::Rails::Engine
    config.generators do |g|
      g.assets false
      g.helper false
    end

    initializer 'megatron.form_builder' do |app|
      ActionView::Base.default_form_builder = Megatron::Form
    end
  end
end
