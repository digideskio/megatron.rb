module Megatron
  module FormHelper
    def table_form_for(record, options = {}, &block)
      form_for record, options do |f|
        table_form_tag f, &block
      end
    end

    def table_form_tag(form = nil)
      form.style = 'table' if form
      content_tag :div, class: ['table', 'table-form'] do
        yield form if block_given?
      end
    end

    def stacked_form_for(record, options = {}, &block)
      form_for record, options do |f|
        stacked_form_tag f, &block
      end
    end

    def stacked_form_tag(form = nil)
      form.style = 'stacked' if form
      content_tag :div, class: 'stacked-form' do
        yield form if block_given?
      end
    end

    def slider_input_tag(name, options={})
      options = options.stringify_keys
      data = options['data'] || {}
      name ||= data["input"]
      
      # Set values (and max based on values size)
      if values = options['values']
        data['values'] = values.join(',')
        options['max'] ||= values.size - 1
      end

      # Support legacy option
      options['labels'] ||= options['label']

      if labels = options['labels']
        if labels.is_a?(Array)
          data['label'] = labels.join(';')
          options['max'] ||= labels.size - 1
        elsif labels.is_a?(Hash)
          labels.each do |label, value|
            data['label-'+dasherize(label.to_s.downcase)] = value.join(';')
            options['max'] ||= value.size - 1
          end
        end
      end

      if labels == false
        data['label'] = 'false'
      end

      if labels = options['external_labels']
        if labels.is_a?(Hash)
          labels.each do |label, value|
            data['external-label-'+dasherize(label.to_s.downcase)] = value.join(';')
          end
        end
      end

      if before = options['before']
        if before.is_a?(String)
          data['before-label'] = before
        else
          before.each do |key, value|
            data["before-label-#{key}"] = value
          end
        end
      end

      if mark = options['mark']
        data['mark'] = mark.join(',')
      end

      if after = options['after']
        if after.is_a?(String)
          data['after-label'] = after
        else
          after.each do |key, value|
            data["after-label-#{key}"] = value
          end
        end
      end

      if line_labels = options['line_labels']
        data['line_labels'] = []
        line_labels.each do |k, v|
          data['line_labels'] << "#{k}:#{v}"
        end
        data['line_labels'] = data['line_labels'].join(';')
      end

      options['value'] ||= options['min'] || 0

      html_options = { "name" => name, "type" => "range", "min" => options['min'], "max" => options['max'], "value" => options['value'] }.update('data' => data)
      tag :input, html_options
    end
    alias :range_input_tag :slider_input_tag

  end
end
