source 'https://rubygems.org'

# Declare your gem's dependencies in megatron.gemspec.
# Bundler will treat runtime dependencies like base dependencies, and
# development dependencies will be added by default to the :development group.
gemspec

# Declare any dependencies that are still in development here instead of in
# your gemspec. These might include edge Rails or gems from your path or
# Git. Remember to move these dependencies to your gemspec before releasing
# your gem to rubygems.org.

# To use a debugger
# gem 'byebug', group: [:development, :test]

gem 'sass', '~> 3.3', '>= 3.3.4'
gem 'rack-cors'
gem 'puma'
gem 'sass-rails', '5.0.3'
gem 'redcarpet'
gem 'autoprefixer-rails'
gem 's3', require: false
gem 'esvg'

group :development do
  gem 'listen', '~> 3.0'
  gem 'foreman'
end

group :development, :test do
  gem 'pry-byebug'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
end

group :test do
  gem 'combustion', '~> 0.5.3'
  gem 'rspec-rails', '~> 3.3.0'
end

group :production do
  gem 'rails_12factor'
end
