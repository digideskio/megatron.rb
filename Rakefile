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

load 'rails/tasks/statistics.rake'

Bundler::GemHelper.install_tasks

desc "Pick a random user as the winner"
task :sass_watch do
  require 'listen'
  listen
end

def listen
  listener = Listen.to('app/assets/stylesheets/megatron/', only: /\.scss$/) do |modified, added, removed|
    output_paths("Changes detected to", modified)
    output_paths("Added", added)
    output_paths("Removed", removed)

    build
  end

  build

  listener.start # not blocking
  sleep
end

def output_paths(prefix, paths)
  unless paths.empty?
    paths.map! { |p| localize_path(p) }
    puts "#{prefix}: #{paths.join("\n")}"
  end
end

def localize_path(path)
  path.sub(/#{Dir.pwd}\//, '')
end

def destination
  "public/assets/megatron/megatron-#{version}.css"
end

def build
  system "sass app/assets/stylesheets/megatron/megatron.scss:#{destination}"
  system "./node_modules/postcss-cli/bin/postcss --use autoprefixer #{destination} -o #{destination}"
  puts "Built: #{destination}"
end

def version
  Gem.loaded_specs["megatron"].version
end

namespace :megatron do
  
  require 's3'

  task :upload do

    bucket = S3::Service.new(access_key_id: ENV['AWS_KEY'], secret_access_key: ENV['AWS_SECRET']).buckets.find('megatron-assets')

    Dir.glob('public/assets/megatron/megatron-*') do |file|
      name = file.split('/').last
      obj = bucket.objects.build("assets/megatron/#{name}")

      obj.acl = :public_read

      obj.content_type = if name.end_with?('.js')
        'application/javascript'
      elsif name.end_with?('.css')
        'text/css'
      elsif name.end_with?('.json') || name.end_with?('.map')
        'application/json'
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

end