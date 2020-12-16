
window.onload = function startMain(){
    parseGrowthTags();
    setNewEnergyCardPlayTracks(parseEnergyTrackTags(), parseCardPlayTrackTags());
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
    const height = specialRules.getAttribute('height')

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

    var newGrowthTableTagOpen = "<growth-table>";
    var newGrowthTableTagClose = "</growth-table>";

    //Find values between parenthesis
    var regExp = /\(([^)]+)\)/;

    var newGrowthCellHTML = "";
    for (i = 0; i < growthHTML[0].children.length; i++){
        childElement = growthHTML[0].children[i];
        //childElement is the thing that should be replaced when all is said and done

        let cost = childElement.getAttribute("cost")

        if (cost) {
            newGrowthCellHTML += `<growth-cost>-${cost}</growth-cost>`
        }

        growthClass = childElement.getAttribute("values");

        var classPieces = growthClass.split(';');

        for (j = 0; j < classPieces.length; j++){

            //Find a parenthesis and split out the string before it
            var growthItem = classPieces[j].split("(")[0];

            switch(growthItem) {
                case 'reclaim-all':
                    newGrowthCellHTML += "<growth-cell>{reclaim-all}<growth-text>Reclaim Cards</growth-text></growth-cell>";
                    break;
                case 'reclaim-one':
                    newGrowthCellHTML += "<growth-cell>{reclaim-one}<growth-text>Reclaim One</growth-text></growth-cell>";
                    break;
                case 'gain-power-card':
                    newGrowthCellHTML += "<growth-cell>{gain-power-card}<growth-text>Gain Power Card</growth-text></growth-cell>";
                    break;
                case 'discard-cards':
                    newGrowthCellHTML += "<growth-cell>{discard-cards}<growth-text>Discard 2 Power Cards</growth-text></growth-cell>";
                    break;
                case 'forget-power-card':
                    newGrowthCellHTML += "<growth-cell>{forget-power-card}<growth-text>Forget Power Card</growth-text></growth-cell>";
                    break;
                case 'gain-card-play':
                    newGrowthCellHTML += "<growth-cell>{gain-card-play}<growth-text>Gain a Card Play</growth-text></growth-cell>";
                    break;
                case 'make-fast':
                    newGrowthCellHTML += "<growth-cell>{make-fast}<growth-text>One of your Powers may be Fast</growth-text></growth-cell>";
                    break;
                case 'gain-energy':
                    var matches = regExp.exec(classPieces[j]);

                    var gainEnergyBy = matches[1];

                    if (!isNaN(gainEnergyBy)){
                        //Gain Energy has a number in it
                        newGrowthCellHTML += "<growth-cell><growth-energy><value>"+gainEnergyBy+"</value></growth-energy><growth-text>Gain Energy</growth-text></growth-cell>";
                    } else {
                        //Gain Energy is not from a number
                        newGrowthCellHTML += "<growth-cell><gain-per><value>1</value></gain-per><"+gainEnergyBy+"></"+gainEnergyBy+"><growth-text>Gain 1 Energy per "+gainEnergyBy.charAt(0).toUpperCase() + gainEnergyBy.slice(1)+"</growth-text></growth-cell>";
                    }
                    break;
                case 'add-presence':
                    var matches = regExp.exec(classPieces[j]);

                    var presenceOptions = matches[1].split(",");
                    var presenceRange = presenceOptions[0];
                    var presenceReqOpen = "<custom-presence>";
                    var presenceReqClose = "</custom-presence>";
                    var presenceReq = "none";

                    if(presenceOptions.length > 1){
                        presenceReqOpen = "<custom-presence-req>";
                        presenceReqClose = "</custom-presence-req>";
                        presenceReq = presenceOptions[1];
                    }

                    newGrowthCellHTML += "<growth-cell>"+presenceReqOpen+"+{presence}{"+presenceReq+"}{range-"+presenceRange+"}"+presenceReqClose+"<growth-text>Add a Presence</growth-text></growth-cell>";
                    break;
                case 'push':
                    var matches = regExp.exec(classPieces[j]);
                    var pushTarget = matches[1];
                    newGrowthCellHTML += "<growth-cell><icon class='"+growthItem+"'><icon class='"+pushTarget+"'></icon></icon><growth-text>Push "+pushTarget+"</growth-text></growth-cell>";
                    break;    

                case 'presence-no-range':
                    newGrowthCellHTML += "<growth-cell><custom-presence-no-range>+{presence}</custom-presence-no-range><growth-text>Add a Presence to any Land</growth-text></growth-cell>";
                    break;
                case 'ignore-range':
                    newGrowthCellHTML += "<growth-cell><custom-presence>{ignore-range}</custom-presence><growth-text>You may ignore Range this turn</growth-text></growth-cell>";
                    break;
                case 'move-presence':
                    //Additional things can be done here based on inputs
                    var matches = regExp.exec(classPieces[j]);

                    var moveRange = matches[1];
                    newGrowthCellHTML += "<growth-cell><custom-presence-special>{presence}{move-range-"+moveRange+"}<growth-text>Move a Presence</growth-text></growth-cell>";

                    break;
                case 'gain-element':
                    var matches = regExp.exec(classPieces[j]);

                    var gainedElement = matches[1];

                    var elementOptions = matches[1].split(",");
                    
                    //Check if they want 2 elements
                    if(elementOptions.length > 1){
                        if(isNaN(elementOptions[1])){
                            //They want different elements
                            newGrowthCellHTML += "<growth-cell><gain>";
                            for(var i = 0; i < elementOptions.length; i++){
                                newGrowthCellHTML += "{"+elementOptions[i]+"}";
                                if(i < elementOptions.length-1){
                                    newGrowthCellHTML += "/";
                                }
                            }
                            newGrowthCellHTML += "</gain><growth-text>Gain "+gainedElement.charAt(0).toUpperCase() + gainedElement.slice(1)+"</growth-text></growth-cell>";                            
                        } else {
                            //They just want 2 of the same element
                            
                        }
                        //newGrowthCellHTML += "<growth-cell><gain>{"+elementOptions[0]+"}</gain><growth-text>Gain "+gainedElement.charAt(0).toUpperCase() + gainedElement.slice(1)+"</growth-text></growth-cell>";
                    } else {
                        newGrowthCellHTML += "<growth-cell><gain>{"+gainedElement+"}</gain><growth-text>Gain "+gainedElement.charAt(0).toUpperCase() + gainedElement.slice(1)+"</growth-text></growth-cell>";
                    }


                    break;
                default:
            }
        }
        if(i != growthHTML[0].children.length - 1)
            newGrowthCellHTML += "<growth-border></growth-border>";
    }
    fullHTML += growthTitle+newGrowthTableTagOpen+newGrowthCellHTML+newGrowthTableTagClose

    document.getElementsByTagName("growth")[0].removeAttribute("title");
    document.getElementsByTagName("growth")[0].innerHTML = fullHTML;
}

function parseEnergyTrackTags(){
    var fullHTML = "";
    var energyHTML = "";
    
    var energyValues = document.getElementsByTagName("energy-track")[0].getAttribute("values");

    var energyOptions = energyValues.split(",");

    //Find values between parenthesis
    var regExp = /\(([^)]+)\)/;

    for(i = 0; i < energyOptions.length; i++){
        if(!isNaN(energyOptions[i])){
            //The energy option is only a number
            if(i == 0){
                energyHTML += "<energy-track-initial><value>"+energyOptions[i]+"</value></energy-track-initial>";
            } else {
                energyHTML += "<energy-track><value>"+energyOptions[i]+"</value><subtext>"+energyOptions[i].charAt(0).toUpperCase() + energyOptions[i].slice(1)+"</subtext></energy-track>";
            }
        } else {
            //It is either a single element or a mix of elements/numbers
            var splitOptions = energyOptions[i].split("+");

            if(splitOptions.length == 1){
                //It's just a single item
                var energyOption = splitOptions[0].split("(")[0];
                switch(energyOption){
                    case 'reclaim-one':
                        energyHTML += "<energy-track-ring>{"+splitOptions[0]+"}<subtext>Reclaim One</subtext></energy-track-ring>";
                        break;
                    case 'forget-power-card':
                        energyHTML += "<energy-track-ring>{"+splitOptions[0]+"}<subtext>Forget Power</subtext></energy-track-ring>";
                        break;
                    case 'push':
                        var matches = regExp.exec(splitOptions[0]);
                        var pushTarget = matches[1];
                        energyHTML += "<energy-track><card-play-special><icon class='"+energyOption+"'><icon class='"+pushTarget+"'></icon></icon></card-play-special><subtext>Push "+pushTarget+"</subtext></energy-track>";
                        break;    
                    case 'move-presence':
                        var matches = regExp.exec(splitOptions[0]);
                        var moveRange = matches[1];
                        energyHTML += "<energy-track><card-play-special>{"+energyOption+"-"+moveRange+"}</card-play-special><subtext>Move a Presence "+moveRange+"</subtext></energy-track>";
                        break;
                    default:
                        energyHTML += "<energy-track>{"+splitOptions[0]+"}<subtext>"+splitOptions[0].charAt(0).toUpperCase() + splitOptions[0].slice(1)+"</subtext></energy-track>";
                        break;
                }
            } else {
                //It's a mix of things
                if(!isNaN(splitOptions[0])){
                    //It's a mix of energy and element
                    energyHTML += "<energy-track-ring><energy-top><value>"+splitOptions[0]+"</value></energy-top><element-bottom><icon class='"+splitOptions[1]+"'></icon></element-bottom><subtext>"+splitOptions[0]+", "+splitOptions[1].charAt(0).toUpperCase() + splitOptions[1].slice(1)+"</subtext></energy-track-ring>";
                } else {
                    //It's a mix of elements
                    energyHTML += "<energy-track><element-combination><element-top><icon class='"+splitOptions[0]+"'></icon></element-top><element-bottom><icon class='"+splitOptions[1]+"'></icon></element-bottom></element-combination><subtext>"+splitOptions[0].charAt(0).toUpperCase() + splitOptions[0].slice(1)+", "+splitOptions[1].charAt(0).toUpperCase() + splitOptions[1].slice(1)+"</subtext></energy-track>";
                }
            }
        }
    }
    fullHTML = '<presence-track-image></presence-track-image><energy-track-table>'+energyHTML+'</energy-track-table>';
    document.getElementsByTagName("energy-track")[0].removeAttribute("values");
    return fullHTML;
}

function parseCardPlayTrackTags(){
    var fullHTML = "";
    var cardPlayHTML = "";
    
    var cardPlayValues = document.getElementsByTagName("card-play-track")[0].getAttribute("values");

    var cardPlayOptions = cardPlayValues.split(",");

    //Find values between parenthesis
    var regExp = /\(([^)]+)\)/;

    for(i = 0; i < cardPlayOptions.length; i++){
        if(!isNaN(cardPlayOptions[i])){
            //The energy option is only a number
            if(i == 0){
                cardPlayHTML += "<card-play-track-initial><card-play><value>"+cardPlayOptions[i]+"</value></card-play></card-play-track-initial>";
            } else {
                cardPlayHTML += "<card-play-track><card-play><value>"+cardPlayOptions[i]+"</value></card-play><subtext>"+cardPlayOptions[i].charAt(0).toUpperCase() + cardPlayOptions[i].slice(1)+"</subtext></card-play-track>";
            }
        } else {
            //It is either a single element or a mix of elements/numbers
            var splitOptions = cardPlayOptions[i].split("+");

            if(splitOptions.length == 1){
                //It's just a single item
                var cardPlayOption = splitOptions[0].split("(")[0];
                switch(cardPlayOption){
                    case 'reclaim-one':
                        cardPlayHTML += "<card-play-track><card-play-special>{"+splitOptions[0]+"}</card-play-special><subtext>Reclaim One</subtext></card-play-track>";
                        break;
                    case 'forget-power-card':
                        cardPlayHTML += "<card-play-track><card-play-special>{"+splitOptions[0]+"}</card-play-special><subtext>Forget Power</subtext></card-play-track>";
                        break;    
                    case 'push':
                        var matches = regExp.exec(splitOptions[0]);
                        var pushTarget = matches[1];
                        cardPlayHTML += "<card-play-track><card-play-special><icon class='"+cardPlayOption+"'><icon class='"+pushTarget+"'></icon></icon></card-play-special><subtext>Push "+pushTarget+"</subtext></card-play-track>";
                        break;    
                    case 'move-presence':
                        var matches = regExp.exec(splitOptions[0]);
                        var moveRange = matches[1];
                        cardPlayHTML += "<card-play-track><card-play-special>{"+cardPlayOption+"-"+moveRange+"}</card-play-special><subtext>Move a Presence "+moveRange+"</subtext></card-play-track>";
                        break;
                    default:
                        cardPlayHTML += "<card-play-track><card-play-special><icon class='"+splitOptions[0]+"'></icon></card-play-special><subtext>"+splitOptions[0].charAt(0).toUpperCase() + splitOptions[0].slice(1)+"</subtext></card-play-track>";
                        break;
                }
            } else {
                //Multiple items
                if(!isNaN(splitOptions[0])){
                    //It's a mix of energy and element
                    var subText = splitOptions[1].charAt(0).toUpperCase() + splitOptions[1].slice(1);
                    if(splitOptions[1] == 'reclaim-one'){
                        subText = "Reclaim One";
                    }
                    cardPlayHTML += "<card-play-track><card-play-top><value>"+splitOptions[0]+"</value></card-play-top><element-bottom><icon class='"+splitOptions[1]+"'></icon></element-bottom><subtext>"+splitOptions[0]+", "+subText+"</subtext></card-play-track>";
                } else {
                    //It's a mix of elements and potentially something else
                    var subText = splitOptions[1].charAt(0).toUpperCase() + splitOptions[1].slice(1);
                    if(splitOptions[1] == 'reclaim-one'){
                        subText = "Reclaim One";
                    }
                    cardPlayHTML += "<card-play-track><element-combination><element-top><icon class='"+splitOptions[0]+"'></icon></element-top><element-bottom><icon class='"+splitOptions[1]+"'></icon></element-bottom></element-combination><subtext>"+splitOptions[0].charAt(0).toUpperCase() + splitOptions[0].slice(1)+", "+subText+"</subtext></card-play-track>";
                }
            }
        }
    }
    fullHTML = '<card-play-track-table>'+cardPlayHTML+'</card-play-track-table>';
    document.getElementsByTagName("card-play-track")[0].removeAttribute("values");
    return fullHTML;
}

function setNewEnergyCardPlayTracks(energyHTML, cardPlayHTML){
    document.getElementsByTagName("presence-tracks")[0].innerHTML = "<section-title>Presence</section-title>"+energyHTML + cardPlayHTML;
}

function dynamicCellWidth() {
    growthCells =  document.getElementsByTagName("growth-cell");
    growthCellCount = growthCells.length;

    growthBorders = document.getElementsByTagName("growth-border");
    growthBorderCount = growthBorders.length;

    /* Borders = 7px */
    /* Table width: 1050px */

    borderPixels = growthBorderCount*7;

    growthTable = document.getElementsByTagName("growth-table");
    growthTableStyle = window.getComputedStyle(growthTable[0]);
    growthTableWidth = growthTableStyle.getPropertyValue('width');

    remainingCellWidth = (parseInt(growthTableWidth.replace(/px/,""))-borderPixels)+"px";
    equalCellWidth = (parseFloat(remainingCellWidth.replace(/px/,""))/growthCellCount)+"px";

    for (i = 0; i < growthCells.length; i++){
        growthCells[i].style.maxWidth = equalCellWidth;
        growthCells[i].style.width = equalCellWidth;

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

function replaceIcon(html)
{
  var result = html;

  var regEx = new RegExp('(\\{[^\\}]*\\})', "ig");
  var matchs = result.match(regEx);
  for(var match of (matchs || []))
  {
    var iconName = match.replace('{', '').replace('}', '');
    var iconHtml = `<icon class="${iconName}"></icon>`;
    result = result.replace(new RegExp(match, "ig"), iconHtml);
  }

  return result;
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