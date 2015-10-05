module Megatron
  module IconHelper
    def iconset
      @icons ||= Esvg::SVG.new(path: File.expand_path('../../assets/esvg/megatron', File.dirname(__FILE__)))

      if Rails.env != 'production' && @icons.modified?
        @icons.read_icons
      end

      @icons
    end

    def icon(name, options={})
      iconset.svg_icon(name.to_s, options).html_safe
    end

    def font_icon(name, options={})
      options[:class] = default_class(options[:class], "#{name}_icon")
      content_tag(:span, class: options[:class], 'aria-hidden' => true) {  }
    end

    def text_icon(name, options={})
      options = set_icon_classes(options, class: 'text-icon', wrapper: 'icon-wrapper')

      content_tag(:span, class: options[:wrapper]) do
        icon(name.to_s, options)
      end
    end

    def nav_icon(name, options={})
      options[:wrapper] = (options[:wrapper] || '') << " nav-icon"
      text_icon(name, options)
    end

    def set_icon_classes(options, defaults={})
      options[:class] || (options[:class] || '') << " #{defaults[:class]}"
      options[:wrapper] = (options[:wrapper] || '') << " #{defaults[:wrapper]}"

      # Automate adding color classes, blue becomes blue-text
      # This should allow us to change it later more easily if necessary
      if options[:color]
        options[:class] << " #{options[:color]+='-text'}"
      end

      # Automate adding size classes, x-small becomes x-small-text
      # This should allow us to change it later more easily if necessary
      if options[:size]
        options[:class] << " #{options[:size]+='-text'}"
      end

      options
    end

    def default_class(classnames, default)
      if classnames.nil? || !classnames.is_a?(String)
        classnames = ''
      end
      classnames.to_s << " #{default}"
    end
  end
end
