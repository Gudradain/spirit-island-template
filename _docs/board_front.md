# Board

The fastest way to get started is to start from the example template in the folder boards/example.

## Custom HTML Tag

The board template uses some custom HTML tags, here is a quick summary:

General Images: Every image in a board can be called by simply using its name enclosed within "{}". Here is a list of what is available:
- Elements (fire, water, earth, air, plant, animal, sun, moon)
- Invaders (explorer, town, city)
- Island symbols (blight, dahan, fear, disease, wilds, beast, strife, badlands)
- Land symbols (sand, mountain, jungle, wetland, ocean, jungle-wetland, jungle-sand, sand-wetland, mountain-jungle, mountain-wetland, mountain-sand)
- Targetting symbols (range-plus-one, range-0, range-1, range-2, range-3, range-4, player-spirit)


- **board**: Represent the whole board.
  - spirit-name: The name of the Spirit.
  - img class="spirit-image": The main Spirit image.
  - img class="spirit-border": The image that sits underneath the Spirit name.
  - special-rules-container: The container for the Special Rules
    - special-rules-subtitle: The name of the Special Rule.
    - special-rule: The rule itself.
  - **growth**: The container for the Growth Options
    - growth title: Usually "Growth (PICK ONE)" (For now, new features coming soon)
    - growth-group: Each individual section in the Growth section
      - growth-group values: The actual values that will be used to create the Growth section.
        - Supported Options:
          - reclaim-all: Reclaim All
          - reclaim-one: Reclaim One
          - discard-cards: Discard 2 Power Cards (as seen on Downpour)
          - gain-card-play: +1 Card Play this turn
          - gain-power-card: Gain Power Card
          - gain-energy(X): Gain X Energy
          - make-fast: One of your Powers may be Fast
          - add-presence(X): Add a Presence up to X Range
          - add-presence(X,Y): Add a Presence limited to Y Land type up to X Range
          - move-presence(X): Move a Presence up to X Range
          - presence-no-range: Add a presence anywhere (as seen on Finder)
          - ignore-range: Ignore Range this turn (as seen on Finder)
          - gain-element(X): Gain X Element (currently limited to only one)
  - **presence-tracks**: The container for the Presence Tracks
    - **energy-track**: The entire Energy Track (current functionality only supports one row)
      - energy-track values: The actual values that will be used to create the Energy Track
        - Supported Options:
          - Integer 1,2,3,4,5,6,7 etc.
          - Elements earth, fire, air, moon, water, plant, animal, sun, or any
          - Combinations of Elements/Energy: 3+earth, 2+fire, earth+any, water+plant
    - **card-play-track**: The entire Card Play Track (current functionality only supports one row)
      - card-play-track values: The actual values that will be used to create the Card Play Track
        - Supported Options:
          - Integer 1,2,3,4,5,6,7 etc.
          - Elements earth, fire, air, moon, water, plant, animal, sun, or any
          - Combinations of Elements/Energy: (3+earth, 2+fire, earth+any, water+plant
          - Reclaim One: reclaim-one, 3+reclaim-one, earth+reclaim-one
  - **innate-powers**: The container for the Innate Powers
    - quick-innate-power: The container for a single Innate Power
      - name: The name of the Innate Power
      - speed: Either "fast" or "slow"
      - range: {range-0}, {range-1}, {range-2}, {range-3}, or {range-4}. Also supports (sacred-site}
      - target: The value for the target land
      - target-title: Either "TARGET" or "TARGET LAND"
      - note: (See Volcano Looming High or Lure of the Deep Wilderness as an example)
      - level: Contains the information for one level of an Innate Power
        - threshold: Contains the elemental information for the threshold:
          - Example: 1-plant,2-fire
        - The actual text for the level sits within the level tag