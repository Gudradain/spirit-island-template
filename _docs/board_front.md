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
    - growth title: Usually "Growth (PICK ONE)"
	- growth sub-group: Groupings of growth options (as seen on Lure)
	  - Example: *\<sub-growth title="pick one of:" bordered\>*
	  - Use bordered for all but the last sub-group
    - growth-group: Each individual section in the Growth section
      - growth-group cost: The cost associated with this group (as seen on Keeper).
      - growth-group tint: A color shift on growth options (as seen on Spread of Rampant Green).
      - growth-group values: The Spirit Actions within a growth group.
	    - Example: *\<growth-group tint="green" cost="3" values="reclaim-all;gain-power-card"\>\<\/growth-group\>*
        - Supported Options for Values:
		

|Category|Action|Usage|Details|Examples|
|------|------|------|------|----|
|Reclaim|Reclaim All|reclaim-all|||
||Reclaim One|reclaim-one|||
|Adding Presence|Add Presence at Range|add-presence(x)|Add a Presence up to x Range. *x can be 'any' or 1, 2, 3 or 4*||
||Add Presence with Condition|add-presence(x,y)|Add a Presence with y conditions at x Range. y can be terrain types (including dual types), tokens, invaders, invader pieces, dahan, blight, etc.||
||Add Presence with Multiple Conditions|add-presence(x,y,z,...,*and/or*)|Add a Presence with multiple conditions y, z, etc at x Range, the last parameter must be 'or' or 'and'.|add-presence(3,jungle,beast,or) - Sharp Fangs<br>add-presence(2,town,city,blight,or) - Vengeance|
||Add Presence with Custom Text|add-presence(x,text,*your_text_here*)|Add a Presence at x Range. The presence text will read "Add a Presence *your_text_here*". The icon will be **!!!**||
||Add Presence and/or Tokens|add-presence(x,token,y,and/or)|Add a Presence and/or a token y (beasts, disease, etc) at x Range.|add-presence(3,token,beast,and) - Many Minds<br>add-presence(1,token,disease,or) - Vengeance|
|Gaining Elements|Gain One Element|gain-element(x)|Gain Element x, which can by all the elements or 'any' or 'star'|'star' is the Starlight element icon|
||Gain Multiple Elements|gain-element(x,y)|If y is a number, gain y of x Element||
||Gain Multiple Elements|gain-element(x,y)|If y is an element, gain x or y Elements||
||Gain Multiple Elements|gain-element(x,y,z,...,*or*/*and*)|Gain elements x, y, z or more. The last option must be *or* or *and*||
|Pushing|Push from Your Lands|push(x)|Push entity x (dahan, beasts, presence, etc) from 1 of your lands.||
||Push from Your Lands|push(x,y)|Push entity x (dahan, beasts, presence, etc) a land at range y.||
||Push from Your Lands|push(x,y,z)|Push x from z lands of condition y. y can be terrain types, sacred site, token types, etc. z can be a numeral or 'each' (or another word at your own risk).|push(presence,ocean,each) - Ocean|
|Gathering|Gather into Your Lands|gather(x)|Gather entity x (dahan, beasts, presence, etc) into 1 of your lands.||
||Gather at Range|gather(x,y)|If y is a number, gather x into a land at y range.|gather(2,beasts) - Many Minds|
||Gather with Conditions|gather(x,y)|If y is a condition, gather x into 1 of your lands with y condition (sacred site, beasts, etc).||
||Gather into Multiple Lands with Conditions|gather(x,y,z)|Gather x into z lands of y condition. z can be a number or 'each'|gather(presence,ocean,each) - Ocean|
|Move Presence|Move Presence|move-presence(x)|Move a Presence up to x Range||
|Gaining Energy|Gain Energy|gain-energy(x)|Gain x Energy||
||Gain Energy per Element|gain-energy(x)|Gain 1 Energy per Element x||
||Gain Energy per Element plus Flat Energy|gain-energy(x,y)|Gain x Energy plus 1 Energy per Element y|gain-energy(2,fire) - Wildfire|
||Gain Energy per Custom Item|gain-energy(text,*your_text_here*)|Gain 1 Energy per condition of your choosing. Icon will be a !!!.||
||Gain Energy per Custom Item Plus Flat Energy|gain-energy(x,text,*your_text_here*)|Gain x Energy plus 1 Energy per condition of your choosing. Icon will be a !!!.||
|Gain Power Card|Gain a Power Card|gain-power-card|||
|Discard 2 Cards|Discard 2 Power Cards|discard-cards|As seen on Downpour||
|Gain Card Play|Gain 1 Card Play|gain-card-play|||
||Gain  Card Plays|gain-card-play(x)|Gain x card plays||
|Forget Power Card|Forget a Power Card|forget-power-card|||
|Make a Power Fast|Make a Power Fast|make-fast|One of your Powers may be Fast||
|Ignore Range |Ignore Range this Turn|ignore-range|Ignore Range this turn (as seen on Finder)||
|Isolate|Isolate one of your Lands|isolate|||
||Isolate a land at Range|isolate(x)|Isolate a land at x Range||
|Destroy Presence|Destroy a Presence|destroy-presence|||
|Gaining Fear|Gain Fear|fear(x)|Gain x Fear||
||Gain Fear per Element|fear(x)|Gain 1 Fear per Element x||
||Gain Fear per Element plus Flat Fear|fear(x,y)|Gain x Fear plus 1 Fear per Element y||
||Gain Fear per Custom Item|fear(text,*your_text_here*)|Gain 1 Fear per condition of your choosing. Icon will be a !!!.||
||Gain Fear per Custom Item Plus Flat Fear|fear(x,text,*your_text_here*)|Gain x Fear plus 1 Fear per condition of your choosing. Icon will be a !!!.||
|Custom|Custom Text with !!! Icon|custom(*your_text_here*)|A custom growth option with the image !!!||
||Custom Text with Any Icon|custom(*your_text_here*,x)|A custom growth option with the icon of your choice||


  - **presence-tracks**: The container for the Presence Tracks.

    There are two mechanisms to populate this. The simple approach is to use the specific energy and card tracks as demonstrated by the 'board_front' example.
    
    If you wish to produce a more complex layout then you'll need to use the table-based approach demonstrated by the 'board_front_serpent_style' example. 
    - **energy-track**: The entire Energy Track
      - energy-track values: The actual values that will be used to create the Energy Track
        - Supported Options:
          - Integer 1,2,3,4,5,6,7 etc.
          - Elements: earth, fire, air, moon, water, plant, animal, sun, or any
          - forget-power-card: Forget Power (not cannon)
          - Combinations of Elements/Energy: 3+earth, 2+fire, earth+any, water+plant
          - push(x): Push x from land (as seen on Trickster with Dahan)
		  - gather(x): Gather x into land
		  - text(yourtext): Allows any arbitrary text in the subtext, paired with a "!" icon in the presence node
    - **card-play-track**: The entire Card Play Track
      - card-play-track values: The actual values that will be used to create the Card Play Track
        - Supported Options:
          - Integer 1,2,3,4,5,6,7 etc.
          - forget-power-card: Forget Power (not cannon)
          - Elements: earth, fire, air, moon, water, plant, animal, sun, or any
		  - Element star: use element-start (as seen on Starlight)
          - Combinations of Elements/Energy/Reclaim One: (3+earth, earth+any, earth+air+fire, 2+water+reclaim-one)
          - Reclaim One: reclaim-one, 3+reclaim-one, earth+reclaim-one
          - push(x): Push x from land (as seen on Trickster with Dahan)
		  - gather(x): Gather x into land
		  - text(yourtext): Allows any arbitrary textin the subtext, paired with a "!" icon in the presence node
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
        - To achieve 'for each element' effects, use the notation {element, #}. For example, Serpent's second innate has "for each {moon,2} {stone,2}" on the second level.