require 'rack'
require 'rack/cors'
require 'rack/try_static'

DEFAULT_CONTENT_TYPES = [
  # All html, text, css, and csv content should be compressed
  "text/plain",
  "text/html",
  "text/csv",
  "text/css",

  # Only vector graphics and uncompressed bitmaps can benefit from compression.
  #GIF, JPG, and PNG already use a lz* algorithm, and certain browsers can get confused.
  "image/x-icon",
  "image/svg+xml",
  "application/x-font-ttf",
  "application/x-font-opentype",
  "application/vnd.ms-fontobject",

  # All javascript should be compressed
  "text/javascript",
  "application/ecmascript",
  "application/json",
  "application/javascript",

  # All xml should be compressed
  "text/xml",
  "application/xml",
  "application/xml-dtd",
  "application/soap+xml",
  "application/xhtml+xml",
  "application/rdf+xml",
  "application/rss+xml",
  "application/atom+xml"
]

module Rack
  class DeflaterWithExclusions < Deflater
    def initialize(app, options = {})
      @app = app
      @exclude = options[:exclude]
    end

    def call(env)
      status, headers, body = @app.call(env)
      headers = Rack::Utils::HeaderHash.new(headers)
      if @exclude && @exclude.call(env, status, headers, body)
        puts "exclude"
        @app.call(env)
      else
        super(env)
      end
    end
  end
end

use Rack::Chunked
use Rack::ContentLength
use Rack::ConditionalGet
use Rack::ContentType

use Rack::DeflaterWithExclusions, exclude: proc { |env, status, headers, body|
  mime_type = headers['Content-Type'] ? headers['Content-Type'].gsub(/;.*\Z/,"").downcase : "unknown"
  !DEFAULT_CONTENT_TYPES.include?(mime_type)
}

use Rack::ETag
use Rack::Head
use Rack::MethodOverride
use Rack::Runtime
use Rack::Sendfile
use Rack::ShowStatus
use Rack::Cors do
  allow do
    origins "*"
    resource "*", {
      :headers => :any,
      :expose => ["Location"],
      :methods => [:get, :post, :put, :patch, :delete, :options]
    }
  end
end

map '/assets/megatron' do
  use Rack::TryStatic, :root => "public/assets/megatron", :urls => %w[/]
end

map '/status' do
  run lambda { |env| [ 200, {'Content-type' => 'text/plain'}, ["I'm up!"] ] }
end

run lambda {|env| [404, {'Content-type' => 'text/plain'}, ['Not found']]}
