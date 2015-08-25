module Megatron
  module BoxHelper
    class BoxMessage < BlockHelpers::Base
      def initialize(options = {})
        @options = options
      end

      def display(body)
        @options[:body] = body
        @options[:class] ||= ''
        render partial: "megatron/shared/box_message", locals: { options: @options }
      end
    end
  end
end

