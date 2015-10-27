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

      obj.content_type = if name.end_with?('.js')
        'application/javascript'
      elsif name.end_with?('.css')
        'text/css'
      elsif name.end_with?('.json') || name.end_with?('.map')
        'application/json'
      elsif name.end_with?('.ico')
        'image/x-icon'
      else
        'text/plain'
      end
      
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

  namespace :css do

    task :watch do

      require 'listen'

      listener = Listen.to('app/assets/stylesheets/megatron/', only: /\.scss$/) do |modified, added, removed|
        build_css
      end

      build_css

      puts "Initial CSS build, done. Listening for changes..."

      listener.start # not blocking
      sleep

    end

    task :build do
      build_css
    end

  end

  namespace :svg do

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
      build_svg
    end

  end

end

def build_css
  destination = "public/assets/megatron/megatron-#{Megatron::VERSION}.css"
  system "sass app/assets/stylesheets/megatron/megatron.scss:#{destination}"
  system "./node_modules/postcss-cli/bin/postcss --use autoprefixer #{destination} -o #{destination}"
  puts "Built: #{destination}"
end

def build_svg
  require 'esvg'
  if @svg.nil? 
    @svg = Esvg::SVG.new(path: 'app/assets/esvg/megatron', output_path: 'app/assets/javascripts/megatron', optimize: true)
  else
    @svg.read_files
  end

  @svg.write
  puts "Svg written"
end
