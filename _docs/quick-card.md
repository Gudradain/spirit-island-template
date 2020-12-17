# Quick-Cards

The fastest way to get started is to start from the examples in the file "_examples/card/card-front.html".

### How does it work?

Under the hood, the quick-card template is translated to the [card template](_docs/card.md) by javascript before being displayed by the browser.

This means that the card template will always be supported and that it can be more flexible than the quick-card template.

### Shorthand Syntax for Icons

The quick-card template introduces a shorthand syntax for icons. You can now use {icon-class} instead of <icon class="icon-class"></icon>.

### Custom Attributes

The quick-card template use a lot of custom attributes, here is a quick summary:

- quick-card: Represent one card. It accepts the following attributes
  - speed: The speed of the card.
  - cost: The cost of the card
  - name: The name of the card
  - image: The image of the card
  - elements: The elements that appear on the side of the card. Separate each element by a ","
  - range: The range of the card.
    - For no range, type "none".
    - For range, use an icon (if needed) + an integer separated by a comma. Examples:
      - 0
      - 1
      - presence,1
      - sacred-site,2
      - wetland-presence,1
  - target: The target of the card. It accepts html code. Refer to the [card template](_docs/card.md) for the syntax. The icon that you type in here can use the shorthand syntax.
  - target-title: The target header.
  - artist-name: The name of the artist.
  - print-friendly: The only valid value is "yes". It helps to see the elements when you print the cards in black & white.

### Custom HTML Tags

- quick-card: Represent one card. It can contains the following tags:
  - rules: Same syntax as the [card template](_docs/card.md).
  - threshold: Can use a shorthand syntax with the condition attribute.
    - condition: The threshold condition. It is a list of condition separated by comma. Here are some examples:
      - "3-animal"
      - "2-sun,2-water"
      - "3-air,4-water,3-earth"


