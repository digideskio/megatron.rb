class DemoController < ApplicationController
  def show
    render action: "#{params[:page]}", layout: 'demo'
  end
end
