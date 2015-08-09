module Megatron
  module ApplicationHelper
    def megatron_asset_path(asset)
      return "#{ENV['MEGATRON_ASSET_HOST']}/assets/megatron/#{asset}" if ENV['MEGATRON_ASSET_HOST']
      return "https://d1jybc9y95nviz.cloudfront.net/assets/megatron/#{asset}" if Rails.env.production?
      return "/assets/megatron/#{asset}"
    end

    def megatron_assets_tags
      version = Megatron::VERSION
      favicon_link_tag(megatron_asset_path('favicon.ico')) + 
      stylesheet_link_tag(megatron_asset_path("megatron-#{version}")) +
      javascript_include_tag(megatron_asset_path("megatron-#{version}"))
    end

    def icon(name)
      content_tag(:span, class: "#{name}_icon", 'aria-hidden' => true) {  }
    end

    def options_from_args(args)
      if args.last.is_a? Hash
        args.pop
      else
        {}
      end
    end

    def embed_svg(filename, options = {})
      group = 0
      file = File.read(Engine.root.join('app', 'assets', 'images', filename))
        .gsub(/<!--.+-->/, '')
        .gsub(/^\t{2,}\s*<\/?g>/, '')
        .gsub(/width=".+?"/, 'width="312"')
        .gsub(/\sheight.+$/, '')
        .gsub(/\t/, '  ')
        .gsub(/\n{3,}/m, "\n")
        .gsub(/^\s{2}<g>.+?^\s{2}<\/g>/m) { |g| 
          g.gsub(/^\s{4,}\s+/, '    ')
        }
        .gsub(/^<g>.+?^<\/g>/m) { |g|
          group += 1
          count = 0
          g.gsub(/^\s{2}<g>/) { |g| 
            count += 1
            %Q{  <g id="group-#{group}-cube-#{count}">}
          }
        }
      # doc = Nokogiri::HTML::DocumentFragment.parse file
      # svg = doc.at_css 'svg'
      # if options[:class].present?
      #   svg['class'] = options[:class]
      # end
      file.html_safe
    end

    def add_class(string, *classes)
      string ||= ''
      string << " #{classes.join(' ')}"
      string
    end

    def test_current_page(criteria)
      return false unless criteria.present?
      
      test_params = criteria.delete(:params) || {}
      test_params[:controller] ||= criteria[:controller] if criteria[:controller].present?
      test_params[:action] ||= criteria[:action] if criteria[:action].present?

      test_params.all? {|k, v| test_here_key_value(k, v) }

    end

    def test_here_key_value(key, value, check_params = params)
      if value.is_a?(Hash)
        value.all? {|k,v| params[k].present? && test_here_key_value(k, v, params[k]) }
      elsif value.is_a?(Array)
        value.detect {|v| test_here_key_value(key, v) }.present?
      elsif value.is_a?(Regexp)
        (check_params[key] =~ value) != nil
      else
        value == check_params[key]
      end
    end
  end
end
