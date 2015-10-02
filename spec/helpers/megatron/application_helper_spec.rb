require "spec_helper"

describe Megatron::ApplicationHelper do

  let(:params) { ActionController::Parameters.new }
  before { allow(helper).to receive(:params).and_return params }  

  describe '#megatron_asset_path' do
    it { expect(helper.megatron_asset_path("test")).to eq('/assets/megatron/test') }
  end
  
  describe '#megatron_assets_tags' do
    subject { helper.megatron_assets_tags }
    it { is_expected.to include("megatron-#{Megatron::VERSION}.js") }
    it { is_expected.to include("megatron-#{Megatron::VERSION}.css") }
  end

  describe '#test_current_page' do
    
    context 'w/ a url' do
      before { expect(helper.request).to receive(:fullpath).and_return '/test/something' }
      context 'match' do
        it { expect(helper.test_current_page(path: '/test/something')).to eq(true) }
      end
      context 'no match' do
        it { expect(helper.test_current_page(path: '/test/ssadas')).to eq(false) }
      end
    end

    context 'w/ controller' do
      let(:params) { ActionController::Parameters.new(controller: 'hello') }

      context 'match' do
        it { expect(helper.test_current_page(controller: 'hello')).to eq(true) }
      end
      context 'no match' do
        it { expect(helper.test_current_page(controller: 'hello/dear')).to eq(false) }
      end

      context 'w/ array' do

        context 'match' do
          it { expect(helper.test_current_page(controller: ['hello', 'ahhh'])).to eq(true) }
        end
        context 'no match' do
          it { expect(helper.test_current_page(controller: ['ahhh', 'blahh'])).to eq(false) }
        end

        context 'and a path' do
          before { params[:controller] = 'hello' }
          before { expect(helper.request).to receive(:fullpath).and_return '/test/something' }
          context 'match' do
            it { expect(helper.test_current_page(path: '/test/something', controller: ['hello', 'world'])).to eq(true) }
          end
          context 'no match' do
            it { expect(helper.test_current_page(path: '/test/some', controller: ['testing', 'world'])).to eq(false) }
          end
        end

      end

    end
  end

  describe '#link_up' do
    before { expect(helper.request).to receive(:fullpath).and_return '/test/something' }

    context 'w/ correct path' do
      it { expect(helper.link_up('/test/something') {}).to include('here') }
    end

    context 'w/ incorrect path' do
      it { expect(helper.link_up('/test/some') {}).not_to include('here') }
    end

    context 'w/ here_if' do
      let(:anchor) { helper.link_up('/test/some', here_if: {controller: ['hello', 'world']}) {} }

      context 'match' do
        before { params[:controller] = 'hello' }
        it { expect(anchor).to include('here') }
      end

      context 'no match' do
        it { expect(anchor).not_to include('here') }
      end

    end

    
    # it { expect(helper.link_up('/test/something', {here_if: {controller: ['hello', 'world']}}) {} ).to include('here') }
  end

end