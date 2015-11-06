$stdout.sync = true

begin
  require 'bundler/setup'
rescue LoadError
  puts 'You must `gem install bundler` and `bundle install` to run rake tasks'
end

require 'rdoc/task'

RDoc::Task.new(:rdoc) do |rdoc|
  rdoc.rdoc_dir = 'rdoc'
  rdoc.title    = 'Megatron'
  rdoc.options << '--line-numbers'
  rdoc.rdoc_files.include('README.rdoc')
  rdoc.rdoc_files.include('lib/**/*.rb')
end

Bundler::GemHelper.install_tasks

namespace :megatron do
  
  require 'megatron'
  require 's3'

  task :upload do

    bucket = S3::Service.new(access_key_id: ENV['AWS_KEY'], secret_access_key: ENV['AWS_SECRET']).buckets.find('megatron-assets')

    Dir.glob('public/assets/megatron/*') do |file|
      name = file.split('/').last
      obj = bucket.objects.build("assets/megatron/#{name}")

      obj.acl = :public_read

      obj.content_type = if name.end_with?('.js') || name.end_with?('.js.gz')
        'application/javascript'
      elsif name.end_with?('.css') || name.end_with?('.css.gz')
        'text/css'
      elsif name.end_with?('.json') || name.end_with?('.map')
        'application/json'
      elsif name.end_with?('.ico')
        'image/x-icon'
      else
        'text/plain'
      end
      
      obj.content_encoding = 'gzip' if name.end_with?('.gz')
      obj.content = open(file)
      
      puts "Uploading #{file} to megatron-assets on S3..."

      if obj.save
        puts "Success!"
      else
        puts "Failure :("
        exit 1
      end
    end

  end

  namespace :js do
    task :watch do
      system "./node_modules/.bin/watchify app/assets/javascripts/megatron/index.js --poll --debug -t babelify -o public/assets/megatron/megatron-#{Megatron::VERSION}.js -v"
    end

    task :build do
      build_js
    end

    task :gzip do
      gzip("public/assets/megatron/*.js")
    end
  end

  namespace :css do

    task :watch do

      require 'listen'

      listener = Listen.to('app/assets/stylesheets/megatron/', only: /\.scss$/) do |modified, added, removed|
        build_megatron_css
      end

      build_megatron_css

      puts "Initial CSS build, done. Listening for changes..."

      listener.start # not blocking
      sleep

    end

    task :build do
      build_megatron_css
    end

    task :gzip do
      gzip("public/assets/megatron/*.css")
    end

  end

  namespace :svg do
    require 'esvg'

    task :watch do
      require 'listen'

      listener = Listen.to('app/assets/esvg/megatron/', only: /\.svg$/) do |modified, added, removed|
        build_svg
      end

      build_svg

      puts "Initial SVG build, done. Listening for changes..."

      listener.start # not blocking
      sleep

    end

    task :build do
      build_svg(true)
    end

  end

  # Run the server first, then run this rake task to write error messages to disk
  #
  task :build_errors do
    dir = 'server/tmp/error_pages'
    zip = 'error_pages.zip'
    FileUtils.mkdir_p(dir)
    FileUtils.rm(zip) if File.exist?(zip)
    [408, 502, 503, 504].each do |code|
      system "curl http://localhost:5000/errors/#{code} > #{dir}/#{code}.html"
      system "zip -r -X #{zip} #{dir}"
    end
  end

end

def build_megatron_css
  build_css("megatron")
  build_css('megatron-error-pages', 'compressed', 'none')
end

def build_css(file, style='nested', sourcemap='auto')
  destination = "public/assets/megatron/#{file}-#{Megatron::VERSION}.css"
  system "bundle exec sass app/assets/stylesheets/megatron/#{file}.scss:#{destination} --style #{style} --sourcemap=#{sourcemap}"
  system "./node_modules/postcss-cli/bin/postcss --use autoprefixer #{destination} -o #{destination}"
  puts "Built: #{destination}"
end

def build_js
  system "./node_modules/.bin/browserify app/assets/javascripts/megatron/index.js -t babelify --standalone Megatron -o public/assets/megatron/megatron-#{Megatron::VERSION}.js -d -p [ minifyify --map megatron-#{Megatron::VERSION}.map.json --output public/assets/megatron/megatron-#{Megatron::VERSION}.map.json ]"
end

def build_svg(optimize=false)
  if @svg.nil? 
    @svg = Esvg::SVG.new(path: 'app/assets/esvg/megatron', output_path: 'app/assets/javascripts/megatron', optimize: optimize, cli: true)
  else
    @svg.read_files
  end

  @svg.write
end

ZIP_TYPES = /\.(?:css|html|js|otf|svg|txt|xml)$/

def gzip(glob)
  Dir["#{Dir.pwd}/#{glob}"].each do |f|
    next unless f =~ ZIP_TYPES

    mtime = File.mtime(f)
    gz_file = "#{f}.gz"
    next if File.exist?(gz_file) && File.mtime(gz_file) >= mtime

    File.open(gz_file, "wb") do |dest|
      gz = Zlib::GzipWriter.new(dest, Zlib::BEST_COMPRESSION)
      gz.mtime = mtime.to_i
      IO.copy_stream(open(f), gz)
      gz.close
    end

    File.utime(mtime, mtime, gz_file)
  end
end
