module Megatron
  module BreadcrumbHelper
    class Breadcrumbs < BlockHelpers::Base
      def crumb(text, href = nil, options={})
        options[:class] = add_class(options[:class], 'breadcrumb')

        if href.nil?
          content_tag(:span, options) { text }
        else
          link_to(href, options){ text }
        end
      end

      def display(body)
        content_tag(:nav, class: 'breadcrumbs') { body }
      end
    end
  end
end
