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
  listener = Listen.to('assets/stylesheets/megatron/', only: /\.scss$/) do |modified, added, removed|
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
  system "sass assets/stylesheets/megatron/megatron.scss:#{destination}"
  system "postcss --use autoprefixer #{destination} -o #{destination}"
  puts "Built: #{destination}"
end

def version
  Gem.loaded_specs["megatron"].version
end
