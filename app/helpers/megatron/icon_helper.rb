module Megatron
  module IconHelper
    def iconset
      @icons ||= Esvg::SVG.new(path: File.expand_path('../../assets/esvg/megatron', File.dirname(__FILE__)))

      if Rails.env != 'production'
        @icons.read_files
      end

      @icons
    end

    def icon(name, options={})
      name = dasherize(name)
      i = iconset.svg_icon(name, options).html_safe

      if options[:wrapper]
        content_tag(:span, class: options[:wrapper].strip) do
          i
        end
      else
        i
      end
    end

    def font_icon(name, options={})
      options[:class] = default_class(options[:class], "#{name}_icon")
      content_tag(:span, class: options[:class], 'aria-hidden' => true) {  }
    end

    def text_icon(name, options={})
      options = set_icon_classes(options, class: 'text-icon', wrapper: 'icon-wrapper')

      if options[:wrapper]
        content_tag(:span, class: options[:wrapper].strip) do
          icon(name.to_s, options)
        end
      else
        icon(name.to_s, options)
      end
    end

    def nav_icon(name, options={})
      options[:wrapper] = "nav-icon"
      text_icon(name, options)
    end

    def set_icon_classes(options, defaults={})
      options[:class] = (options[:class] || '') << " #{defaults[:class]}"

      if options[:wrapper]
        options[:wrapper] = '' unless options[:wrapper].is_a?(String)
        options[:wrapper] = (options[:wrapper] || '') << " #{defaults[:wrapper]}"
      end

      # Automate adding color classes, blue becomes blue-text
      # This should allow us to change it later more easily if necessary
      if options[:color]
        options[:class] << " #{options[:color].to_s.strip}-text"
      end

      # Automate adding size classes, x-small becomes x-small-text
      # This should allow us to change it later more easily if necessary
      if options[:size]
        options[:class] << " #{dasherize(options[:size].to_s.strip)}-text"
      end

      options
    end

    def dasherize(input)
      input.gsub(/[\W,_]/, '-').gsub(/-{2,}/, '-')
    end

    def default_class(classnames, default)
      if classnames.nil? || !classnames.is_a?(String)
        classnames = ''
      end
      classnames.to_s << " #{default}"
    end
  end
end
