GEM_VERSION = `bundle exec ruby -e 'puts Gem.loaded_specs["megatron"].version'`

.PHONY: build

build: build.js build.css

build.js:
	./node_modules/.bin/browserify app/assets/javascripts/megatron/index.js -t babelify --standalone Megatron -o public/assets/megatron/megatron-$(GEM_VERSION).js -d -p [ minifyify --map megatron-$(GEM_VERSION).map.json --output public/assets/megatron/megatron-$(GEM_VERSION).map.json ]

build.css:
	bundle exec sass --style compressed app/assets/stylesheets/megatron/megatron.scss:public/assets/megatron/megatron-$(GEM_VERSION).css
	./node_modules/postcss-cli/bin/postcss --use autoprefixer public/assets/megatron/megatron-$(GEM_VERSION).css -o public/assets/megatron/megatron-$(GEM_VERSION).css

install: clean build

clean:
	rm -f public/assets/megatron/megatron*

publish: install
	gem build megatron.gemspec
	gem push megatron-$(GEM_VERSION).gem
