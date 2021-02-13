
window.onload = function startMain(){
    parseGrowthTags();
	if(document.getElementById("presence-table")) {
		enhancePresenceTracksTable();
	} else {		
        setNewEnergyCardPlayTracks(parseEnergyTrackTags(), parseCardPlayTrackTags());
	}
    parseInnatePowers();
    const board = document.querySelectorAll('board')[0];
    addImages(board)
    var html = board.innerHTML;
    board.innerHTML = replaceIcon(html);
    dynamicCellWidth();
    dynamicSpecialRuleHeight(board)
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

    const spiritBorder = board.getAttribute('spirit-border');

    if(spiritBorder){
        const specialRules = board.querySelectorAll('special-rules-container')[0]
        specialRules.innerHTML = `<div class="spirit-border" style="background-image: url(${spiritBorder});" ></div>` + specialRules.innerHTML
    }
    if(spiritImage){
        board.innerHTML = `<div class="spirit-image" style="background-image: url(${spiritImage});" ></div>` + board.innerHTML
    }
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

        const growthClass = childElement.getAttribute("values");

        const classPieces = growthClass.split(';');
        const openTag = headerIndex !== undefined
            ? `<growth-cell header="${headerIndex}">`
            : "<growth-cell>"
        for (j = 0; j < classPieces.length; j++) {

            //Find a parenthesis and split out the string before it
            const growthItem = classPieces[j].split("(")[0];

            switch (growthItem) {
                case 'reclaim-all':
                    {
                        newGrowthCellHTML += `${openTag}{reclaim-all}<growth-text>Reclaim Cards</growth-text></growth-cell>`
                        break;
                    }
                case 'reclaim-one':
                    {
                        newGrowthCellHTML += `${openTag}{reclaim-one}<growth-text>Reclaim One</growth-text></growth-cell>`
                        break;
                    }
                case 'gain-power-card':
                    {
                        newGrowthCellHTML += `${openTag}{gain-power-card}<growth-text>Gain Power Card</growth-text></growth-cell>`
                        break;
                    }
                case 'discard-cards':
                    {
                        newGrowthCellHTML += `${openTag}{discard-cards}<growth-text>Discard 2 Power Cards</growth-text></growth-cell>`
                        break;
                    }
                case 'forget-power-card':
                    {
                        newGrowthCellHTML += `${openTag}{forget-power-card}<growth-text>Forget Power Card</growth-text></growth-cell>`
                        break;
                    }
                case 'gain-card-play':
                    {
                        newGrowthCellHTML += `${openTag}{gain-card-play}<growth-text>Gain a Card Play</growth-text></growth-cell>`
                        break;
                    }
                case 'make-fast':
                    {
                        newGrowthCellHTML += `${openTag}{make-fast}<growth-text>One of your Powers may be Fast</growth-text></growth-cell>`
                        break;
                    }
                case 'gain-energy':
                    {
                        const matches = regExp.exec(classPieces[j]);

                        const gainEnergyBy = matches[1];

                        if (!isNaN(gainEnergyBy)) {
                        //Gain Energy has a number in it
                        newGrowthCellHTML += `${openTag}<growth-energy><value>` + gainEnergyBy + "</value></growth-energy><growth-text>Gain Energy</growth-text></growth-cell>"
                    } else {
                        //Gain Energy is not from a number
                        newGrowthCellHTML += `${openTag}<gain-per><value>1</value></gain-per><` + gainEnergyBy + "></" + gainEnergyBy + "><growth-text>Gain 1 Energy per " + gainEnergyBy.charAt(0).toUpperCase() + gainEnergyBy.slice(1) + "</growth-text></growth-cell>"
                    }
                        break;
                    }
                case 'add-presence': {
                    const matches = regExp.exec(classPieces[j]);

                    let presenceOptions = matches[1].split(",");
                    let presenceRange = presenceOptions[0];
                    let presenceReqOpen = "<custom-presence>";
                    let presenceReqClose = "</custom-presence>";
                    let presenceReq = "none";

                    if (presenceOptions.length > 1) {
                        presenceReqOpen = "<custom-presence-req>";
                        presenceReqClose = "</custom-presence-req>";
                        presenceReq = presenceOptions[1];
                    }

                    newGrowthCellHTML += `${openTag}` + presenceReqOpen + "+{presence}{" + presenceReq + "}{range-" + presenceRange + "}" + presenceReqClose + "<growth-text>Add a Presence</growth-text></growth-cell>"
                    break;
                }
                case 'push':
                    {
                        const matches = regExp.exec(classPieces[j]);
                        const pushTarget = matches[1];
                        newGrowthCellHTML += `${openTag}<icon class='` + growthItem + "'><icon class='" + pushTarget + "'></icon></icon><growth-text>Push " + pushTarget + "</growth-text></growth-cell>"
                        break;
                    }

                case 'presence-no-range':
                    {
                        newGrowthCellHTML += `${openTag}<custom-presence-no-range>+{presence}</custom-presence-no-range><growth-text>Add a Presence to any Land</growth-text></growth-cell>`
                        break;
                    }
                case 'ignore-range':
                    {
                        newGrowthCellHTML += `${openTag}<custom-presence>{ignore-range}</custom-presence><growth-text>You may ignore Range this turn</growth-text></growth-cell>`
                        break;
                    }
                case 'move-presence':
                    {        //Additional things can be done here based on inputs
                        const matches = regExp.exec(classPieces[j]);

                        const moveRange = matches[1];
                        newGrowthCellHTML += `${openTag}<custom-presence-special>{presence}{move-range-` + moveRange + "}<growth-text>Move a Presence</growth-text></growth-cell>"

                        break;
                    }
                case 'gain-element':
                    {
                        const matches = regExp.exec(classPieces[j]);

                        const gainedElement = matches[1];

                        const elementOptions = matches[1].split(",");

                    //Check if they want 2 elements
                        if (elementOptions.length > 1) {
                            if (isNaN(elementOptions[1])) {
                            //They want different elements
                            newGrowthCellHTML += `${openTag}<gain>`
                            for (var i = 0; i < elementOptions.length; i++) {
                                newGrowthCellHTML += "{" + elementOptions[i] + "}";
                                if (i < elementOptions.length - 1) {
                                    newGrowthCellHTML += "/";
                                }
                            }
                            newGrowthCellHTML += "</gain><growth-text>Gain " + gainedElement.charAt(0).toUpperCase() + gainedElement.slice(1) + "</growth-text></growth-cell>";
                        } else {
                            //They just want 2 of the same element
                        }
                        //newGrowthCellHTML += `${openTag}<gain>{"+elementOptions[0]+"}</gain><growth-text>Gain "+gainedElement.charAt(0).toUpperCase() + gainedElement.slice(1)+"</growth-text></growth-cell>`
                    } else {
                        newGrowthCellHTML += `${openTag}<gain>{` + gainedElement + "}</gain><growth-text>Gain " + gainedElement.charAt(0).toUpperCase() + gainedElement.slice(1) + "</growth-text></growth-cell>"
                    }


                        break;
                    }
                default:
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
    var energyHTML = "<tr>";
    
    var energyValues = document.getElementsByTagName("energy-track")[0].getAttribute("values");

    var energyOptions = energyValues.split(",");

    for(i = 0; i < energyOptions.length; i++){
		energyHTML += "<td>"+getPresenceNodeHtml(energyOptions[i], i == 0, "energy", true)+"</td>";
    }
    energyHTML += "</tr>"
    document.getElementsByTagName("energy-track")[0].removeAttribute("values");
    return energyHTML;
	
}

function parseCardPlayTrackTags(){	
    var cardPlayHTML = "<tr>";
    
    var cardPlayValues = document.getElementsByTagName("card-play-track")[0].getAttribute("values");

    var cardPlayOptions = cardPlayValues.split(",");

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
	
	var table = document.getElementById("presence-table");
	for (var i = 0, row; row = table.rows[i]; i++) {
	   for (var j = 0, cell; cell = row.cells[j]; j++) {
        cell.innerHTML = getPresenceNodeHtml(cell.firstChild.nodeValue, j == 0, 'dynamic', i == 0);
	   }  
	}
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

    if(trackType == 'dynamic'){
        if(nodeText.startsWith("energy")) {
            nodeText = nodeText.substr(6);
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

	
	if(!isNaN(nodeText)){
		//The value is only a number
        addEnergyRing = false;
		if(first === true){
            presenceNode.classList.add("first");
		} else {
            subText = nodeText;
		}
        inner = "<" + nodeClass + "-icon><value>" + nodeText + "</value></" + nodeClass + "-icon>";
	} else {
		//It is either a single element or a mix of elements/numbers
		var splitOptions = nodeText.split("+");

		if(splitOptions.length == 1){
			//It's just a single item
			var option = splitOptions[0].split("(")[0];
			switch(option){
				case 'reclaim-one':
                    inner = "{reclaim-one}";
                    subText = "Reclaim One";
					break;
				case 'forget-power-card':
                    inner = "{forget-power-card}";
                    subText = "Forget Power";
					break;    
				case 'push':
					var matches = regExp.exec(splitOptions[0]);
					var pushTarget = matches[1];
                    inner = "<icon class='push'><icon class='"+pushTarget+"'></icon></icon>";
                    subText = "Push "+Capitalise(pushTarget);
					break;    
				case 'move-presence':
					var matches = regExp.exec(splitOptions[0]);
					var moveRange = matches[1];
                    inner = "{move-presence-"+moveRange+"}";
                    subText = "Move a Presence "+moveRange;
					break;
                default:
                    // element
					var elementName = splitOptions[0];
                    inner = "<icon class='"+elementName+"'></icon>";
                    subText = Capitalise(elementName);
					break;                
			}            
		} else {
            splitOptions.forEach(function(part, index) {
                if(part.startsWith("energy")) {
                    this[index] = nodeText.substr(6);
                    nodeClass = 'energy';
                } else if(part.startsWith("card")) {
                    this[index] = nodeText.substr(4);
                    nodeClass = 'card';
                }
            }, splitOptions);            

            var subText = Capitalise(splitOptions[1]);
            if(splitOptions[1] == 'reclaim-one'){
                subText = "Reclaim One";
            }
            subText = Capitalise(splitOptions[0])+", "+subText;

            var top = "";
            var bottom = "<icon class='"+splitOptions[1]+"'></icon>";
            if(!isNaN(splitOptions[0])){
                top = "<" + nodeClass + "-icon class='small'><value>" + splitOptions[0] + "</value></" + nodeClass + "-icon>";
                // Don't add the big energy ring if we've also got a small one.
                if(nodeClass == 'energy') { 
                    addEnergyRing = false;
                }
            } else {
                top = "<icon class='"+splitOptions[0]+"'></icon>";
            }

            var inner = "<icon-top>"+top+"</icon-top>" +
                "<icon-bottom>"+bottom+"<icon-bottom>";
		}
	}
        
    if(addEnergyRing){ inner = "<energy-icon>"+inner+"</energy-icon>"; }
    ring.innerHTML = inner;
    presenceNode.innerHTML += "<subtext>" + subText + "</subtext>";
	
	return presenceNode.outerHTML;
}

function Capitalise(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function setNewEnergyCardPlayTracks(energyHTML, cardPlayHTML){
    document.getElementsByTagName("presence-tracks")[0].innerHTML = "<section-title>Presence</section-title>" +
        "<table id='presence-table'>"+energyHTML + cardPlayHTML+"</table>";
}

function dynamicCellWidth() {
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
    const equalCellWidth = (parseFloat(remainingCellWidth.replace(/px/, "")) / growthCellCount) + "px";

    for (i = 0; i < growthCells.length; i++){
        // growthCells[i].style.maxWidth = equalCellWidth;
        growthCells[i].style.width = equalCellWidth;
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


    thresholds = document.getElementsByTagName("threshold");
    thresholdsCount = thresholds.length;
    ICONWIDTH = 60;

    for (i = 0; i < thresholdsCount; i++){
        icon = thresholds[i].getElementsByTagName("icon");

        iconCount = icon.length;

        dynamicThresholdWidth = 
            (iconCount * ICONWIDTH) + (iconCount * 12);
        formattedWidth = dynamicThresholdWidth + "px";
        thresholds[i].style.width = formattedWidth;
    }
    var description = document.getElementsByClassName("description");
    for(i = 0; i < description.length; i++){
        
        var textWidth = description[i].clientHeight;
        console.log(textWidth);
        //Get the icon width and add it to length
        if (textWidth < 50){
            description[i].id = "single-line";
        }
    }
}

function parseInnatePowers(){
    var fullHTML = "";
    
    var innateHTML = document.getElementsByTagName("quick-innate-power");

    for(i = 0; i < innateHTML.length; i++){
        var innatePowerHTML = innateHTML[i];
        
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
        
        /*console.log(targetValue);
        var specialLandsList = ["any", "coastal", "invaders", "inland"];

        if(specialLandsList.includes(targetValue.toLowerCase())){
            targetValue = targetValue.toUpperCase();
            currentPowerHTML += "<innate-info-target>"+targetValue+"</innate-info-target></innate-info></info-container>";
        } else {
            currentPowerHTML += "<innate-info-target>{"+targetValue+"}</innate-info-target></innate-info></info-container>";
        }*/

        if(innateHTML.length == 1){
            currentPowerHTML += "<description-container style='width:1000px !important'>";            
        } else {
            currentPowerHTML += "<description-container>";
        }
        
        var noteValue = innatePowerHTML.getAttribute("note");

        //If the note field is blank
        if(noteValue == null){
            noteValue = "";
        }

        currentPowerHTML += "<note>" + noteValue + "</note>";

        //Innate Power Levels and Thresholds
        var currentLevels = innatePowerHTML.getElementsByTagName("level");
        for (j = 0; j < currentLevels.length; j++){
            var currentThreshold = currentLevels[j].getAttribute("threshold");
            var currentThresholdPieces = currentThreshold.split(",");
            if(innateHTML.length == 1){
                currentPowerHTML += "<level style='display:block !important; width:1000px !important'><threshold>";
            } else {
                currentPowerHTML += "<level><threshold>";
            }
            for (k = 0; k < currentThresholdPieces.length; k++){
                currentThresholdPieces[k] = currentThresholdPieces[k].replace("-","{");
                currentThresholdPieces[k] += "}";
                currentPowerHTML += currentThresholdPieces[k];
            }
            currentPowerHTML += "</threshold><div class='description'>";
            var currentDescription = currentLevels[j].innerHTML;
            currentPowerHTML += currentDescription+"</div></level>";
        }
        fullHTML += currentPowerHTML+"</description-container></innate-power>";
    }
    document.getElementsByTagName("innate-powers")[0].innerHTML = '<section-title>Innnate Powers</section-title><innate-power-container>'+fullHTML+'</innate-power-container>';
}