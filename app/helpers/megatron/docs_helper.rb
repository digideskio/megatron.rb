module Megatron
  module DocsHelper

    DEMO_DEFAULTS = {
      type: :slim, 
      class: 'demo',
      tag: :div
    }

    def demo(title=nil, options={}, &block)
      if title.is_a? Hash
        options = title
        title = nil
      end

      options = DEMO_DEFAULTS.merge(options)

      content_tag options[:tag], class: options[:class] do
        rand = SecureRandom.hex(5)

        concat content_tag(:header, class: 'demo-header') {
          if title
            concat content_tag(:h3, class: 'demo-heading', id: heading_id(title)){ title }
          end

          if options[:toggle]
            concat content_tag(:a, href: '#', class: 'demo-source-toggle', 'data-toggle' => "#source-#{rand}, #demo-#{rand}"){ 'source' }
          else
            concat content_tag(:a, href: '#', class: 'demo-source-toggle', 'data-toggle' => "#source-#{rand}"){ 'source' }
          end
        }

        concat code(options[:type], id: "source-#{rand}", class: 'hidden') {
          lines = extract_code(block)
        }
        concat content_tag(:div, id: "demo-#{rand}", &block)
      end
    end

    def demo_box(title, options={}, &block)
      options[:class] = "#{options[:class]} demo-box"
      options[:class] << ' padded' unless options[:padded] == false
      options[:toggle] = true
      demo(title, options, &block)
    end

    def strip_description(lines)
      start = lines.find_index{|x| x=~/=\s*demo_description/}
      if start
        spaces = spaces_at_beginning(lines[start])
        count = lines[start+1 .. -1].take_while { |line| 
          spaces_at_beginning(line) > spaces
        }.size

        lines.slice!(start..start+count)
      end
      lines
    end

    # Ouptut a linkable heading
    #
    def heading(*args)
      content = args.pop

      # Default to h3
      tag = args.pop || :h3
      content_tag(tag.to_sym, class: 'link-heading', id: heading_id(content)) do
        concat content
      end
    end

    def heading_id(title)
      title.gsub(/\W/, '-').downcase
    end

    def demo_description(&block)
      content_tag :div, class: 'demo-description', &block
    end

    def code(lang, options = {}, &block)
      classes = ["language-#{lang}"]
      classes << options.delete(:class) if options[:class]
      content_tag(:pre, options.merge(class: classes), &block)
    end

    def extract_code(block)
      filename, start_line = block.source_location
      lines = File.readlines(filename)

      start_line -= 1

      until lines[start_line] =~ /demo_box/
        start_line += 1
      end

      spaces = spaces_at_beginning(lines[start_line])

      lines = lines[start_line + 1 .. -1]

      lines = lines.take_while { |line| 
          spaces_at_beginning(line) > spaces || line.match(/^\n\s*$/)
        }
        .map { |line| line.sub(%r{^\s{#{spaces + 2}}}, '') }
      strip_description(lines).join("")
    end

    def spaces_at_beginning(str)
      str[/\A */].size
    end
  end
end
