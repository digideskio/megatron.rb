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
      options[:class] = default_class(options[:class], "text-icon")
      options[:wrapper] = default_class(options[:wrapper], "icon-wrapper")

      content_tag(:span, class: options[:wrapper]) do
        icon(name.to_s, options)
      end
    end

    def nav_icon(name, options={})
      options[:wrapper] = default_class(options[:wrapper], "nav-icon")
      text_icon(name, options)
    end

    def default_class(classnames, default)
      if classnames.nil? || !classnames.is_a?(String)
        classnames = ''
      end
      classnames.to_s << " #{default}"
    end
  end
end
