web: cd server && bundle exec rails s -p $PORT
docs: cd docs && bundle exec rails s -p $PORT
js: ./node_modules/.bin/watchify app/assets/javascripts/megatron/index.js --debug -t babelify -o public/assets/megatron/megatron-`bundle exec ruby -e 'puts Gem.loaded_specs["megatron"].version'`.js -v
css: bundle exec rake sass_watch
