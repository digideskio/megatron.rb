module Megatron
  module ApplicationHelper
    def megatron_asset_path(asset)
      url = Rails.env.production? && !ENV['LOCAL_MEGATRON'] ? "https://app.compose.io/assets/megatron/#{asset}" : "/assets/megatron/#{asset}"
    end

    def megatron_assets_tags
      favicon_link_tag(megatron_asset_path('favicon.ico')) + 
      stylesheet_link_tag(megatron_asset_path('megatron')) +
      javascript_include_tag(megatron_asset_path('megatron'))
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
  end
end
