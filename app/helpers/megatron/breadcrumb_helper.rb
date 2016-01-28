module Megatron
  module BreadcrumbHelper
    class Breadcrumbs < Megatron::Helper
      def crumb(text = nil, href = nil, options={}, &block)
        options[:class] = add_class(options[:class], 'breadcrumb')

        if block
          if href.nil?
            content_tag :span, options, &block
          else
            link_to href, options, &block
          end
        else
          if href.nil?
            content_tag(:span, options) { text.to_s }
          else
            link_to(href, options) { text.to_s }
          end
        end
      end

      def display(body)
        content_tag(:nav, class: 'breadcrumbs') { body }
      end
    end
  end
end
