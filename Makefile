GEM_VERSION = `bundle exec ruby -e 'puts Gem.loaded_specs["megatron"].version'`

.PHONY: build

build: build.svg build.js build.css

build.js:
	./node_modules/.bin/browserify app/assets/javascripts/megatron/index.js -t babelify --standalone Megatron -o public/assets/megatron/megatron-$(GEM_VERSION).js -d -p [ minifyify --map megatron-$(GEM_VERSION).map.json --output public/assets/megatron/megatron-$(GEM_VERSION).map.json ]

build.svg:
	rake megatron:svg:build

build.css:
	rake megatron:css:build

install: touch_empty clean build

clean:
	rm -f public/assets/megatron/megatron*

touch_empty:
	touch node_modules/browserify/lib/_empty.js

bundle:
	bundle install

publish: clean build
	rake release
	bundle exec rake megatron:upload

check-env:
	ifndef ${AWS_KEY}
		$(error AWS_KEY needs to be defined to upload assets to S3)
	endif
	ifndef ${AWS_SECRET}
		$(error AWS_SECRET needs to be defined to upload assets to S3)
	endif
