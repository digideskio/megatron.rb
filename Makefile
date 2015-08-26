GEM_VERSION = `bundle exec ruby -e 'puts Gem.loaded_specs["megatron"].version'`

.PHONY: build

build: build.js build.css

build.js:
	./node_modules/.bin/browserify app/assets/javascripts/megatron/index.js -t babelify --standalone Megatron -o public/assets/megatron/megatron-$(GEM_VERSION).js -d -p [ minifyify --map megatron-$(GEM_VERSION).map.json --output public/assets/megatron/megatron-$(GEM_VERSION).map.json ]

build.css:
	bundle exec sass --style compressed app/assets/stylesheets/megatron/megatron.scss:public/assets/megatron/megatron-$(GEM_VERSION).css
	./node_modules/postcss-cli/bin/postcss --use autoprefixer public/assets/megatron/megatron-$(GEM_VERSION).css -o public/assets/megatron/megatron-$(GEM_VERSION).css

clean:
	rm -f public/assets/megatron/megatron*

touch_empty:
	touch node_modules/browserify/lib/_empty.js

bundle:
	bundle install

publish: bundle clean build
	gem build megatron.gemspec
	gem push megatron-$(GEM_VERSION).gem
	bundle exec rake megatron:upload

check-env:
	ifndef ${AWS_KEY}
		$(error AWS_KEY needs to be defined to upload assets to S3)
	endif
	ifndef ${AWS_SECRET}
		$(error AWS_SECRET needs to be defined to upload assets to S3)
	endif