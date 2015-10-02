module Megatron
  module ApplicationHelper
    def megatron_asset_path(asset)
      return "#{ENV['MEGATRON_ASSET_HOST']}/assets/megatron/#{asset}" if ENV['MEGATRON_ASSET_HOST']
      return "https://d11f55tj5eo9e5.cloudfront.net/assets/megatron/#{asset}" if Rails.env.production?
      return "/assets/megatron/#{asset}"
    end

    def link_up(name = nil, options = nil, html_options = nil, &block)
      # append a class to html_options[:class] if the href thing works
      options ||= {}
      here_if = options.delete(:here_if) || {}
      here_if[:path] ||= name
      options[:class] = add_class(options[:class], "here") if test_current_page(here_if)

      link_to(name, options, html_options, &block)
    end

    def megatron_assets_tags
      version = Megatron::VERSION
      favicon_link_tag(megatron_asset_path('favicon.ico')) + 
      stylesheet_link_tag(megatron_asset_path("megatron-#{version}.css")) +
      javascript_include_tag(megatron_asset_path("megatron-#{version}.js"))
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
      [:controller, :action, :path].each do |k|
        test_params[k] ||= criteria[k] if criteria[k].present?
      end

      fullpath = parse_url(request.fullpath)
      check_params = params.to_unsafe_hash.symbolize_keys.merge(path: fullpath)

      test_params.all? {|k, v| test_here_key_value(k, v, check_params) }

    end

    def parse_url(path)
      URI.parse(path.gsub(/(\?.+)/, '')).path
    end

    def test_here_key_value(key, value, check_params = params)
      if value.is_a?(Hash)
        value.all? {|k,v| params[k].present? && test_here_key_value(k, v, params[k]) }
      elsif value.is_a?(Array)
        value.detect {|v| test_here_key_value(key, v) }.present?
      elsif value.is_a?(Regexp)
        (check_params[key] =~ value) != nil
      else
        value_to_check = key == :path ? parse_url(value) : value
        check_params[key] == value_to_check
      end
    end
  end
end
