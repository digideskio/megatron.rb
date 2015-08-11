require File.expand_path('../boot', __FILE__)

require "rails"
# Pick the frameworks you want:
require "action_controller/railtie"
require "action_view/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

require "megatron"

module MegatronServer
  class Application < Rails::Application
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