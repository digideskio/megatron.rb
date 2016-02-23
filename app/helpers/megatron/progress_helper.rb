module Megatron
  module ProgressHelper
    def progress_bar(percentage, options={})
      
      options = {
        percentage: percentage
      }.merge(options)

      if options[:label] == true
        options[:label] = "#{percentage}%"
      end

      width = if options[:width]
        "width: #{options.delete(:width)};"
      else
        ''
      end

      color = options.delete(:color) || 'blue'

      content_tag(:span, class: 'progress-bar-wrapper') { 
        concat content_tag(:span, class: 'progress-bar', data: options, style: width) { 
          content_tag(:span, class: "progress-bar-fill #{color}-bg", style: "width: #{percentage}%"){}
        }
        if options[:label]
          concat content_tag(:span, class: "progress-bar-label"){ options[:label] }
        end
      }
    end

    def capacity_bar(size, total=100, options={})
      # make total an optional argument
      if total.is_a?(Hash)
        options = total
        total = 100
      end

      percentage = ((size.to_f / total.to_f) * 100).round

      if percentage > 90
        options[:color] = 'red'
      elsif percentage > 80
        options[:color] = 'orange'
      end

      unless label = false
        options[:label] = "#{percentage}% - #{size} / #{total}"
      end

      progress_bar(percentage, options)
    end
  end
end

