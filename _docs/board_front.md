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
      - growth-group cost: The cost associated with this group. (as seen on Keeper)
      - growth-group values: The actual values that will be used to create the Growth section.
        - Supported Options:
          - reclaim-all: Reclaim All
          - reclaim-one: Reclaim One
          - discard-cards: Discard 2 Power Cards (as seen on Downpour)
          - gain-card-play: +1 Card Play this turn
          - gain-power-card: Gain Power Card
          - forget-power-card: Forget Power Card (not cannon)
          - gain-energy(X): Gain X Energy
          - make-fast: One of your Powers may be Fast
          - add-presence(X): Add a Presence up to X Range
          - add-presence(X,Y): Add a Presence limited to Y Land type up to X Range
          - move-presence(X): Move a Presence up to X Range
          - presence-no-range: Add a presence anywhere (as seen on Finder)
          - ignore-range: Ignore Range this turn (as seen on Finder)
          - gain-element(X): Gain X Element (currently limited to only one)
          - push(x): Push x from land (as seen on Trickster with Dahan)
  - **presence-tracks**: The container for the Presence Tracks.

    There are two mechanisms to populate this. The simple approach is to use the specific energy and card tracks as demonstrated by the 'board_front' example.
    
    If you wish to produce a more complex layout then you'll need to use the table-based approach demonstrated by the 'board_front_serpent_style' example. 
    - **energy-track**: The entire Energy Track
      - energy-track values: The actual values that will be used to create the Energy Track
        - Supported Options:
          - Integer 1,2,3,4,5,6,7 etc.
          - Elements earth, fire, air, moon, water, plant, animal, sun, or any
          - forget-power-card: Forget Power (not cannon)
          - Combinations of Elements/Energy: 3+earth, 2+fire, earth+any, water+plant
          - push(x): Push x from land (as seen on Trickster with Dahan)
    - **card-play-track**: The entire Card Play Track
      - card-play-track values: The actual values that will be used to create the Card Play Track
        - Supported Options:
          - Integer 1,2,3,4,5,6,7 etc.
          - forget-power-card: Forget Power (not cannon)
          - Elements earth, fire, air, moon, water, plant, animal, sun, or any
          - Combinations of Elements/Energy: (3+earth, 2+fire, earth+any, water+plant)
          - Reclaim One: reclaim-one, 3+reclaim-one, earth+reclaim-one
          - push(x): Push x from land (as seen on Trickster with Dahan)
    - **table**: An html table that allows more flexible positioning of nodes. Individual presence track options are specified within the `<td>` table cells. The available options are exactly the same as described for the energy and card-play tracks above, with the exception that integer values must be prefixed with with 'card' or 'energy'. For example 'card1' means 1 card play, 'energy2' means 2 energy, etc.
  - **innate-powers**: The container for the Innate Powers
    - quick-innate-power: The container for a single Innate Power
      - name: The name of the Innate Power
      - speed: Either "fast" or "slow"
      - range: The range of the innate.
        - For no range, type "none".
        - For range, use an icon (if needed) + an integer separated by a comma. Examples:
          - 0
          - 1
          - presence,1
          - sacred-site,2
          - wetland-presence,1
      - target: The target of the innate. It accepts html code. Refer to the [card template](_docs/card.md) for the syntax. The icon that you type in here can use the shorthand syntax.
      - target-title: Either "TARGET" or "TARGET LAND"
      - note: (See Volcano Looming High or Lure of the Deep Wilderness as an example)
      - level: Contains the information for one level of an Innate Power
        - threshold: Contains the elemental information for the threshold:
          - Example: 1-plant,2-fire
        - The actual text for the level sits within the level tag