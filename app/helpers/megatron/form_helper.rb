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
  end
end