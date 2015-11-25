FROM mhart/alpine-node:5.0

ENV BUILD_PACKAGES bash curl-dev ruby-dev build-base libffi-dev libpq postgresql-dev git
ENV RUBY_PACKAGES ruby ruby-io-console ruby-bundler ruby-raindrops ruby-nokogiri

# Update and install all of the required packages.
# At the end, remove the apk cache
RUN apk update && \
    apk upgrade && \
    apk add $BUILD_PACKAGES && \
    apk add $RUBY_PACKAGES && \
    rm -rf /var/cache/apk/*

RUN mkdir /app
WORKDIR /app

ADD . /app
RUN bundle install --jobs 4 --without development test

RUN npm install

WORKDIR /app

ENV RAILS_ENV production
RUN cd server && bundle exec rake tmp:cache:clear
RUN cd server && bundle exec rake assets:precompile

CMD cd server && bundle exec rails s -p $PORT -b 0.0.0.0
