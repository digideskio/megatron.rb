class ErrorsController < ApplicationController
  def show
    render action: "#{params[:page]}", layout: 'megatron/errors'
  end
end

