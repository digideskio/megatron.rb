module Megatron
  module NavigationHelper
    class Nav < Megatron::Helper
      def item(text, href, options = {})
        options[:class] = add_class(options[:class], "#{nav_class}-item")
        nav_icon = options.delete(:icon)

        link_up href, options do
          concat nav_icon(nav_icon) unless nav_icon.nil?
          concat ' '
          if options[:link_label] == false
            concat icon_label(text)
          else
            concat link_label(text)
          end
        end
      end

      def link_label(text)
        content_tag(:span, class: 'link_label icon_label') { text }
      end

      def icon_label(text)
        content_tag(:span, class: 'icon_label') { text }
      end

    end

    class PrimaryNav < Nav
      def nav_class
        'primary_nav'
      end

      def display(body)
        content_for(:primary_nav) { body }
      end

      def sign_out(href='/session/destroy', options={})
        content_tag :div, class: 'primary_nav-top' do
          options[:data] = {
            trigger: 'dialog',
            title: 'Are you sure you want to sign out?',
            message: 'Click cancel if you want to stay',
            continue: 'Sign out',
            close: 'Cancel',
            follow: href,
          }.merge(options[:data] || {})

          options[:text] ||= 'Sign out'
          options[:icon] ||= :power
          options[:link_label] = false

          concat item(options[:text], '#', options)
        end
      end
    end

    class SecondaryNav < Nav
      def nav_class
        'secondary_nav'
      end

      def display(body)
        content_for(:secondary_nav) { body }
      end

    end
  end
  
end
