module Megatron
  module Colors
    COLORS = {
      "white"         => "#FFFFFF",
      "soft-white"    => "#fbfbfb",
      "off-white"     => "#f5f6f6",
      "silver"        => "#edefef",
      "overcast"      => "#dadede",
      "light-gray"    => "#B3B9BC",
      "gray"          => "#8d9297",
      "medium-gray"   => "#666",
      "dark-gray"     => "#444",
      "slate"         => "#788392",
      "blue-gray"     => "#5e6b77",
      "shade"         => "#47515b",
      "night"         => "#2D333B",
      "space"         => "#262b30",
      "black"         => "#000",

      "bold-red"      => "#DF192A",
      "red"           => "#cb413a",
      "light-red"     => "#d55044",
      "pale-red"      => "#e46767",
      "pink"          => "#FF2D55",
      "soft-red"      => "#f7d4d4",

      "orange"        => "#FF9500",
      "pale-orange"   => "#e4a667",
      "soft-orange"   => "#f7e8d4",

      "yellow"        => "#FFCC00",
      "soft-yellow"   => "#f7f4d4",
      "cream"         => "#fef0bd",
      "yellow-white"  => "#fffefa",

      "green"         => "#2ab22e",
      "soft-green"    => "#d4f7e0",
      "green-white"   => "#fafefa",

      "dark-blue"     => "#427BC5",
      "blue"          => "#4A89DC",
      "light-blue"    => "#5D9CEC",
      "boy-blue"      => "#409bd9",
      "baby-blue"     => "#82C1ED",
      "pale-blue"     => "#79add2",
      "soft-blue"     => "#d4eef7",
      "blue-white"    => "#f5fcff",

      "purple"        => "#8e55dd",
      "light-purple"  => "#967ADC",
      "soft-purple"   => "#e3d4f7",

      # Solarized Colors
      "code-base03"  => "#fbfbfb",
      "code-base02"  => "#eee8d5",
      "code-base01"  => "#93a1a1",
      "code-base00"  => "#839496",
      "code-base0"   => "#657b83",
      "code-base1"   => "#586e75",
      "code-base2"   => "#073642",
      "code-base3"   => "#002b36",
      "code-yellow"  => "#b58900",
      "code-orange"  => "#cb4b16",
      "code-red"     => "#dc322f",
      "code-magenta" => "#d33682",
      "code-violet"  => "#6c71c4",
      "code-blue"    => "#268bd2",
      "code-cyan"    => "#2aa198",
      "code_green"   => "#859900",

    }

    extend self

    def color(name)
      COLORS[name.sub(/_/,'-')]
    end

    def colors
      COLORS
    end
  end
end
