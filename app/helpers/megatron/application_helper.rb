module Megatron
  module ApplicationHelper
    
    # Mounted from dev-kit
    def dev?
      __dir__.start_with?("/megatron") || ENV['DEVKIT']
    end

    def megatron_asset_path(asset)

      if ENV['LOCAL_DEV']
        alt_host = "http://localhost:5000"
      elsif dev?
        alt_host = "https://megatron.compose.devkit"
      end 

      alt_host ||= ENV['MEGATRON_ASSET_HOST'] 
      return "#{alt_host}/assets/megatron/#{asset}" if alt_host
      return "https://d11f55tj5eo9e5.cloudfront.net/assets/megatron/#{asset}" if Rails.env.production?
      return "/assets/megatron/#{asset}"
    end

    def link_up(href = nil, options = {}, html_options = nil, &block)
      here_if = options.delete(:here_if) || {}
      here_if[:path] = href if here_if.blank?
      options[:class] = add_class(options[:class], "here") if test_current_page(here_if)

      link_to(href, options, &block)
    end

    def megatron_assets_tags
      version = if dev?
        ''
      elsif params[:__megatron_version]
        "-#{params[:__megatron_version]}"
      else
        "-#{Megatron::VERSION}"
      end

      ext_suffix = Rails.env.production? ? '.gz' : ''

      pin_tab_icon(
        megatron_asset_path('logo.svg')
      ) +
      favicon_link_tag(
        megatron_asset_path('favicon.ico'), sizes: "32x32"
      ) +
      stylesheet_link_tag(
        megatron_asset_path("megatron#{version}.css#{ext_suffix}")
      ) +
      javascript_include_tag(
        megatron_asset_path("megatron#{version}.js#{ext_suffix}")
      )
    end

    def pin_tab_icon(path)
      %Q{<link rel="mask-icon" mask href="#{path}" color="black">}.html_safe
    end

    def megatron_error_asset_tag
      version = Megatron::VERSION
      ext_suffix = Rails.env.production? ? '.gz' : ''

      # Embed styles directly for these error codes since they are served from haproxy
      # and are likely to be served when the stylesheet server cannot be reached
      #
      if [408, 502, 503, 504].include?(@status_code)
        style== File.read("../public/assets/megatron/megatron-error-pages-#{version}.css")
      else
        stylesheet_link_tag(
          megatron_asset_path("megatron-error-pages-#{version}.css#{ext_suffix}")
        )
      end
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

    def dasherize(input)
      input.gsub(/[\W,_]/, '-').gsub(/-{2,}/, '-')
    end
  end
end
