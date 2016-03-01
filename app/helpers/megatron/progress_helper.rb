module Megatron
  module ProgressHelper
    def progress_bar(percentage, options={})
      
      options = {
        percentage: percentage,
        label_position: 'before'
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
        if options[:label] && options[:label_position].to_s == 'before'
          concat content_tag(:span, class: "progress-bar-label"){ options[:label] }
        end
        concat content_tag(:span, class: 'progress-bar', data: options, style: width) { 
          content_tag(:span, class: "progress-bar-fill #{color}-bg", style: "width: #{percentage}%"){}
        }
        if options[:label] && options[:label_position].to_s == 'after'
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

      unless label == false
        options[:label] = "#{percentage}% - #{number_to_human_size(size).sub(' ','')} / #{number_to_human_size(total).sub(' ','')}"
      end

      progress_bar(percentage, options)
    end
  end
end

