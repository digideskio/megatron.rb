module Megatron
  module IconHelper
    def icons
      @icons ||= Esvg::SVG.new(path: File.expand_path('../../assets/esvg/megatron', File.dirname(__FILE__)))

      if Rails.env != 'production' && @icons.modified?
        @icons.read_icons
      end

      @icons
    end

    def embed_icon(name, options)
      icons.svg_icon(name.to_s, options).html_safe
    end

    def icon(name, options={})
      options[:class] ||= ''
      content_tag(:span, class: "#{name}_icon #{options[:class]}", 'aria-hidden' => true) {  }
    end

    def text_icon(name, options={})
      options[:class] ||= ''
      options[:class] << " text-icon"
      content_tag(:span, class: "text-icon-wrapper") do
        embed_icon(name.to_s, options).html_safe
      end
    end

    def nav_icon(name, options={})
      options[:class] ||= ''
      options[:class] << " text-icon"
      content_tag(:span, class: "text-icon-wrapper nav-icon") do
        embed_icon(name.to_s, options).html_safe
      end
    end
  end
end
