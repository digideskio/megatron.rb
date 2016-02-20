module Megatron
  module ButtonHelper
    def button(text, options = {})
      tag_name = options[:href].present? ? :a : :button
      opts = {
        class: button_classes(options),
        data: options[:data] || {}
      }
      opts[:href] = options[:href] if options[:href]
      opts[:data][:toggle] = options[:toggle] if options[:toggle]
      opts[:data].merge!(options[:dialog].merge(trigger: 'dialog')) if options[:dialog]

      content_tag tag_name, opts do
        if options[:icon]
          concat icon(options[:icon])
          concat ' '
        end
        concat text
      end
    end

    def header_button(text, options = {})
      button(text, {type: :header, flavor: 'btn'}.merge(options))
    end

    def primary_header_button(text, options = {})
      button(text, options.merge(type: :header, flavor: 'primary-btn'))
    end

    def copy_button(text, options = {})
      options[:data] ||= {}
      options[:data][:clipboard_target] = options[:target]
      options[:flavor] = 'copy-button'
      options[:class] = button_classes(options)

      content_tag 'button', options do
        concat text_icon('copy')
        concat text_icon('check-thin')
        concat ' '
        concat text
      end
    end

    def primary_button(text, options = {})
      button(text, options.merge(type: :primary))
    end

    def destroy_button(text, options = {})
      button(text, options.merge(type: :destroy))
    end

    def primary_destroy_button(text, options={})
      button(text, options.merge(type: :primary_destroy))
    end

    def text_button(text, options = {})
      button(text, options.merge(type: :text))
    end

    def button_classes(options)
      button_type = options[:type] || options[:color]
      classes = button_type.present? ? ["#{button_type.to_s.gsub('_','-')}-btn"] : ["btn"]
      classes << options[:flavor] if options[:flavor]
      classes << options[:class] if options[:class]
      classes << options[:size].to_s.gsub(/xlarge/, 'x-large') if options[:size]
      classes << 'disabled' if options[:disabled]
      classes
    end
  end
end
