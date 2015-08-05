module Megatron
  module GridHelper
    class Grid < BlockHelpers::Base

      DEFAULTS = {
        tag: :div,
        match_gutters: false
      }

      def initialize(options = {})
        @options = DEFAULTS.merge(options)
      end

      def display(body)
        content_tag(@options[:tag], class: grid_classes) { body }
      end

      def cell(*args, &block)
        options = options_from_args(args)
        options[:tag] ||= :div
        content_tag options[:tag], class: cell_classes(args, options), &block
      end

      def cell_classes(args, options={})
        classes = ['grid-cell']
        if !args.empty? or !options.empty?
          classes << width(*args) if !args.empty?
          classes << options[:class] if options[:class]

          classes << add_media_classes(:xsmall, options[:xsmall]) if options[:xsmall]
          classes << add_media_classes(:small, options[:small]) if options[:small]
          classes << add_media_classes(:medium, options[:medium]) if options[:medium]
          classes << add_media_classes(:large, options[:large]) if options[:large]
          classes << add_media_classes(:xlarge, options[:xlarge]) if options[:xlarge]
        end
        classes
      end

      def add_media_classes(breakpoint, sizes)
        sizes.empty? ? '' : width(*[breakpoint, *sizes])
      end

      def grid_classes
        classes = ['grid']
        classes << "align-#{@options[:valign]}" if @options[:valign]
        classes << "align-#{@options[:align]}" if @options[:align]
        classes << 'match-gutters' if @options[:match_gutters]
        if @options[:gutters]
          if @options[:gutters].to_s == 'none'
            @options[:gutters] = 'no'
          end
          classes << "#{@options[:gutters]}-gutter" unless @options[:gutters].to_s == 'medium'
        end
        classes << @options[:class] if @options[:class]
        classes
      end

    end
  end
end
