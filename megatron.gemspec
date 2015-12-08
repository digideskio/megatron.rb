$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "megatron/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |spec|
  spec.name        = "megatron"
  spec.version     = Megatron::VERSION
  spec.authors     = ["Jerome Gravel-Niquet", "Brandon Mathis"]
  spec.email       = ["jeromegn@gmail.com", "brandon@imathis.com"]
  spec.homepage    = "https://www.compose.io"
  spec.summary     = "Megatron view helpers"
  spec.description = "Hotness."
  spec.license     = "MIT"

  spec.files = Dir["{app,public,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.rdoc"]

  spec.add_runtime_dependency 'block_helpers', '~> 0.3.3'
  spec.add_runtime_dependency 'to_words', '~> 1.1.0'
  spec.add_runtime_dependency 'slim-rails'

  spec.add_dependency "rails", "~> 4"
  spec.add_dependency "esvg", "~> 2"
  spec.add_dependency "gaffe", "~> 1"
end
