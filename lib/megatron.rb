Gem.loaded_specs['megatron'].dependencies.each do |d|
 require d.name
end

require "megatron/form"
require "megatron/engine"

module Megatron
end