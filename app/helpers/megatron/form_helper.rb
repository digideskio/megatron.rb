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

    def range_input_tag(name, options={})
      options = options.stringify_keys
      data = options['data'] || {}
      data["input"] ||= name
      
      # Set values (and max based on values size)
      if values = options['values']
        data['values'] = values.join(',')
        options['max'] ||= values.size - 1
      end

      # Set label options
      if labels = options['labels']
        labels.each do |label, value|
          data['label-'+dasherize(label.to_s.downcase)] = value.join(';')
          options['max'] ||= value.size - 1
        end
      elsif label = options['label']
        data['label'] = label.join(';')
        options['max'] ||= label.size - 1
      end

      if before = options['before']
        if before.is_a?(String)
          data['before-label'] = before
        else
          before.each do |key, value|
            data["#{key}-before-label"] = value
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
            data["#{key}-after-label"] = value
          end
        end
      end

      options['value'] ||= options['min'] || 0

      html_options = { "type" => "range", "min" => options['min'], "max" => options['max'], "value" => options['value'] }.update('data' => data)
      tag :input, html_options
    end
  end
end
