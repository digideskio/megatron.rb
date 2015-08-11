web: cd server && bundle exec rails s -p $PORT -b 0.0.0.0
js: ./node_modules/.bin/watchify app/assets/javascripts/megatron/index.js --poll --debug -t babelify -o public/assets/megatron/megatron-`bundle exec ruby -e 'puts Gem.loaded_specs["megatron"].version'`.js -v
css: bundle exec rake sass_watch
