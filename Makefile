GEM_VERSION = `bundle exec ruby -e 'puts Gem.loaded_specs["megatron"].version'`

.PHONY: build

build: build.svg build.js build.css

build.js:
	bundle exec rake megatron:js:build
	bundle exec rake megatron:js:gzip

build.js.lite:
	bundle exec rake megatron:js:build

build.svg:
	bundle exec rake megatron:svg:build

build.css:
	bundle exec rake megatron:css:build
	bundle exec rake megatron:css:gzip

build.css.lite:
	bundle exec rake megatron:css:build

build.lite: build.svg build.js.lite build.css.lite

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
