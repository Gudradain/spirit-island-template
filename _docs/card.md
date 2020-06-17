# Cards

The fastest way to get started is to start from the example template in the folder card/example.

### Custom HTML Tag

The card template use a lot of custom HTML tags, here is a quick summary:

- card: Represent one card. It accepts the class "fast" or "slow".
- cost: The cost of the card.
- name: The name of the card.
- element: Each element tag represent an element that will appear on the side of the card. Here are the possible choices
  - sun
  - moon
  - fire
  - air
  - water
  - earth
  - plant
  - animal
- info-title: The headers for the speed, range and target land table. You don't need to modify this section
- info: The section where you put the speed, range and target land information
  - info-speed: This section is automatic based on the card class. You don't need to modify it.
  - info-range: Information about the range. It contains 2 custom tags.
    - range: You can put the range for the card
    - no-range: If your card doesn't require a range
  - info-target: Information about the card target.
- rules-container: This section contains the rules and threshold
  - rules: This section contains the text for the card.
  - threshold: This section contains the threshold information.
    - threshold-line: The line at the top. You don't need to modify it.
    - threshold-title: The "IF YOU HAVE" at the top. You don't need to modify it
    - threshold-condition: The elements needed to activate the threshold.
- artist-name: The name of the artist that made the picture you used in the card.