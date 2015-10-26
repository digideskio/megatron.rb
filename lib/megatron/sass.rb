# Monkey Patch to sass to allow ruby processing in scss.erb files
require 'sass'

class Sass::Engine
  alias initialize_without_megatron initialize

  def initialize(template, options={})
    erb_importer = self.options[:load_paths].find {|lp| lp.is_a?(Megatron::Importer) }

    unless erb_importer
      root = File.dirname(options[:filename] || ".")
      self.options[:load_paths] << Megatron::Importer.new(root)
    end 
  end
end

module Megatron

  class Importer < Sass::Importers::Filesystem
    def watched_file?(uri)
      !!(uri =~ /\.erb$/ &&
        uri.start_with?(root + File::SEPARATOR))
    end

    protected

    def extensions
      {'erb' => :scss}
    end

    def erb?(name)
      File.extname(name) == '.erb'
    end

    private

    def _find(dir, name, options)
      return unless erb? name

      full_filename, syntax = Sass::Util.destructure(find_real_file(dir, name, options))
      return unless full_filename && File.readable?(full_filename)

      content = ERB.new(IO.read(full_filename)).result

      Sass::Engine.new(content, options.merge(
          :filename => full_filename,
          :importer => self,
          :syntax   => :scss
      ))
    end

    #def _convert_to_sass(item)
      #if item.is_a? Array
        #_make_list(item)
      #elsif item.is_a? Hash
        #_make_map(item)
      #else
        #item.to_s
      #end
    #end

    #def _make_list(item)
      #'(' + item.map { |i| _convert_to_sass(i) }.join(',') + ')'
    #end

    #def _make_map(item)
      #'(' + item.map {|key, value| key.to_s + ':' + _convert_to_sass(value) }.join(',') + ')'
    #end
  end
end
