Gem.loaded_specs['megatron'].dependencies.each do |d|
  require d.name
end

# Need access to the version
require "megatron/version"

# require "megatron/form"
require "megatron/engine"

module Megatron
end
