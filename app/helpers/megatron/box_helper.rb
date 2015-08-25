module Megatron
  module BoxHelper
    class BoxMessage < BlockHelpers::Base
      def initialize(options = {})
        @options = options
      end

      def display(body)
        @options[:body] = body
        render partial: "megatron/shared/message_box", locals: @options
      end
    end
  end
end

