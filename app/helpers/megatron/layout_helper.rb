module Megatron
  module LayoutHelper

  def megatron_layout(options={}, &block)
      @custom_nav = options[:custom_nav]
      @primary_nav_here = options[:primary_nav]
      layout = options.delete(:layout) || 'application'
      yield
      render template: "layouts/megatron/#{layout}"
    end

    def page_header(title = nil, &block)
      header :page_header, title, &block
    end

    def main_header(title = nil, &block)
      header :main_header, title, &block
    end

    def header(type, title = nil, &block)
      if title
        content_for(type) { content_tag :h2, title }
      elsif !title && block_given?
        content_for type, &block
      end
    end

    def main(options={}, &block)
      @wide_layout = options[:wide]
      content_for :main, &block
    end

    def sidebar(&block)
      content_for :sidebar, &block
    end

    def javascripts(&block)
      content_for :javascripts, &block
    end

    def stylesheets(&block)
      content_for :stylesheets, &block
    end

    def size(*args, &block)
      options = options_from_args(args)
      tag = options[:tag] || :div
      content_tag tag, class: [width(*args), options[:class]], &block
    end

    def width(*sizes)
      media = ''
      sizes.flatten!
      if sizes.first.is_a?(Symbol) || sizes.first.is_a?(String)
        media = "#{sizes.shift.to_s.sub(/^x/, 'x-')}-"
      end

      classes = "#{media}#{sizes[0].to_words}-of-#{sizes[1].to_words}"

      if sizes.last.is_a? Hash
        classes << " #{sizes.last[:class]}"
      end

      classes
    end

  end
end
