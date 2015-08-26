module Megatron
  VERSION = "0.1.#{ENV.fetch('CIRCLE_BUILD_NUM', '0')}"
end
