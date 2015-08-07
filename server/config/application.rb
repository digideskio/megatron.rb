require File.expand_path('../boot', __FILE__)

require "rails"
require "action_view/railtie"
Bundler.require(*Rails.groups)

require "megatron"

module MegatronServer
  class Application < Rails::Application
    config.assets.enabled = false

    config.middleware.insert_before ActionDispatch::Static, Rack::Deflater

    config.middleware.insert_before 0, "Rack::Cors", :debug => true, :logger => (-> { Rails.logger }) do
      allow do
        origins "*"
        resource "*", {
          :headers => :any,
          :expose => ["Location"],
          :methods => [:get, :post, :put, :patch, :delete, :options]
        }
      end
    end
  end
end