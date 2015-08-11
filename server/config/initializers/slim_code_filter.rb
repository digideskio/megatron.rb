require 'slim'

module Slim
  class CodeEngine < Slim::Embedded::TagEngine
    disable_option_validator!

    set_options tag: :pre, attributes: { class: "" }

    def on_slim_embedded(engine, body)

      lang = body[1].last
      body.slice!(1,2)

      code = super(engine, body)
      code[3][2][3][1] = "lang-#{lang}"
      code
    end
  end
end

Slim::Embedded.register :code, Slim::CodeEngine