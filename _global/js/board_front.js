
window.onload = function startMain(){
    parseGrowthTags();
    if(document.getElementById("presence-table")) {
        enhancePresenceTracksTable();
    } else {        
        setNewEnergyCardPlayTracks(parseEnergyTrackTags(), parseCardPlayTrackTags());
    }
    parseInnatePowers();
    const board = document.querySelectorAll('board')[0];
    var html = board.innerHTML;
    board.innerHTML = replaceIcon(html);
	
	setTimeout(() => {dynamicCellWidth()}, 200);
	dynamicSpecialRuleHeight(board)
    addImages(board)


}

function dynamicSpecialRuleHeight(board){
    const specialRules = board.querySelectorAll('special-rules-container')[0]
    let height = specialRules.getAttribute('height')

    if(!height){
        const computedStyle = window.getComputedStyle(specialRules)
        height = computedStyle.getPropertyValue('height')
    }


    const spiritName = board.querySelectorAll('spirit-name')[0]
    if(specialRules){
        specialRules.style.top = `calc(100% - ${height})`
        specialRules.style.height = height
    }
    if(spiritName){
        spiritName.style.top = `calc(100% - ${height})`
    }
}

function addImages(board) {

    const spiritImage = board.getAttribute('spirit-image');
	const artistCredit = document.getElementsByTagName('artist-name');
    const spiritBorder = board.getAttribute('spirit-border');
    
    const imageSize = board.getAttribute('spirit-image-scale');

    
    const specialRules = board.querySelectorAll('special-rules-container')[0]
    let height = specialRules.getAttribute('height')
        if(!height){
        const computedStyle = window.getComputedStyle(specialRules)
        height = computedStyle.getPropertyValue('height')
    }
    
    if(spiritBorder){
        const specialRules = board.querySelectorAll('special-rules-container')[0]
        specialRules.innerHTML = `<div class="spirit-border" style="background-image: url(${spiritBorder});" ></div>` + specialRules.innerHTML
    }
    if(spiritImage){
        //Image now scales to fill gap. 'imageSize' allows the user to specify what % of the gap to cover
        board.innerHTML = `<div class="spirit-image" style="background-image: url(${spiritImage}); background-size: auto ${imageSize}; height:calc(100% - ${height}); width:1700px;" ></div>` + board.innerHTML
		artistCredit[0].style.display = "block";
		artistCredit[0].innerHTML = "Artist Credit: "+ artistCredit[0].innerHTML
    }
	
	//Add Meeple
	const spiritName = document.getElementsByTagName('spirit-name');
	spiritName[0].outerHTML += "<custom-meeple></custom-meeple>";
	
}

function parseGrowthTags(){
    var fullHTML = "";
    var growthHTML = document.getElementsByTagName("growth");
    
    var growthTitle = "<section-title>"+growthHTML[0].title+"</section-title>";

    const subList = Array.from(growthHTML[0].getElementsByTagName('sub-growth'))
    let subTitle = subList
        .map(e => `<sub-section-title><sub-section-line></sub-section-line><span>${e.title}</span><sub-section-line></sub-section-line></sub-section-title>`).join('')



    var newGrowthTableTagOpen = "<growth-table>";
    var newGrowthTableTagClose = "</growth-table>";

    //Find values between parenthesis
    var regExp = /\(([^)]+)\)/;
    var newGrowthCellHTML = "";
    let currentHeaderIndex = 0

    for (let i = 0; i < growthHTML[0].children.length; i++) {
        const childElement = growthHTML[0].children[i];
        const previousElement = i > 0
            ? growthHTML[0].children[i - 1]
            : undefined
        const nextElement = i < growthHTML[0].children.length - 1
            ? growthHTML[0].children[i + 1]
            : undefined

        //childElement is the thing that should be replaced when all is said and done
        if (childElement.nodeName.toLowerCase() == 'sub-growth') {
            if (childElement.getAttribute('bordered') !== undefined && previousElement && (previousElement.nodeName.toLowerCase() != 'sub-growth' || previousElement.getAttribute('bordered') == !undefined)) {
                newGrowthCellHTML += "<growth-border double></growth-border>";
            }

            for (let j = 0; j < childElement.children.length; j++) {
                const nextSubElement = j < childElement.children.length - 1
                    ? childElement.children[j + 1]
                    : undefined
                
                writeGrowthNode(childElement.children[j], nextSubElement, childElement.title ? currentHeaderIndex : undefined);
            }
            if (childElement.title) {
                currentHeaderIndex++
            }
            
            if (childElement.getAttribute('bordered') !== undefined && nextElement) {
                newGrowthCellHTML += "<growth-border double></growth-border>";
            }

        } else {
            
            writeGrowthNode(childElement, nextElement);
        }

    }
    fullHTML += growthTitle + subTitle + newGrowthTableTagOpen + newGrowthCellHTML + newGrowthTableTagClose

    document.getElementsByTagName("growth")[0].removeAttribute("title");
    document.getElementsByTagName("growth")[0].innerHTML = fullHTML;

    function writeGrowthNode(childElement, nextElement, headerIndex) {
        const cost = childElement.getAttribute("cost");
        if (cost) {
            newGrowthCellHTML += `<growth-cost>-${cost}</growth-cost>`;
        }
		
		const tint = childElement.getAttribute("tint");
		let tint_text = ""
		if (tint) {
			tint_text += "<div class='tint' style='background-color:"+tint+";'></div>"
		}
		
        const growthClass = childElement.getAttribute("values");
        const classPieces = growthClass.split(';');
        const openTag = headerIndex !== undefined
            ? `<growth-cell header="${headerIndex}">`
            : "<growth-cell>"
        const closeTag = tint_text + '</growth-cell>'
		const terrains = new Set(['wetland', 'mountain', 'sand', 'jungle'])
					
        for (j = 0; j < classPieces.length; j++) {
			//Find if a growth effect is repeated (Fractured Days)
			repeatOpen = ""
			repeatClose = ""
			if(classPieces[j].split("^")[1]){
				console.log("repeat detected")
				const repeat = classPieces[j].split("^")[1];
				repeatOpen = "<repeat-growth><value>"+repeat+"</value></repeat-growth>"
				repeatClose = ""
			}
			
            //Find a parenthesis and split out the string before it
			const growthItem = classPieces[j].split("(")[0].split("^")[0];
			
            switch (growthItem) {
				// Simple growth items are handled in the 'Default' case. See function IconName.
				// Only growth items with options are handled here.
				case 'reclaim': {
					const matches = regExp.exec(classPieces[j])
					let reclaimIcon = growthItem+"-all";
					let reclaimText = IconName(growthItem+"-all");
					if (matches){
						let reclaimOptions = matches[1].split(",");
						let reclaimType = reclaimOptions[0];
						let reclaimCustomText = reclaimOptions[1];
						switch(reclaimType)
						{
							case 'all':
								break;
							case 'one':
								reclaimIcon = growthItem+"-"+reclaimType
								reclaimText = IconName(growthItem+"-"+reclaimType)
								break;
							case 'none':
								reclaimIcon = growthItem+"-"+reclaimType
								reclaimText = IconName(growthItem+"-"+reclaimType)
								break;
							case 'custom':
								reclaimIcon = growthItem+"-"+reclaimType
								reclaimText = "Reclaim " + reclaimCustomText
								break;
							default:
								reclaimText = "TEXT NOT RECOGNIZED - use 'all','one',or 'custom'";
						}
					}
					newGrowthCellHTML += `${openTag}${repeatOpen}{`+reclaimIcon+`}<growth-text>`+reclaimText+`</growth-text>${repeatClose}${closeTag}`
					break;
				}
				case 'isolate': {
                        const matches = regExp.exec(classPieces[j])
						let isolateIcons = "{isolate}"
						let isolateText = "Isolate 1 of Your Lands"
						let isolateReqOpen = "";
						let isolateReqClose = "";
						if (matches){
							let isolateOptions = matches[1].split(",");
							let isolateRange = isolateOptions[0];
							isolateReqOpen = "<custom-icon>";
							isolateReqClose = "</custom-icon>";
							isolateIcons += "{range-" + isolateRange + "}";
							isolateText = "Isolate a Land";
						}
						newGrowthCellHTML += `${openTag}${repeatOpen}` + isolateReqOpen + isolateIcons + isolateReqClose + `<growth-text>`+isolateText+`</growth-text>${repeatClose}${closeTag}`;
                        break;
				}
                case 'damage': {
					const matches = regExp.exec(classPieces[j]);
					let damageOptions = matches[1].split(",");
					let range = damageOptions[0];
					let damage = damageOptions[1];
                    let damageManyIconOpen = "" 
					let damageManyIconClose = ""
					damageGrowthIcons = "<growth-damage><value>" + damage + "</value></growth-damage>"
					damageGrowthText = "Deal "+damage+" Damage at Range " + range
					newGrowthCellHTML += `${openTag}${repeatOpen}` + "<custom-icon><growth-damage><value>" + damage + "</value></growth-damage>"+ "{range-" + range + "}</custom-icon>" + `<growth-text>`+damageGrowthText+`</growth-text>${repeatClose}${closeTag}`;
					break;
				}
				case 'gain-energy': {
					const matches = regExp.exec(classPieces[j]);

					const gainEnergyBy = matches[1];
					let energyOptions = matches[1].split(",");
                    let energyManyIconOpen = "" 
					let energyManyIconClose = ""
					if (isNaN(energyOptions[0]) || energyOptions.length!=1) {
							energyManyIconOpen = "<growth-cell-double>"
							energyManyIconClose = "</growth-cell-double>"
					}
					let energyGrowthIcons = ""
					let energyGrowthText = ""
					if (!isNaN(energyOptions[0])) {
                        //Gain Energy has a number first
						let flatEnergy = energyOptions[0];
						energyGrowthIcons = "<growth-energy><value>" + flatEnergy + "</value></growth-energy>"
						if (energyOptions.length>1){
							// Flat energy + scaling
							scaling = energyOptions[1];
							energyGrowthIcons += "<gain-per><value>1</value></gain-per>"
							energyGrowthText = "Gain "+flatEnergy+" Energy and +1 Energy per "
							if (scaling==='text'){
								//determine some arbitrary scaling rule
								scaling_text = energyOptions[2] !== undefined ? energyOptions[2] : 'ENTER SCALING TEXT AS THIRD PARAMETER';
								let customScalingIcon = energyOptions[3] !== undefined ? ("<icon class='" + energyOptions[3] + "'></icon>") : "<div class='custom-scaling'>!!!</div>"
								energyGrowthIcons += "<gain-per-element><ring-icon>"+customScalingIcon+"</ring-icon></gain-per-element>";
								energyGrowthText += scaling_text
							}else{
								energyGrowthIcons += "<gain-per-element><ring-icon><icon class='" + scaling + "'></icon></ring-icon></gain-per-element>"
								energyGrowthText += Capitalise(scaling)
							}
						}else{
							// Flat energy
							energyGrowthText = "Gain Energy"								
						}
                    } else {
                        // Scaling
						scaling = energyOptions[0];						
						if (scaling==='text'){
							//determine some arbitrary scaling rule
							scaling_text = energyOptions[1] !== undefined ? energyOptions[1] : 'ENTER SCALING TEXT AS SECOND PARAMETER';
							let customScalingIcon = energyOptions[2] !== undefined ? ("<icon class='" + energyOptions[2] + "'></icon>") : "<div class='custom-scaling'>!!!</div>"
							energyGrowthIcons += "<gain-per><value>1</value></gain-per><gain-per-element><ring-icon>"+customScalingIcon+"</ring-icon></gain-per-element>";
							energyGrowthText = "Gain 1 Energy per " + scaling_text								
						}else{
							energyGrowthIcons = "<gain-per><value>1</value></gain-per><gain-per-element><ring-icon><icon class='" + scaling + "'></icon></ring-icon></gain-per-element>"
							energyGrowthText = "Gain 1 Energy per " + Capitalise(scaling)
						}
                    }
					newGrowthCellHTML += `${openTag}${repeatOpen}` + energyManyIconOpen + energyGrowthIcons + energyManyIconClose + "<growth-text>" + energyGrowthText +"</growth-text>"+ `${repeatClose}${closeTag}`
					break;
				}
				case 'add-presence': {
                    const matches = regExp.exec(classPieces[j]);

                    let presenceOptions = matches[1].split(",");
                    let presenceRange = presenceOptions[0];
                    let presenceReqOpen = "<custom-presence>";
                    let presenceReqClose = "</custom-presence>";
                    let presenceReq = "none";
                    let presenceText = "";
                    let presenceIcon = "";
                    let presenceTextLead = "";
                    let presenceTextEnd = "";

					if (presenceRange=='any' && presenceOptions.length==1) {

						presenceReqOpen = "<custom-presence-no-range>";
						presenceReqClose = "</custom-presence-no-range>";
						presenceText = " to any Land"
					} else if (presenceOptions.length > 1) {
                        presenceReqOpen = "<custom-presence-req>";
                        presenceReqClose = "</custom-presence-req>";
                        presenceIcon += "<presence-req>";
                        
						if (presenceRange=='any'){
							presenceReqOpen += "<presence-req></presence-req>"
						}
						
                        if(presenceOptions[1]=='text'){
                            // User wants a custom text presence addition
                            presenceIcon += "<span style='font-family: DK Snemand; font-size: 24pt; font-style: normal;'>!!!</span>";
							presenceText += " "+presenceOptions[2];
                        } else if (presenceOptions[1]=='token'){
                            // User wants to add a token in growth
                            switch (presenceOptions[3]){
                                    case 'and':
                                        //add presence and token
                                        presenceIcon += "<span class='plus-text'>+ </span>";
                                        presenceIcon += "{"+presenceOptions[2]+"}";
                                        presenceText += " and a " + Capitalise(presenceOptions[2]);
                                        break;
                                    case 'or':
                                        //add presence or token
                                        presenceIcon += "<span class='plus-text'>or </span>";
                                        presenceIcon += "{"+presenceOptions[2]+"}";
                                        presenceText += " or a " + Capitalise(presenceOptions[2]);
                                    case 'instead':
                                        //no option to add presence, just token
                            }
                        } else {
                            // User wants an OR or an AND requirement
                            let operator = "";
                            if (presenceOptions.length > 4) {
                                operator = "/";
                            }else{
                                operator = " "+presenceOptions.at(-1)+" ";
                            }
                            
                            presenceText += " to ";
							presenceText += presenceRange === 'any' ? 'any ' : '';
							
                            let flag = 0; // This flag is used to figure out if 'land with' has been said already. It comes up with add-presence(3,jungle,beasts,or)
							let and_flag = 0;
                            for (var i = 1; i < presenceOptions.length; i++) {
                                
                                // Check to see if we've reached an 'or', which shouldn't be parsed
                                presenceReq = presenceOptions[i];
                                if (presenceReq === 'or' || presenceReq === 'and') {
                                    break;
                                }
                                
                                // Icons
                                switch (presenceReq){
                                    case 'inland':
                                    case 'coastal':
                                    case 'invaders':
                                        presenceIcon += presenceOptions.length < 3
                                            ? "<span class='non-icon'>"+presenceReq.toUpperCase()+"</span><icon style='height:50px; width:0px;'></icon>" // This do-nothing Icon just creates 50px of height to make everything line up. Other ideas?
                                            : "<span class='non-icon small'>"+presenceReq.toUpperCase()+"</span><icon style='height:50px; width:0px;'></icon>"
                                        break;
                                    case 'no-own-presence':
										presenceIcon += "{no-presence}";
										break;
                                    default:
                                        presenceIcon += "{"+presenceReq+"}";
                                }

                                if (i < presenceOptions.length - 2) {
                                    presenceIcon += operator;
                                }
                                
                                // Text
                                multiLandCheck = presenceReq.split("-");
                                if (terrains.has(multiLandCheck[1])){
                                    multiLandText = Capitalise(multiLandCheck[0]) + " or " + Capitalise(multiLandCheck[1]);
                                    presenceReq = 'multiland';
                                }
                                
                                presenceTextLead = "";
                                presenceTextEnd = "";
                                
                                switch (presenceReq){
                                    case 'sand':
                                    case 'mountain':
                                    case 'wetland':
                                    case 'jungle':
                                    case 'ocean':
                                        presenceText += i != 1 ? operator : "";
                                        presenceText += Capitalise(presenceReq);
										and_flag = 1;
                                        break;
                                    case 'inland':
                                    case 'coastal':
                                        presenceText += i != 1 ? operator : "";
                                        presenceText += Capitalise(presenceReq) + " land";
                                        break;
                                    case 'multiland':
                                        presenceText += multiLandText;
										and_flag = 1;
                                        break;
                                    case 'no-blight':
										if(i == 1){
											presenceText += " Land without "
										}else{
											presenceText += operator == ' and ' ? " and no " : " or no ";
										}
                                        presenceText += "Blight";
                                        break;
                                    case 'beast':
                                        presenceTextEnd = "s"
                                    case 'no-own-presence':
										if(i == 1){
											presenceText += " Land without "
										}else{
											presenceText += operator == ' and ' ? " and no " : " or no ";
										}
                                        presenceText += "Your Presence";
                                        break;
									case 'presence':
                                        presenceTextLead += presenceTextEnd==="" ? "Your " : "";
                                        //Intentionally do not break.
                                    default:
                                        if (flag == 0 && i != 1 && operator != ' and ') {
                                            presenceText += operator+"Land with ";
                                        }else if(flag == 0 && operator != ' and '){
                                            presenceText += " Land with ";
                                        }else{
											if(operator === ' and ' && flag !== 1){
												presenceText += (and_flag===1) ? ' with ' : ' Land with ';
											}else{
												presenceText += operator;
											}
                                        }
                                        flag = 1;
                                        presenceText += presenceTextLead + Capitalise(presenceReq) + presenceTextEnd;
                                }
                            }                            
                        }
                        presenceIcon += "</presence-req>";
					}

                    newGrowthCellHTML += `${openTag}${repeatOpen}` + presenceReqOpen + "+{presence}" + presenceIcon + "{range-" + presenceRange + "}" + presenceReqClose + "<growth-text>Add a Presence" + presenceText + `</growth-text>${repeatClose}${closeTag}`
                    break;
                }
                case 'push':
                case 'gather': {
					const matches = regExp.exec(classPieces[j]);
					
					let preposition = growthItem=='push'
						? 'from'
						: 'into'
					
					let moveText = ""
					let moveIcons = `${openTag}${repeatOpen}`
					let moveTarget = matches[1];
					let moveOptions = matches[1].split(",");
					let moveRange = moveOptions[1];
					let moveNum = moveOptions[2];
					let plural = "";
					if(!moveNum){
						moveNum = 1;
					}else if(isNaN(moveNum)){
						moveNum = moveNum.toUpperCase();
					}else{
						plural = moveNum > 1 ? "s" : "";
					}
					if(moveRange){
						moveTarget = moveOptions[0];
						if(isNaN(moveRange)){
							let moveCondition = moveRange;
							// Gather/Push into/from a sacred site, land with token, or terrain
							
							// Text
							moveText += "<growth-text>"+Capitalise(growthItem)+" 1 " + Capitalise(moveTarget) +" "+ preposition + " " + moveNum;
							switch (moveCondition){
								case 'sacred-site':
									moveText += " of your Sacred Sites"
									moveIcons += "<push-gather><icon class='" + growthItem + "-" + preposition + "'><icon class='" + moveTarget + "'></icon><icon class='" + preposition + " " + moveCondition + "'></icon></icon></push-gather>"
									break;
								case 'wetland':
								case 'sand':
								case 'mountain':
								case 'jungle':
								case 'jungle-wetland':
								case 'jungle-sand':
								case 'jungle-mountain':
								case 'sand-wetland':
								case 'mountain-wetland':
								case 'mountain-sand':
								case 'mountain-jungle':
								case 'sand-jungle':
								case 'sand-mountain':
								case 'wetland-jugnle':
								case 'wetland-mountain':
								case 'wetland-sand':
								case 'ocean':
									moveIcons += "<push-gather><icon class='" + moveCondition + " terrain-"+growthItem+"'>{"+growthItem+"-arrow}<icon class='" + moveTarget + " "+preposition+"'></icon></icon></push-gather>"
									moveText += " " + Capitalise(moveCondition) + plural
									break;
								default:
									moveText += " of your Lands with " + Capitalise(moveCondition)
									moveIcons += "<push-gather><icon class='" + growthItem + "-" + preposition + "'><icon class='" + moveTarget + "'></icon><icon class='" + preposition + " " + moveCondition + "'></icon></icon></push-gather>"
							}
							moveText += `</growth-text>${repeatClose}${closeTag}`
						}else{
						// Gather/Push at range
							moveIcons += "<push-gather-range-req><icon class='" + growthItem + "'><icon class='" + moveTarget + "'></icon></icon>"+"{range-" + moveRange + "}</push-gather-range-req>"
							moveText += "<growth-text>"+Capitalise(growthItem)+" up to 1 " + Capitalise(moveTarget)+" " + preposition + ` a Land</growth-text>${repeatClose}${closeTag}`
						}
					}else{
						moveIcons += "<push-gather><icon class='" + growthItem + "'><icon class='" + moveTarget + "'></icon></icon></push-gather>"
						moveText += "<growth-text>"+Capitalise(growthItem)+" 1 " + Capitalise(moveTarget)+" " + preposition + ` 1 of your Lands</growth-text>${repeatClose}${closeTag}`
					}
					newGrowthCellHTML += moveIcons + moveText;
					break;
				}
                case 'presence-no-range': {
					//This is potentially redundant.
					newGrowthCellHTML += `${openTag}${repeatOpen}<custom-presence-no-range>+{presence}</custom-presence-no-range><growth-text>Add a Presence to any Land</growth-text>${repeatClose}${closeTag}`
					break;
				}
                case 'move-presence': {        
					//Additional things can be done here based on inputs
					const matches = regExp.exec(classPieces[j]);

					const moveRange = matches[1];
					newGrowthCellHTML += `${openTag}${repeatOpen}<custom-presence>{presence}{move-range-` + moveRange + `}</custom-presence><growth-text>Move a Presence</growth-text>${repeatClose}${closeTag}`

					break;
				}
                case 'gain-element': {
					const matches = regExp.exec(classPieces[j]);

					const gainedElement = matches[1];

					const elementOptions = matches[1].split(",");

					//Check if they want 2 elements (multiple of the same element, and OR between multiple elements are implemented. AND is not)
					if (elementOptions.length > 1) {
						
						//Check if they want multiples of the same element or a choice of elements by looking for a numeral
						if (isNaN(elementOptions[1]) && elementOptions.at(-1) !== 'and') {
							//No numeral - user wants different elements. For example gain-element(water,fire)
							if (elementOptions.at(-1) === 'or' || elementOptions.at(-1) === 'and'){}
					
							//Icons
							newGrowthCellHTML += `${openTag}${repeatOpen}<gain class='or'>`
							for (var i = 0; i < elementOptions.length; i++) {
								newGrowthCellHTML += "<icon class='orelement " + elementOptions[i] + "'></icon>";
								if (i < elementOptions.length - 1) {
									newGrowthCellHTML += "{backslash}";
								}
							}
							//Text
							newGrowthCellHTML += "</gain><growth-text>Gain ";
							for (var i = 0; i < elementOptions.length; i++) {
								newGrowthCellHTML += IconName(elementOptions[i]);
								if (i < elementOptions.length-2) {
									newGrowthCellHTML += ", ";
								} else if (i == elementOptions.length-2) {
									newGrowthCellHTML += " or ";
								}
							}
							newGrowthCellHTML += `</growth-text>${repeatClose}${closeTag}`;
								
						} else { 
							// Gain multiple of the same element or gain multiple different elements (all of them, not or)

							let numLocs                                
							// Text
							let elementText = "";
							if (elementOptions.at(-1) == 'and'){
								// gain multiple different elements
								numLocs = elementOptions.length - 1;
								for (var i = 0; i < numLocs; i++) {
									elementText += IconName(elementOptions[i]);
									if (i < numLocs-2) {
										elementText += ", ";
									} else if (i == numLocs-2) {
										elementText += " and ";
									}
								}
							} else {
								// gain multiple of the same element
								numLocs = elementOptions[1];
								elementText = elementOptions[1] +" "+ IconName(elementOptions[0]);
							}
							
							// Icons
							let rad_size = 20 + 5*(numLocs-2); // this expands slightly as more icons are used
							var elementIcons = ""
							for (var i = 0; i < numLocs; i++) {
								pos_angle = i * 2*Math.PI / numLocs - (Math.PI)*(1-(1/6));
								x_loc = rad_size * Math.cos(pos_angle) - 30;
								y_loc = rad_size * Math.sin(pos_angle) - 20;
								let element_loc = "style='transform: translateY("+y_loc+"px) translateX("+x_loc+"px)'";
								let cur_element = elementOptions.at(-1) === 'and'
									? elementOptions[i]
									: elementOptions[0]
								elementIcons += "<icon-multi-element><icon class='"+cur_element+"'"+element_loc+"></icon></icon-multi-element>"
							}
							elementIcons += "<icon style='width:0px;height:99px'></icon>"; // This is a filler icon to make sure the spacing is right. Any idea for a better solution?
							
							newGrowthCellHTML += `${openTag}${repeatOpen}<gain>` + elementIcons + "</gain><growth-text>Gain "+elementText+`</growth-text>${repeatClose}${closeTag}`;
						}
								
					} else {
						let elementText = ""
						elementText = gainedElement==='star' ? 'Element' : IconName(gainedElement)
						newGrowthCellHTML += `${openTag}${repeatOpen}<gain>{` + gainedElement + "}</gain><growth-text>Gain " + elementText + `</growth-text>${repeatClose}${closeTag}`
					}
					break;
				}
                case 'custom': {
					const matches = regExp.exec(classPieces[j]);
					let customOptions = matches[1].split(",");
					customIcon = customOptions[1];
					customText = customOptions[0];
					if (customIcon){
						customIcon = "<icon class='"+customIcon+" custom-growth-icon'></icon>";
					}else{
						customIcon = "<div class='custom-scaling'>!!!</div>";
					}
					newGrowthCellHTML += `${openTag}${repeatOpen}<custom-growth-icon>`  + customIcon + `</custom-growth-icon><growth-text>`+customText+`</growth-text>${repeatClose}${closeTag}`;
					break;
				}
				case 'fear': {
					const matches = regExp.exec(classPieces[j]);

					let fearOptions = matches[1].split(",");
                    let fearManyIconOpen = "" 
					let fearManyIconClose = ""
					if (isNaN(fearOptions[0]) || fearOptions.length!=1) {
							fearManyIconOpen = "<growth-cell-double>"
							fearManyIconClose = "</growth-cell-double>"
					}
					let fearGrowthIcons = ""
					let fearGrowthText = ""
					if (!isNaN(fearOptions[0])) {
                        //Generate Fear has a number first
						let flatFear = fearOptions[0];
						fearGrowthIcons = "<growth-fear><value>" + flatFear + "</value></growth-fear>"
						if (fearOptions.length>1){
							// Flat fear + scaling
							scaling = fearOptions[1];
							fearGrowthIcons += "<fear-per><value>1</value></fear-per>"
							fearGrowthText = "Generate "+flatFear+" Fear and +1 Fear per "
							if (scaling==='text'){
								//determine some arbitrary scaling rule
								scaling_text = fearOptions[2] !== undefined ? fearOptions[2] : 'ENTER SCALING TEXT AS THIRD PARAMETER';
								fearGrowthIcons += "<gain-per-fear><ring-icon><div class='custom-scaling'>!!!</div></ring-icon></gain-per-fear>";
								fearGrowthText += scaling_text								
							}else{
								fearGrowthIcons += "<gain-per-fear><ring-icon><icon class='" + scaling + "'></icon></ring-icon></gain-per-fear>"
								fearGrowthText += Capitalise(scaling)
							}
						}else{
							// Flat fear
							fearGrowthText = "Generate Fear"								
						}
                    } else {
                        // Scaling
						scaling = fearOptions[0];						
						if (scaling==='text'){
							//determine some arbitrary scaling rule
							scaling_text = fearOptions[1] !== undefined ? fearOptions[1] : 'ENTER SCALING TEXT AS SECOND PARAMETER';
							fearGrowthIcons += "<fear-per><value>1</value></fear-per><gain-per-fear><ring-icon><div class='custom-scaling'>!!!</div></ring-icon></gain-per-fear>";
							fearGrowthText = "Generate 1 Fear per " + scaling_text								
						}else{
							fearGrowthIcons = "<fear-per><value>1</value></fear-per><gain-per-fear><ring-icon><icon class='" + scaling + "'></icon></ring-icon></gain-per-fear>"
							fearGrowthText = "Generate 1 Fear per " + Capitalise(scaling)
						}
                    }
					newGrowthCellHTML += `${openTag}${repeatOpen}` + fearManyIconOpen + fearGrowthIcons + fearManyIconClose + "<growth-text>" + fearGrowthText +"</growth-text>"+ `${repeatClose}${closeTag}`
					break;
				}
				case 'gain-range': {
					const matches = regExp.exec(classPieces[j]);
					let rangeOptions = matches[1].split(",");
					let range = rangeOptions[0];
					let type = rangeOptions[1];
					let gainRangeText = ""
					if (type) {
						switch (type) {
							case 'powers':
							case 'power':
								gainRangeText = "Your Powers gain +"+range+" Range this turn"
								break;
							case 'power cards':
								gainRangeText = "Your Power Cards gain +"+range+" Range this turn"
								break;
							case 'everything':
								gainRangeText = "+"+range+" Range on everything this turn"
								break;
							case 'innate':
							case 'innate power':
							case 'innate powers':
								gainRangeText = "Your Innate Powers gain +"+range+" Range this turn"
								break;
							default:
								gainRangeText = "Your Powers gain +"+range+" Range this turn"
						}
					} else {
						gainRangeText = "Your Powers gain +"+range+" Range this turn"
					}
					newGrowthCellHTML += `${openTag}${repeatOpen}{gain-range-` + range +`}<growth-text>`+gainRangeText+`</growth-text>${repeatClose}${closeTag}`;

					break;
				}
				case 'gain-card-play': {
					const matches = regExp.exec(classPieces[j]);
					
					if(matches){
						let cardplayOptions = matches[1].split(",");
						num_card_plays = cardplayOptions[0];
						plural = num_card_plays > 1 ? "s" : "";
						newGrowthCellHTML += `${openTag}${repeatOpen}<card-play-num><value>` + num_card_plays + "</value></card-play-num><growth-text> +"+num_card_plays+" Card Play"+plural+" this turn"+`</growth-text>${repeatClose}${closeTag}`
					}else{
						newGrowthCellHTML += `${openTag}${repeatOpen}{`+growthItem+`}<growth-text>`+IconName(growthItem)+`</growth-text>${repeatClose}${closeTag}`
					}
					break;
				}
				case 'element-marker': {
					const matches = regExp.exec(classPieces[j]);
					
					if(matches){
						let markerOptions = matches[1].split(",");
						num_markers = markerOptions[0];
						marker_type = num_markers > 0 ? 'markerplus' : 'markerminus';
						marker_verb = num_markers > 0 ? 'Prepare' : 'Discard';
						num_markers = Math.abs(num_markers)
						plural = num_markers > 1 ? "s" : "";
						numLocs = num_markers
						let rad_size = 20 + 5*(numLocs-2); // this expands slightly as more icons are used
						var markerIcons = ""
						for (var i = 0; i < numLocs; i++) {
							pos_angle = i * 2*Math.PI / numLocs - (Math.PI)*(1-(1/6));
							x_loc = rad_size * Math.cos(pos_angle) - 30;
							y_loc = rad_size * Math.sin(pos_angle) - 20;
							let marker_loc = "style='transform: translateY("+y_loc+"px) translateX("+x_loc+"px)'";
							markerIcons += "<icon-multi-element><icon class='"+marker_type+"'"+marker_loc+"></icon></icon-multi-element>"
						}
						markerIcons += "<icon style='width:0px;height:99px'></icon>"; // This is a filler icon to make sure the spacing is right. Any idea for a better solution?
						
						newGrowthCellHTML += `${openTag}${repeatOpen}<gain>` + markerIcons + "</gain><growth-text>"+marker_verb+" "+num_markers+" Element Marker"+plural+`</growth-text>${repeatClose}${closeTag}`;
					}else{
						newGrowthCellHTML += `${openTag}${repeatOpen}<gain>{markerplus}</gain><growth-text>Prepare 1 Element Marker</growth-text>${repeatClose}${closeTag}`
					}
					break;
				}
				case 'add-token': {
					const matches = regExp.exec(classPieces[j]);
					let tokenOptions = matches[1].split(",");
					let range = tokenOptions[0];
					let tokenRange = "{range-" + range + "}"
					let token = tokenOptions[1];
					let tokenNum = tokenOptions[2];
					let tokenReqOpen = "<custom-icon>";
					let tokenReqClose = "</custom-icon>";
					let tokenText = ""
					let tokenIcons = ""
					if(!tokenNum){
						tokenIcons = "+<icon class='"+token+" token'></icon>"
						tokenText = "Add a " + Capitalise(token);
					}else if(!isNaN(tokenNum)){
						// multiple of the same token
						tokenIcons += "+"
						if (tokenNum>3){
							tokenIcons += tokenNum+"<icon class='"+token+" token'></icon>";
						}else{
							for (var i = 0; i < tokenNum; i++) {
								tokenIcons += "<icon class='"+token+" token'></icon>"
							}
						}
						tokenText = "Add "+tokenNum+" " + Capitalise(token);
					}else{
						// two or more different tokens
						operator = tokenOptions.at(-1);
						tokenIcons += "+<icon class='"+token+" token'></icon>";
						tokenText += "Add a " + Capitalise(token);
						if (operator=='and' || operator=='or'){
							for (var i = 2; i < tokenOptions.length-1; i++) {
								tokenIcons += operator=='or' ? "/" : "";
								tokenIcons += "<icon class='"+tokenOptions[i]+" token'></icon>"
								tokenText += i==tokenOptions.length-2 ? " "+operator+" " : ", ";
								tokenText += Capitalise(tokenOptions[i]);
							}
						}else{
							tokenText = "MUST use AND or OR"
						}
					}
					newGrowthCellHTML += `${openTag}${repeatOpen}`+ tokenReqOpen + tokenIcons + tokenRange + tokenReqClose + "<growth-text>" + tokenText +`</growth-text>${repeatClose}${closeTag}`
					break;
				}
				default:
					newGrowthCellHTML += `${openTag}${repeatOpen}{`+growthItem+`}<growth-text>`+IconName(growthItem)+`</growth-text>${repeatClose}${closeTag}`

            }
        }

        if (nextElement && nextElement.nodeName.toLowerCase() == 'growth-group') {
            newGrowthCellHTML += headerIndex !== undefined
                ? `<growth-border header="${headerIndex}"></growth-border>`
                : "<growth-border></growth-border>";
        }

    }
}

function parseEnergyTrackTags(){
    
    var energyValues = document.getElementsByTagName("energy-track")[0].getAttribute("values");
    var energyOptions = energyValues.split(",");

    var energyBanner = document.getElementsByTagName("energy-track")[0].getAttribute("banner");
    var energyBannerScale = document.getElementsByTagName("energy-track")[0].getAttribute("banner-v-scale");
    var energyHTML = "";
    
    //Determine the length of the energy track
    //If for some reason the width of a presence track spot changes, this needs to be updated. Ideas for automating?
    let energyLength = energyOptions.length * 130 + 15;
    if(energyBanner){
        energyHTML = "<tr style='background-image:  url("+energyBanner+"); background-size: "+energyLength+"px "+energyBannerScale+"; background-repeat: no-repeat; background-position: left 0px top 20px;'>"
    } else {
        energyHTML = "<tr>";
    }
    
    // This can be scaled to move the first presence icon. 
    energyHTML += "<td style='width:10px'></td>"

    for(i = 0; i < energyOptions.length; i++){
		// option allows for placing presence track icons in the "middle row"
		let nodeText = energyOptions[i];
		let isMiddle = '';
		var regExpOuterParentheses = /\(\s*(.+)\s*\)/;
		if (nodeText.startsWith("middle")){
			nodeText = regExpOuterParentheses.exec(nodeText)[1];
			isMiddle = ' rowspan="2" class="middle"';
		}
        energyHTML += "<td"+isMiddle+">"+getPresenceNodeHtml(nodeText, i == 0, "energy", true)+"</td>";
    }
    energyHTML += "</tr>"
    document.getElementsByTagName("energy-track")[0].removeAttribute("values");
    return energyHTML;
    
}

function parseCardPlayTrackTags(){    
    
    var cardPlayValues = document.getElementsByTagName("card-play-track")[0].getAttribute("values");
    var cardPlayOptions = cardPlayValues.split(",");
    var cardPlayBanner = document.getElementsByTagName("card-play-track")[0].getAttribute("banner");
    var cardPlayBannerScale = document.getElementsByTagName("card-play-track")[0].getAttribute("banner-v-scale");
    if(!cardPlayBannerScale){
        cardPlayBannerScale = "100%"
    }
    var cardPlayHTML = "";
    
    //Determine the length of the energy track
    //If for some reason the width of a presence track spot changes, this needs to be updated. Ideas for automating?
    let cardPlayLength = cardPlayOptions.length * 130 + 15;
    if(cardPlayBanner){
        cardPlayHTML = "<tr style='background-image:  url("+cardPlayBanner+"); background-size: "+cardPlayLength+"px "+cardPlayBannerScale+"; background-repeat: no-repeat; background-position: left 0px top 20px;'>"
    } else {
        cardPlayHTML = "<tr>";
    }
    
    // This can be scaled to move the first presence icon.
    cardPlayHTML += "<td style='width:10px'></td>"

    for(i = 0; i < cardPlayOptions.length; i++){
        cardPlayHTML += "<td>"+getPresenceNodeHtml(cardPlayOptions[i], i == 0, "card", false)+"</td>";
    }
    cardPlayHTML += "</tr>"    
    document.getElementsByTagName("card-play-track")[0].removeAttribute("values");
    return cardPlayHTML;    
}

function enhancePresenceTracksTable() {
    var elmt = document.getElementsByTagName("presence-tracks")[0];
    var title = document.createElement("section-title");
    title.innerHTML = "Presence";    
    elmt.insertBefore(title, elmt.firstChild); 
    console.log('creating dynamic presence tracks...')
    var table = document.getElementById("presence-table");
	table.innerHTML = table.innerHTML.replaceAll('middle=""','rowspan="2" class="middle"')
	console.log(table.innerHTML)
    for (var i = 0, row; row = table.rows[i]; i++) {
       for (var j = 0, cell; cell = row.cells[j]; j++) {
        cell.innerHTML = getPresenceNodeHtml(cell.firstChild.nodeValue, j == 0, 'dynamic', i == 0);
       }  
    }

	// Add spacing row to the front of the table
	var firstRow = table.getElementsByTagName("tr")[0];
	var firstCell = firstRow.getElementsByTagName("td")[0];
	var spacerRow = document.createElement("td");
	spacerRow.style.width = "10px";
	spacerRow.rowSpan = "2";
	firstRow.insertBefore(spacerRow,firstCell);
}

function getPresenceNodeHtml(nodeText, first, trackType, addEnergyRing) {
    var result = '';

    //Find values between parenthesis
    var regExp = /\(([^)]+)\)/;    

    var nodeClass = '';
	
    // Every node will have a presence-node element with
    // a ring-icon element inside, so we can add these now.
    presenceNode = document.createElement("presence-node");    
    ring = document.createElement("ring-icon");
    presenceNode.appendChild(ring);
    // Will be populated with the sub text that will be added at the end
    var subText = '';
    // Will be populated with the raw HTML that will go inside the ring-icon element.
    var inner = "";

	//Allows adding on icon next to the node using ^ (as with Stone)
	let addDeepLayers = false;
	if(nodeText.split("^")[1]){
		iconDeepLayers = nodeText.split("^")[1]
		addDeepLayers = true;
		nodeText = nodeText.split("^")[0]
	}
	
    if(trackType == 'dynamic'){
        if(nodeText.startsWith("energy")) {
            nodeText = nodeText.substr(6);
            nodeClass = 'energy';
            subText = 'Energy/Turn';
        }
		else if(nodeText.startsWith("+energy")){
			nodeText = nodeText.replace('+energy','+');
            nodeClass = 'energy';
            subText = 'Energy/Turn';
		}
        else if(nodeText.startsWith("card")) {
            nodeText = nodeText.substr(4);
            nodeClass = 'card';
            subText = 'Card Plays';
        }
    }
    else if(trackType == 'energy'){
        nodeClass = 'energy';
        subText = 'Energy/Turn';
    }
    else if(trackType == 'card'){
        nodeClass = 'card';
        subText = 'Card Plays';
    }
	
	console.log(nodeText)
	
    addIconShadow = false;
    if(!isNaN(nodeText)){
        //The value is only a number
        addEnergyRing = false;
        if(first === true){
            presenceNode.classList.add("first");
        } else {
            subText = nodeText;
			if(isNaN(nodeText[0])){
				subText += " Energy";
				nodeClass = 'energy';
			}
        }
        inner = "<" + nodeClass + "-icon><value>" + nodeText + "</value></" + nodeClass + "-icon>";
    } else {
        //It is either a single element or a mix of elements/numbers
        var splitOptions = nodeText.split("+");
		
		//This code allows user to include +energy in addition to just energy
		plus_check = splitOptions.indexOf("");
		if(plus_check!=-1){
			splitOptions.splice(plus_check,1)
			splitOptions[plus_check]="+"+splitOptions[plus_check]
			nodeClass = 'energy';
		}
		
        if(splitOptions.length == 1){
            //It's just a single item
            var option = splitOptions[0].split("(")[0];
            switch(option){
				case 'push':
                    var matches = regExp.exec(splitOptions[0]);
                    var moveTarget = matches[1];
					let moveIcons = "<div class='push'>"
					let moveText = "";
					for (var i = 0; i < moveTarget.split(";").length; i++) { 
						moveIcons += "{"+moveTarget.split(";")[i]+"}"
						moveText += Capitalise(moveTarget.split(";")[i]);
						if (i < moveTarget.split(";").length-1){
							moveIcons += "{backslash}";
							moveText += "/";
							
						}
					}
					moveIcons +="</div>"
					let preposition = option =='push' ? 'from' : 'into';
						
                    inner = "<icon class='push'>"+moveIcons+"</icon>";
                    subText = Capitalise(option)+" 1 "+ moveText + " "+preposition+" 1 of your Lands";
                    break;    
                case 'gather':
                    var matches = regExp.exec(splitOptions[0]);
                    var moveTarget = matches[1];
                    inner = "<icon class='gather'><icon class='"+moveTarget+"'></icon></icon>";
                    subText = "Gather 1 "+Capitalise(moveTarget) + " into 1 of your Lands";
                    break;
				case 'custom':
                    var matches = regExp.exec(splitOptions[0]);
                    var custom_node = matches[1].split(";");
					var custom_text = custom_node[0];
					if(custom_node[1]){
						inner = "<icon class='"+custom_node[1]+" custom-presence-track-icon'></icon>";
					}else{
						inner = "<" + nodeClass + "-icon><value>!!!</value></" + nodeClass + "-icon>";
					}
					subText = custom_text
					break;
				case 'move-presence':
                    var matches = regExp.exec(splitOptions[0]);
                    var moveRange = matches[1];
                    inner = "<icon class='move-presence-"+moveRange+"'></icon>";
                    subText = "Move a Presence "+moveRange;
					addEnergyRing = false;
					addIconShadow = true;
                    break;
				case 'gain-range':
                    var matches = regExp.exec(splitOptions[0]);
                    var gainRange = matches[1];
					var custom_node = matches[1].split(";");
                    inner = "<icon class='gain-range-"+custom_node[0]+"'></icon>";
                    subText = IconName(splitOptions[0]);
					
					addEnergyRing = false;
					addIconShadow = true;
                    break;
				case 'gain-card-play':
					var matches = regExp.exec(splitOptions[0]);
					cardplay_text = splitOptions[0]
					if(matches){
						var cardplay_text = matches[1].split(";");
						inner = "<icon class='"+option+" deep-layers'><icon class='"+cardplay_text+"'></icon></icon>";
					}else{
						inner = "<icon class='"+cardplay_text+"'></icon>";
					}
					subText = "+1 Card Play/Turn"
					break;
                default:
                    var iconText = splitOptions[0];
                    inner = "<icon class='"+iconText+"'></icon>";
                    subText = IconName(iconText);
                    break;                
            }            
        } else {
            var subText = ""
            
			// Find unique names and report multiples
			const nameCounts = {};
			splitOptions.forEach(function (x) { nameCounts[x] = (nameCounts[x] || 0) + 1; });
			let namesList = Object.keys(nameCounts);
			let countList = Object.values(nameCounts);
			console.log(namesList)
			console.log(countList)
			for (var i = 0; i < namesList.length; i++) {
				subText += IconName(namesList[i],countList[i]);
				
				if(i < namesList.length-1){
					subText += ", "
				}
			}
        
            numLocs = splitOptions.length;
            let rad_size = 22 + 1*numLocs; // this expands slightly as more icons are used
            var trackIcons = ""
            for (var i = 0; i < numLocs; i++) {
                pos_angle = i * 2*Math.PI / numLocs - (Math.PI)*(1-(1/6));
                x_loc = rad_size * Math.cos(pos_angle) - 31;
                y_loc = rad_size * Math.sin(pos_angle) - 25;
                let track_icon_loc = "style='transform: translateY("+y_loc+"px) translateX("+x_loc+"px)'";

                // deal with cards and energy
                if(!isNaN(splitOptions[i])){
                    trackIcons += "<icon-multi-element><" + nodeClass + "-icon class='small'"+track_icon_loc+"><value>" + splitOptions[i] + "</value></" + nodeClass + "-icon></icon-multi-element>";
                    if(nodeClass == 'energy') { 
                        addEnergyRing = false;
                    }
                } else if(splitOptions[i].startsWith("reclaim")){
                    trackIcons += "<icon-multi-element><icon class='"+splitOptions[i]+" small-reclaim'"+track_icon_loc+"></icon></icon-multi-element>"
                } else if(splitOptions[i].startsWith("move-presence")){
					var matches = regExp.exec(splitOptions[i]);
                    var moveRange = matches[1];
                    trackIcons += "<icon-multi-element><icon-shadow class = 'small'"+track_icon_loc+"><icon class='move-presence-"+moveRange+" small'></icon></icon-shadow></icon-multi-element>"
					addEnergyRing = false;
					addIconShadow = false;
				} else if(splitOptions[i].startsWith("gain-range")){
					var matches = regExp.exec(splitOptions[i]);
                    var gainRange = matches[1];
					gainRange = gainRange.split(";")[0];
                    trackIcons += "<icon-multi-element><icon-shadow class = 'small'"+track_icon_loc+"><icon class='gain-range-"+gainRange+" small'></icon></icon-shadow></icon-multi-element>"
					addEnergyRing = false;
					addIconShadow = false;
				} else {
                    trackIcons += "<icon-multi-element><icon class='"+splitOptions[i]+"'"+track_icon_loc+"></icon></icon-multi-element>"
                }
            }
            var inner = trackIcons;
        }
    }
        
    if(addEnergyRing){ inner = "<energy-icon>"+inner+"</energy-icon>"; }
	if(addIconShadow){ inner = "<icon-shadow>"+inner+"</icon-shadow>"; }
    ring.innerHTML = inner;
    presenceNode.innerHTML += "<subtext>" + subText + "</subtext>";
    if(addDeepLayers){ presenceNode.innerHTML = "<icon class='"+iconDeepLayers+" "+nodeClass+"-deep-layers'></icon>" + presenceNode.innerHTML; }
    return presenceNode.outerHTML;
}

function IconName(str, iconNum = 1){
	var regExp = /\(([^)]+)\)/;
	const matches = regExp.exec(str);
	num = ""
	txt = ""
	if(matches){
		options = matches[1].split(";");
		num = options[0];
		txt = options[1];
	}
	str = str.split("(")[0];
	if(!isNaN(str) && isNaN(str[0])){
		num = str[1];
		str = "increase-energy";
	}
	let plural = iconNum > 1 ? 's' : '';

	switch(str){

		case 'gain-power-card':
			subText = "Gain Power Card"
			break;
		case 'gain-card-play':
			subText = "Gain a Card Play"
			break;
		case 'reclaim-all':
			subText = "Reclaim Cards"
			break;
		case 'reclaim-one':
			subText = "Reclaim One";
			break;
		case 'reclaim':
			subText = "Reclaim Cards";
			break;
		case 'forget-power-card':
			subText = "Forget Power Card";
			break;    
		case 'discard-cards':
			subText = "Discard 2 Power Cards"
			break;
		case 'destroy-presence':
			subText = "Destroy 1 of your Presence"
			break;
		case 'make-fast':  
			subText = "One of your Powers may be Fast"
			break;
		case 'forget-power-card':
			subText = "Forget Power";
			break;    
		case 'gain-card-pay-2':
			subText = "Pay 2 Energy to Gain a Power Card";
			break;
		case 'ignore-range':
			subText = "You may ignore Range this turn"
			break;
		case 'star':
			subText = "Element"
			break;
		case 'markerplus':
			subText = "Prepare "+iconNum+" Element Marker"+plural;
			break;
		case 'markerminus':
			subText = "Discard "+iconNum+" Element Marker"+plural;
			break;
		case 'isolate':
			subText = "Isolate "+iconNum+" of your Lands";
			break;
		case 'reclaim-none':
			subText = "Reclaim None"
			break;
		case 'increase-energy':
			subText = "+"+num+" Energy"
			break;
		case 'move-presence':
			subText = "Move Presence " + num[0];
			break;
		case 'gain-range':
			subText = "+" + num[0]+ " Range";
			if (typeof(txt)!="undefined") {
				subText += " on " + txt;
				}
			break;
		case 'inland':
		case 'coastal':
		case 'invaders':
			subText = str.toUpperCase();
			break;
		default:
			subText = iconNum > 1 ? iconNum + " " + Capitalise(str) : Capitalise(str);
	}
	
	return subText

}

function Capitalise(str){
	hyphenCheck = str.split("-");
	const terrains = new Set(['wetland', 'mountain', 'sand', 'jungle'])
	let return_str = hyphenCheck[0].charAt(0).toUpperCase() + hyphenCheck[0].slice(1);
	for (var i = 1; i < hyphenCheck.length; i++) {
		if (terrains.has(hyphenCheck[i])){
			return_str += ' or ';
		}else{
			return_str += ' ';
		}		
		return_str += hyphenCheck[i].charAt(0).toUpperCase() + hyphenCheck[i].slice(1);
	}		

    return return_str;
}

function setNewEnergyCardPlayTracks(energyHTML, cardPlayHTML){
    document.getElementsByTagName("presence-tracks")[0].innerHTML = "<section-title>Presence</section-title>" +
        "<table id='presence-table'>"+energyHTML + cardPlayHTML+"</table>";
}

function dynamicCellWidth() {

	// Growth Sizing
    growthCells =  document.getElementsByTagName("growth-cell");
    growthCellCount = growthCells.length;

    growthBorders = Array.from(document.getElementsByTagName("growth-border"));
    growthBorderCount = growthBorders.length;

    /* Borders = 7px */
    /* Table width: 1050px */

    let borderPixels = 0;
    for (const borderWidth of growthBorders.map(x => x.getAttribute('double') === undefined ? 7 : 11)) {
        borderPixels += borderWidth
    }
    const growthTable = document.getElementsByTagName("growth-table")[0];
    const growthTableStyle = window.getComputedStyle(growthTable);
    const growthTableWidth = growthTableStyle.getPropertyValue('width');
    const remainingCellWidth = (parseInt(growthTableWidth.replace(/px/, "")) - borderPixels) + "px";
	
	const largeCellScale = 1.2;
	
	let averageWidth = 0;
	let widthArray = [];
    for (i = 0; i < growthCells.length; i++){
		averageWidth += growthCells[i].offsetWidth;
		widthArray[i] = growthCells[i].offsetWidth;
    }
	averageWidth = averageWidth/growthCells.length;
	let largeCellFinder = widthArray.map(x => x > averageWidth*1.35)
	const largeCell = largeCellFinder.filter(Boolean).length
	const smallCell = largeCellFinder.length - largeCell
	weightedSmallCellWidth = (parseFloat(remainingCellWidth.replace(/px/, "")) / (smallCell + largeCellScale*largeCell))
	weightedLargeCellWidth = weightedSmallCellWidth*largeCellScale;
	for (i = 0; i < growthCells.length; i++){
		growthCells[i].style.width = largeCellFinder[i]==true ? weightedLargeCellWidth+"px" : weightedSmallCellWidth+"px";
    }
	
	
    const headerWith = {}
    const headerAdditionalWidth = {}
    let maxIndex = undefined
    for (const c of growthTable.children) {
        const header = parseInt(c.getAttribute('header'))
        if (!isNaN( header )) {
            maxIndex = header
            const addwith = parseFloat(window.getComputedStyle(c).getPropertyValue('margin-right').replace(/px/, ""))
                + parseFloat(window.getComputedStyle(c).getPropertyValue('margin-left').replace(/px/, ""))
                + parseFloat(window.getComputedStyle(c).getPropertyValue('width').replace(/px/, ""))

            if (headerWith[header]) {
                headerWith[header] += addwith
            } else {
                headerWith[header] = addwith
            }
        } else if (maxIndex != undefined) {
            const addwith = parseFloat(window.getComputedStyle(c).getPropertyValue('margin-right').replace(/px/, ""))
                + parseFloat(window.getComputedStyle(c).getPropertyValue('margin-left').replace(/px/, ""))
                + parseFloat(window.getComputedStyle(c).getPropertyValue('width').replace(/px/, ""))
            if (headerAdditionalWidth[maxIndex]) {
                headerAdditionalWidth[maxIndex] += addwith
            } else {
                headerAdditionalWidth[maxIndex] = addwith
            }

        }
    }


    const subGrowthTitle = document.getElementsByTagName('sub-section-title')
    let position = 0
    for (let i = 0; i < subGrowthTitle.length; i++) {
        subGrowthTitle[i].style.left = `${position}px`
        subGrowthTitle[i].style.width = `${headerWith[i]}px`
        position += headerWith[i] + headerAdditionalWidth[i]

        
    }
	// Innate Power Sizing
	// Innate Power Notes (scale font size)
	noteBlocks = document.getElementsByTagName("note");
	for(let i = 0; i < noteBlocks.length; i++){
		let noteHeight = noteBlocks[i].offsetHeight;
		let j = 0
		while (noteHeight>92){
			var style = window.getComputedStyle(noteBlocks[i], null).getPropertyValue('font-size');
			var fontSize = parseFloat(style); 
			noteBlocks[i].style.fontSize = (fontSize - 1) + 'px';
			noteHeight = noteBlocks[i].offsetHeight
			
			// safety valve
			j += 1
			if (j>5){ break;}
		}
	}
	
	// Innate Power Thresholds
    thresholds = document.getElementsByTagName("threshold");
    thresholdsCount = thresholds.length;
    ICONWIDTH = 60;
	let dynamicThresholdWidth = []
	let outerThresholdWidth = []
    for (i = 0; i < thresholdsCount; i++){
        icon = thresholds[i].getElementsByTagName("icon");
        iconCount = icon.length;
        dynamicThresholdWidth = (iconCount * ICONWIDTH) + (iconCount * 12);
        thresholds[i].style.width = dynamicThresholdWidth + "px";
		
		// Check if the threshold width is overflowing. If so, just let it size itself...
		var thresholdHeight = thresholds[i].offsetHeight
		if (thresholdHeight > 60){
			thresholds[i].style.width = "auto";
		}
		
		outerThresholdWidth[i] = dynamicThresholdWidth + parseFloat(window.getComputedStyle(thresholds[i]).getPropertyValue('margin-right').replace(/px/, ""))
    }
	
	// Innate Power Descriptions
    var description = document.getElementsByClassName("description");
    for(i = 0; i < description.length; i++){
        // Scale the text width to the threshold size...
		description[i].style.paddingLeft = outerThresholdWidth[i]+"px";
		var textHeight = description[i].clientHeight;

        if (textHeight < 40){
            description[i].id = "single-line";
			// Align-middle the text if its a single line
		}else if (textHeight > 75){
			description[i].style.paddingLeft = "0px";
			// Spill over below the threshold if its greater than three lines
        }
    }

    
    // Presence node subtext (for longer descriptions, allows flowing over into neighbors.
    var subtext = document.getElementsByTagName("subtext");
	var presence_nodes = document.getElementsByTagName("presence-node");
	let adjustment_flag = 0
	let default_row_height = 48;
	let row_max_height = default_row_height;
	let first_row_max = default_row_height;
	let height_adjust = 0;
	let firstCardPlayIndex = 0;
    for(i = 0; i < subtext.length; i++){
        if(presence_nodes[i].className == 'first' && i!=0){
			height_adjust += row_max_height;
			first_row_max = row_max_height;
			firstCardPlayIndex = i;
			row_max_height=default_row_height;
			
		}
		
        var textHeight = subtext[i].offsetHeight;
        //This solution is really jank, but it works for now
        if (textHeight > 55){
			subtext[i].className = "adjust-subtext";
			textHeight = subtext[i].offsetHeight;
			adjustment_flag = 1
        }
		
		row_max_height = textHeight > row_max_height ? textHeight : row_max_height;

    }
	height_adjust += row_max_height - 1.5*default_row_height;
	subtext[0].style.height = first_row_max+2+"px"
	subtext[firstCardPlayIndex].style.height = row_max_height+2+"px"
	var presence_table = document.getElementById("presence-table");
	presence_table.style.height = (presence_table.offsetHeight + height_adjust)+"px";
    
	// Place middle presence nodes
	var firstRow = document.getElementsByClassName("first")[0];
	var firstRowHeight = firstRow.offsetHeight;
	console.log('offset height = '+firstRowHeight)
	var middleNodes = document.getElementsByClassName("middle");
	for(i = 0; i < middleNodes.length; i++){
		let presenceNode = middleNodes[i].getElementsByTagName("presence-node")
		presenceNode[0].style.top = (firstRowHeight/2)+"px";
	}
}

function parseInnatePowers(){
    var fullHTML = "";
    
    var innateHTML = document.getElementsByTagName("quick-innate-power");
    
    for(i = 0; i < innateHTML.length; i++){
        fullHTML += parseInnatePower(innateHTML[i]);
    }
    document.getElementsByTagName("innate-powers")[0].innerHTML = '<section-title>Innate Powers</section-title><innate-power-container>'+fullHTML+'</innate-power-container>';
}

function parseInnatePower(innatePowerHTML){

    var currentPowerHTML = "<innate-power class='"+innatePowerHTML.getAttribute("speed")+"'>";
    
    //Innater Power title
    currentPowerHTML += "<innate-power-title>"+innatePowerHTML.getAttribute("name")+"</innate-power-title><info-container><info-title>";
    
    //Innate Power Speed and Range Header
    currentPowerHTML += "<info-title-speed>SPEED</info-title-speed><info-title-range>RANGE</info-title-range>";
    
    //Innate Power Target Header
    currentPowerHTML += "<info-title-target>"+innatePowerHTML.getAttribute("target-title")+"</info-title-target></info-title><innate-info>";
    
    //Innater Power Speed value
    currentPowerHTML += "<innate-info-speed></innate-info-speed>";
    
    //Innate Power Range value
    currentPowerHTML += `<innate-info-range>${getRangeModel(innatePowerHTML.getAttribute("range"))}</innate-info-range>`;

    function getRangeModel(rangeString)
    {
      if(rangeString === "none"){
        return "<no-range></no-range>";
      }else {
        var result = '';
        for(var item of rangeString.split(',')){
          if(!isNaN(item)){
            result += `<range>${item}</range>`;
          }
          else
          {
            result += `<icon class="${item}"></icon>`;
          }
        }
        return result;
      }
    }
    
    //Innate Power Target value
    var targetValue = innatePowerHTML.getAttribute("target");
    currentPowerHTML += `<innate-info-target>${replaceIcon(targetValue)}</innate-info-target></innate-info></info-container>`;
    
    currentPowerHTML += "<description-container>";
    
    var noteValue = innatePowerHTML.getAttribute("note");

    //If the note field is blank
    if(noteValue == null){
        noteValue = "";
    }else{
        currentPowerHTML += "<note>" + noteValue + "</note>";
    }       


    //Innate Power Levels and Thresholds
    var currentLevels = innatePowerHTML.getElementsByTagName("level");
    for (j = 0; j < currentLevels.length; j++){
        var currentThreshold = currentLevels[j].getAttribute("threshold");
		let isLong = currentLevels[j].getAttribute("long");
		if(isLong!=null){
			isLong = " long"
		}else{
			isLong = ""
		}

        var currentThresholdPieces = currentThreshold.split(",");
      
        currentPowerHTML += "<level><threshold>";
        for (k = 0; k < currentThresholdPieces.length; k++){
            currentThresholdPieces[k] = currentThresholdPieces[k].replace("-","{"); // here, typically looks something like 3{earth
			if(currentThresholdPieces[k].split("{")[0]=='cost'){
				currentThresholdPieces[k]="<cost-threshold>cost<cost-energy><value>-" + currentThresholdPieces[k].split("{")[1] + "</value></cost-energy></cost-threshold>";
			}else{
				currentThresholdPieces[k] += "}";
			}
            currentPowerHTML += currentThresholdPieces[k];
        }
        currentPowerHTML += "</threshold><div class='description"+isLong+"'>";
        var currentDescription = currentLevels[j].innerHTML;
        currentPowerHTML += currentDescription+"</div></level>";
    }
    
    currentPowerHTML+="</description-container></innate-power>";
    return currentPowerHTML;
}

