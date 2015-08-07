module Megatron
  class Form < ActionView::Helpers::FormBuilder

    attr_accessor :style

    def initialize(object_name, object, template, options)
      super
      @style = options.delete(:style) || "table"
    end

    def stacked_form(&block)
      content_tag :div, class: 'stacked-form', &block
    end

    def table_form(&block)
      content_tag :div, class: ['table', 'table-form'], &block
    end

    def text_field(method, options = {})
      if errors_on?(method)
        options[:class] ||= ""
        options[:class] += " error"
      end

      wrapper method, options.delete(:label) || method.to_s.humanize, super(method, options)
    end

    def password_field(method, options = {})
      if errors_on?(method)
        options[:class] ||= ""
        options[:class] += " error"
      end

      wrapper method, options.delete(:label) || method.to_s.humanize, super(method, options)
    end

    def text_area(method, options = {})
      if errors_on?(method)
        options[:class] ||= ""
        options[:class] += " error"
      end

      wrapper method, options.delete(:label) || method.to_s.humanize, super(method, options)
    end

    def select(method, choices = nil, options = {}, html_options = {}, &block)
      if errors_on?(method)
        html_options[:class] ||= ""
        html_options[:class] += " error"
      end

      field = content_tag(:div, class: 'select_box') { super(method, choices, options, html_options, &block) }

      wrapper method, options.delete(:label) || method.to_s.humanize, field
    end

    def submit(btn_text, args = {})
      text = "<footer class='form-footer'>".html_safe
      text << button(btn_text, {class: "primary-btn"}.merge(args))
      text << "</footer>".html_safe

      text
    end

    def method_missing(method, *args, &block)
      @template.send(method, *args, &block)
    end

    private

    def wrapper(*args)
      send("#{@style}_wrapper".to_sym, *args)
    rescue NoMethodError
      Bugsnag.notify($!)
      raise "Could not find Megatron::Form form style '#{@style}'."
    end

    def table_row(&block)
      content_tag(:div, class: 'table-row', &block)
    end

    def table_cell(&block)
      content_tag(:div, class: 'table-cell', &block)
    end

    def table_wrapper(method, label, field)
      concat(table_row {
        concat(table_cell {
          label(method, label, class: [('red-text' if errors_on?(method))])
        })
        concat(table_cell { field })
      })

      if errors_on?(method)
        concat(table_row {
          concat(table_cell { ' ' })
          concat(table_cell {
            content_tag :p, class: 'red-text' do
              @object.errors[method].to_sentence
            end
          })
        })
      end
    end

    def errors_on?(method)
      @object.present? && @object.respond_to?(:errors) && @object.errors[method].present?
    end

    def stacked_row(&block)
      content_tag :div, class: 'form-row', &block
    end

    def stacked_wrapper(method, label, field)
      concat(stacked_row {
        concat label(method, label, class: [('red-text' if errors_on?(method))])
        concat field
      })

      if errors_on?(method)
        concat(stacked_row {
          content_tag :span, class: ['red-text', 'small-text'] do
            @object.errors[method].to_sentence
          end
        })
      end
    end
  end
end