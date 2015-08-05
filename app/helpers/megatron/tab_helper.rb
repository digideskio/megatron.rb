module Megatron
  module TabHelper
    class Tabs < BlockHelpers::Base
      def tab(text, href)
        content_tag :a, class: 'tab', href: href do
          text
        end
      end

      def tab_button(text, href)
        content_tag :a, class: %w{tab-btn btn medium}, href: href do
          text
        end
      end

      def display(body)
        content_tag(:nav, class: 'tabs') { body }
      end
    end

    class BoxTabs < Tabs
      def display(body)
        content_tag(:nav, class: 'box-tabs') { body }
      end
    end
  end
end