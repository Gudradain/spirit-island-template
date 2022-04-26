# Spirit Board

The fastest way to get started is to start from an example in the "My Custom Content/My Spirits" folder. Return here for detailed explanations of options for different parts of the board.

### General Icons
Icons for invaders, elements, dahan, etc can be used by enclosing its name with "{}". For example, {dahan} or {fire}. Here is a list of what is available:
- Elements (fire, water, earth, air, plant, animal, sun, moon)
	- any: the Any element icon
	- star: the Element icon (from Starlight)
	- markerplus, markerminus: the Prepare Element Marker and Discard Element Marker (from Shifting Memory)
- Invaders (explorer, town, city)  
- Presence (presence, sacred-site, no-presence, no-own-presence, destroyed-presence, move-presence-1, move-presence-2, move-presence-3, move-presence-4)  
- Island icons (blight, dahan, beasts, wilds, disease, strife, badlands)  
- Fear icons (fear, terror1, terror2, terror3)
- Land icons (sand, mountain, jungle, wetland, ocean, jungle-wetland, jungle-sand, sand-wetland, mountain-jungle, mountain-wetland, mountain-sand)  
- Power icons (fast, slow, minor, major, player-spirit, or)
- Range icons (range-0, range-1, range-2, range-3, range-4, jungle-presence, sand-presence, mountain-presence, wetland-presence)
- Targeting icons (player-spirit)  
- Power effect icon (isolate, range-plus-1, range-plus-2, range-plus-3)
- Growth icons (see [Growth](#growth) section for examples)
- Presence track icons (see Presence Track section for examples)
- Custom icons can be added in the \<head\>\<style\> section at the top of the spirit board HTML
	 - Save the custom icon image file in the same folder as the HTML
	 - Update the custom icon reference with the .png or .jpg of the custom icon
	 - Use the icon name 'custom1' (or custom2 or custom3) to use your icons in your design
	 - Example: icon.custom1{background-image: url('demo_custom_icon.png'); }


### Spirit Name & Board
- board: Represents the whole board.
- spirit-name: The name of the Spirit.
- spirit-image: The main Spirit image. The image should be in the same folder as the html.
	- spirit-image-scale: Used to scale the main spirit image
- spirit-border: The image that sits underneath the Spirit name. The image should be in the same folder as the html.

### Special Rules
- special-rules-container: The container for the Special Rules
	- section-title: The section title "Special Rules". Typically this isn't changed.
	- special-rules-subtitle: The name of the Special Rule. You may have multiple special rules.
	- special-rule: The rule itself. Most icons will work here.
<details>
  <summary>Advanced Special Rule Options</summary>

- Serpent style presence nodes in the special rule
	- Example: *\<special-rules-track values="5,7,8,10,11,12,13"\>\<\/special-rules-track\>*

</details>

### Growth
- growth: The container for the Growth Options
- growth title: "Growth (PICK ONE)" or "Growth (PICK TWO)" or just "Growth" if you are using subgroups
- growth sub-group: Groupings of growth options (as seen on Lure)
	- title: instructions for how to pick among the subgroup (ie. "Pick one of:")
	- bordered: adds the double border that separates subgroups (ie. leave it off for the last subgroup)
	- Example: *\<sub-growth title="pick one of:" bordered\>*
- growth-group: Each individual section in the Growth section (within the subgroup, if you are using subgroups)
  - growth-group cost: The cost associated with this group (as seen on Keeper).
  - growth-group tint: A color shift on growth options (as seen on Spread of Rampant Green).
  - growth-group values: The Spirit Actions within a growth group, separated by semicolons (;).
	- Example: *\<growth-group tint="green" cost="3" values="reclaim-all;gain-power-card"\>\<\/growth-group\>*
		
#### Supported growth-group values
<details>
  <summary>Expand for Supported Growth Options</summary>

|Category|Action|Usage|Details|Examples|
|------|------|------|------|----|
|Reclaim|Reclaim All, Reclaim One, Reclaim Half|reclaim-all, reclaim-one, reclaim-half OR relcaim(x)|x can be all, one, half, or custom||
||Reclaim Custom|reclaim(custom,*your custom reclaim text*)|Custom reclaim text with a unique icon.|reclaim(custom,your Unique Power Cards)|
|Adding Presence|Add Presence at Range|add-presence(x)|Add a Presence up to x Range. *x can be 'any' or 1, 2, 3 or 4*||
||Add Presence with Condition|add-presence(x,y)|Add a Presence with y conditions at x Range. y can be terrain types (including dual types), tokens, invaders, invader pieces, dahan, blight, etc.||
||Add Presence with Multiple Conditions|add-presence(x,y,z,...,*and/or*)|Add a Presence with multiple conditions y, z, etc at x Range, the last parameter must be 'or' or 'and'.|Sharp Fangs: <br>add-presence(3,jungle,beast,or)<br>Vengeance: <br>add-presence(2,town,city,blight,or)|
||Add Presence and/or Tokens|add-presence(x,token,y,and/or)|Add a Presence and/or a token y (beasts, disease, etc) at x Range.|Many Minds: <br>add-presence(3,token,beast,and)<br>Vengeance: <br>add-presence(1,token,disease,or)|
||Add Presence with Custom Text|add-presence(x,text,*your_text_here*)|Add a Presence at x Range. The presence text will read "Add a Presence *your_text_here*". The icon will be **!!!**||
||Add Presence with Custom Text and Icon(s)|add-presence(x,text,*your_text_here*,y,...)|Add a Presence at x Range. The presence text will read "Add a Presence *your_text_here*". The icon will be y and any number of additional icons||
|Gaining Elements|Gain One Element|gain-element(x)|Gain Element x, which can by all the elements or 'any' or 'star'|'star' is the Starlight element icon|
||Gain Multiple Elements|gain-element(x,y)|If y is a number, gain y of x Element||
||Gain Multiple Elements|gain-element(x,y,z,...)|If y is an element, gain x or y or z Elements|Lure: <br>gain-element(moon,air,plant)|
||Gain Multiple Elements|gain-element(x,y,z,...,*and*)|Gain elements x, y, and z (or more). The last option must *and*||
|Preparing/Discarding Element Markers|Prepare One Element Marker|element-marker|Prepare 1 element marker||
||Prepare Multiple Element Marker|element-marker(x)|Prepare x element markers (x can be more than 2, or negative)|element-marker(2)|
||Discard Element Markers|element-marker(-x)|x is the number to discard|element-marker(-2)|
|Pushing|Push from Your Lands|push(x)|Push entity x (dahan, beasts, presence, etc) from 1 of your lands.||
||Push from Your Lands|push(x,y)|Push entity x (dahan, beasts, presence, etc) a land at range y.||
||Push with Conditions|push(x,y)|If y is a condition, push x from 1 of your lands with y condition (sacred site, beasts, etc).||
||Push from Multiple Lands with Conditions|push(x,y,z)|Push x from z lands of condition y. y can be terrain types, sacred site, token types, etc. z can be a numeral or 'each' (or another word at your own risk).|Ocean: push(presence,ocean,each)|
|Gathering|Gather into Your Lands|gather(x)|Gather entity x (dahan, beasts, presence, etc) into 1 of your lands.||
||Gather at Range|gather(x,y)|If y is a number, gather x into a land at y range.|Many Minds: <br>gather(2,beasts)|
||Gather with Conditions|gather(x,y)|If y is a condition, gather x into 1 of your lands with y condition (sacred site, beasts, etc).||
||Gather into Multiple Lands with Conditions|gather(x,y,z)|Gather x into z lands of y condition. z can be a number or 'each'|Ocean: gather(presence,ocean,each)|
|Move Presence|Move Presence|move-presence(x)|Move a Presence up to x Range||
|Gaining Energy|Gain Energy|gain-energy(x)|Gain x Energy|gain-energy(2)|
||Gain Energy per Thing|gain-energy(x)|Gain 1 Energy per Thing x (such as Elements, Sacred Sites, etc)|gain-energy(water)|
||Gain Energy per Thing plus Flat Energy|gain-energy(x,y)|Gain x Energy plus 1 Energy per Thing y|Wildfire: gain-energy(2,fire)|
||Gain Multiple Energy per Thing plus Flat Energy|gain-energy(x,y,z)|Gain x Energy plus z Energy per Thing y||
||Gain Energy per Custom Item Plus Flat Energy|gain-energy(x,text,*your_text_here*)|Gain x Energy plus 1 Energy per condition of your choosing. Icon will be a !!!.||
||Gain Energy per Custom w/ Icon Item Plus Flat Energy|gain-energy(x,text,*your_text_here*,y)|Gain x Energy plus 1 Energy per condition of your choosing. Icon will be y.||
||Gain Energy per Custom Item|gain-energy(text,*your_text_here*)|Gain 1 Energy per condition of your choosing. Icon will be a !!!.||
||Gain Energy per Custom Item w/ Icon|gain-energy(text,*your_text_here*,y)|If y is Entity, gain 1 Energy per Entity w/ your custom text. If y is number, gain y Energy per !!! w/ your custom text.||
||Gain Multiple Energy per Custom Item w/ Icon|gain-energy(text,*your_text_here*,y,z)|Gain z Energy per Entity y of your choosing.||
||Gain Energy per Card Play|energy-per-play|Gain 1 Energy per Card Play.|As seen on Trickster|
|Add Tokens|Add One Token|add-token(x,y)|At range x add token type y|add-token(2,beast)|
||Add Multiple Token of One Type|add-token(x,y, z)|Add z tokens of y type at range x|add-token(3,wilds,2)|
||Add Tokens of Different Types|add-token(x,y,z,...,and/or)|At range x, add a tokens of type y, z, and/or more. The last parameter must be 'or' or 'and'.|add-token(3,wilds,beasts,disease,and); add-token(3,strife,badlands,or);|
|Gain Power Card|Gain a Power Card|gain-power-card|||
|Repeating Growth Options|Repeat Growth Options|^x|Added to other growth options. x is the number of repeats. As seen on Fractured Days|gain-power-card^2; gain-energy(2)^3|
|Discarding Cards|Discard 2 Power Cards|discard-cards|As seen on Downpour||
||Discard 1 Power Card|discard-card|||
|Gain Card Play|Gain 1 Card Play|gain-card-play|Gain +1 Card Play|Volcano, Finder: gain-card-play|
||Gain Card Plays|gain-card-play(x)|Gain +x Card Plays||
|Forget Power Card|Forget a Power Card|forget-power-card|||
|Ignore Range |Ignore Range this Turn|ignore-range|Ignore Range this turn (as seen on Finder)||
|Gain Range |Gain Range this Turn|gain-range(x)|Gain x range for Powers this turn|gain-range(1)|
||Gain Range this Turn for...|gain-range(x,y)|Gain x range for y effects (powers, power cards, innate powers, everything) this turn|gain-range(2,powers)|
|Isolate|Isolate one of your Lands|isolate|Isolate one of your Lands||
||Isolate a land at Range|isolate(x)|Isolate a land at x Range||
|Destroy Presence|Destroy a Presence|destroy-presence|||
|Gaining Fear|Gain Fear|fear(x)|Gain x Fear||
||Gain Fear per Element|fear(x)|Gain 1 Fear per Element x||
||Gain Fear per Element plus Flat Fear|fear(x,y)|Gain x Fear plus 1 Fear per Element y||
||Gain Fear per Custom Item|fear(text,*your_text_here*)|Gain 1 Fear per condition of your choosing. Icon will be a !!!.|fear(text,for each of your blighted lands)|
||Gain Fear per Custom Item Plus Flat Fear|fear(x,text,*your_text_here*)|Gain x Fear plus 1 Fear per condition of your choosing. Icon will be a !!!.||
|Deal Damage|Damage at Range|damage(x,y)|At range x, deal y Damage|Starlight: damage(0,2)|
|Make a Power Fast|Make a Power Fast|make-fast|One of your Powers may be Fast||
|Custom|Custom Text with !!! Icon|custom(*your_text_here*)|A custom growth option with the image !!!||
||Custom Text with Any Icon|custom(*your_text_here*,x,...)|A custom growth option with the x icon of your choice (ie. town, dahan, element, etc). Can use more than 1 icon and they will appear in a row.||
|Or Growth Options|Allows pair of two growth options|or(x,y)|x and y are growth options (like the ones above)|Fractured Days's growth: or(gain-1-time^2,gain-card-play(2))|
|Presence Track Node|Puts the growth option in a presence track ring|presence-node(x)|x is a growth option (like the ones above)|presence-node(reclaim-one)|
</details>

### Presence Tracks
  - **presence-tracks**: The container for the Presence Tracks.
    There are two mechanisms to populate this. The simple approach is to use the specific energy and card tracks as demonstrated by the 'board_front' example. If you wish to produce a more complex layout then you'll need to use the table-based approach demonstrated by the 'board_front_serpent_style' example. 
    - **energy-track**: The entire Energy Track
      - energy-track values: The actual values that will be used to create the Energy Track. See 'Supported Presence Track Options'
	  - banner: Artwork behind the presence track can be added with the banner="example.png". The artwork should be in the same folder as the html
	  - banner-v-scale: Allows you to stretch your banner artwork vertically
	  - Example: *\<energy-track banner="example2.png" banner-v-scale="50%" values="1,isolate,2,text(custom text here),3,gain-card-pay-2,4+reclaim-one"\>\</energy-track\>*
    - **card-play-track**: The entire Card Play Track
      - card-play-track values: The actual values that will be used to create the Card Play Track.  See 'Supported Presence Track Options'
	  - banner: Artwork behind the presence track can be added with the banner="example.png". The artwork should be in the same folder as the html
	  - banner-v-scale: Allows you to stretch your banner artwork vertically
	  - Example: *\<card-play-track banner="example2.png" banner-v-scale="50%" values="1,star,gain-card-pay-2,isolate,markerplus,fire+markerplus,5+reclaim-one,fire+reclaim-one"\>\</card-play-track\>
    - **special presence track options (Finder/Serpent)**: For Serpent/Finder style boards, there are two options:
	  - Wrap your presence node options in middle() to have them appear in the middle of the tracks. Only do this to energy track nodes.
	    - Example: *\<energy-track values="1,fire,any,reclaim-one,***middle(earth)***,6,any,12"\>\</energy-track\>*
	  - HTML \<presence-table\> as seen in the Finder example board HTML.
	    - An html table that allows more flexible positioning of nodes. Individual presence track options are specified within the `<td>` table cells. Use <td middle> in energy track to mark presence track spots you want to appear in the middle. The available options are exactly the same as described for the energy and card-play tracks above, with the exception that integer values must be prefixed with with 'card' or 'energy'. For example 'card1' means 1 card play, 'energy2' means 2 energy, etc.

#### Supported Presence Track Options
<details>
  <summary>Expand for Supported Presence Track Options</summary>

|Presence Track Effect|Usage|Details|Examples|
|------|------|------|----|
|Energy/Turn or Card Plays|Integer 1,2,3,4,5,6,7 etc.|Number will become Energy/Turn in energy track and Card Plays in the card play track|River cardplay track: values="1,2,2,3,reclaim-one,4,5"|
||For Energy, +1,-2,+3 etc.|Will modify energy gain instead of flat energy gain (think Finder)|Finder 'top row' values="0,sun,2+water,+2,+1+any"|
|Elements|sun,moon,fire,air,water,earth,plant,animal|Can be used in combinations|Thunderspeaker energy track: values="1,air,2,fire,sun,3"|
||any, star|'any' is any element, 'star' is the Element icon from Starlight||
|Element Markers|markerplus, markerminus|Gain or pay element markers|Shifting Memory energy track: values="0,1,2,3+markerplus,4,reclaim-one,5,6+markerplus"<br>Shifting Memory energy track: values="1,2,2,markerminus+markerminus+gain-card-play,3"|
|Reclaim One|reclaim-one|Reclaim one card, can be used in combinations||
|Combinations|separate with a '+'|Can include energy, cardplays, markers, move-presence, gain-range, reclaim one, and custom. Can be more than 2 things.|Stone's cardplay track: values="1,earth,earth,earth+reclaim-one,earth+any,2+earth"|
|Push/Gather|push(x), gather(x)|Push or Gather x from/into one of your Lands. x can be most token/entities (explorer, wilds, presence, etc).|Trickster's cardplay track: values="2,push(dahan),3,3,4,air,5"|
||push(x;y)|Push x or y from one of your Lands. Could do z but its not recommended|Finder's bottom track push(town;city)|
|Isolate|isolate|Isolate one of your Lands.|Custom cardplay track: values="1,2,isolate,3,3,4,5"|
|Move a Presence|move-presence(x)|Move a presence x range, can be used in combinations.|Downpour cardplay track: values="1,move-presence(1),water,2,move-presence(1),3"|
|Pay 2 to Gain Power Card|gain-card-pay-2|Pay 2 Energy to Gain Power Card|Many Minds cardplay track: values="1,2,gain-card-pay-2,3,3,4,5"|
|Gain Card Play|gain-card-play|Gain an additional card play not in the normal way (think Stone or Finder)|Stone energy track: values="2,3,gain-card-play^minor,4,gain-card-play^minor,6,gain-card-play^minor"|
|Gain Range|gain-range(x)|Gain +x range||
||gain-range(x;y)|Gain +x range on "y"|range(1,everything)|
|Add Token|token(x)|Adds 1 token x to 1 of your lands||
|Notate with Icon (like Stone)|^x|Puts icon x in top left corner of presence node|Stone top row: values="2,3,gain-card-play^minor,4,gain-card-play^minor,6,gain-card-play^minor"|
|Forget Power|forget-power-card|Forget a power card. Unlikely to be useful because presence track actions are optional|Custom energy track: values="1,3+forget-power-card,5+forget-power-card,7+forget-power-card"|
|Custom|custom(*your_text*)|Add custom text to the presence node. Image will be !!!.|Custom energy track: values="1,2,custom(Draw 1 Minor Power),3,water,4"|
||custom(*your_text*;x)|Add custom text to the presence node. x is the icon (for example, city). Note the semicolon.|Custom energy track: values="1,2,custom(Draw 1 Minor Power;city),3,water,4"|

</details>

### Innate Powers
  - **innate-powers**: The container for the Innate Powers
    - quick-innate-power: The container for a single Innate Power. Don't change this heading. Power speed is set below.
      - name: The name of the Innate Power
      - speed: Either "fast" or "slow"
      - range: The range of the innate. Uses special syntax:
        - For no range (such as Spirit targeting powers), type "none".
        - For range, use an icon (if needed) + an integer separated by a comma. Examples:
          - 0
          - 1
          - sacred-site,2
          - wetland-presence,1
      - target: The target of the innate. Unlike range, this uses the same HTML code as the rest of the template, so you can use any icons and the shorthand syntax (ie. {dahan}).
      - target-title: Either "TARGET" or "TARGET LAND"
      - note: allows adding notes to the top of the innate (See Volcano Looming High or Lure of the Deep Wilderness as an example). This may not appear in your version, so simply add it (see example spirits).
      - level: Contains the information for one level of an Innate Power
        - threshold: Contains the threshold informatioin. Can include:
          - Elements: 1-plant,2-fire
		  - Icons: 2-wilds
		  - Energy Costs: cost-2
		    - Example: Volcano: *\<level threshold="3-fire,cost-2"\>* or Many Minds: *\<level threshold="1-air,2-animal,2-beasts"\>*
		  - Other Cost w/ custom icon: cost(custom1)-1 or cost(dahan)-2. Icon will appear with '-x' where x is the number you use.
			- Example: Spreading Rot: *\<level threshold="2-moon,3-water,2-animal,2-cost(custom1)"\>Add 1 {disease}.\<\/level\>*
		  - Or: or
		    - Example: Trickster: *\<level threshold="3-sun,OR,3-fire"\>*
		- long: if you add 'long' to the level tag, it will allow the description to spill over into the next column (like Volcano)
		  - Example: *\<level threshold="5-fire,3-air,5-earth,10-destroyed-presence" ***long***\>*
        - The actual text for the level sits between the level tag
		  - Example: River's first level innate: *\<level threshold="1-sun,2-water"\>Push 1 {explorer} \/ {town}.\<\/level\>*
        - To achieve 'for each element' effects, use the notation {element, #}.
		  - Example: Serpent's Second Innate, Second Level: *\<level threshold="2-moon,2-earth"\>For each ***{moon,2} {earth,2}***, 2 {fear} and push 1 {town}.\<\/level\>*
