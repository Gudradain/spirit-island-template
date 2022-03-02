var quickCards = document.querySelectorAll('quick-card');

window.onload = function startMain(){
    const cards = document.querySelectorAll('card');
    
	for (i = 0; i < cards.length; ++i) {
		cards[i].innerHTML = replaceIcon(cards[i].innerHTML);
	}

}

for(var quickCard of quickCards)
{
  var data = getData(quickCard);
  var card = constructCard(data);
  insertAfter(card, quickCard);
  quickCard.remove();
}

dynamicSizing()



function constructCard(data)
{
  var card = document.createElement('card');
  card.className = data.speed;
  card.innerHTML = `
  <img class="image" src=${data.image} />
  <cost>${data.cost}</cost>
  <name>${data.name}</name>
  
  ${data.printFriendly ? '<element-background></element-background>' : ''}

  ${getElementHtml(data.elements)}

  <info-title>
    <info-title-speed>SPEED</info-title-speed>
    <info-title-range>RANGE</info-title-range>
    <info-title-target>${data.targetTitle}</info-title-target>
  </info-title>

  <info>
    <info-speed></info-speed>
    <info-range>
      ${data.range}
    </info-range>
    <info-target>
      ${data.target}
    </info-target>
  </info>

  <rules-container>
    ${data.innerHTML}
  </rules-container>

  <artist-name>${data.artistName}</artist-name>
  `;

  setThreshold(card);
  return card;
}

function dynamicSizing()
{
	//Name
	nameBlocks = document.querySelectorAll("name");
	for(let i = 0; i < nameBlocks.length; i++){
		let nameHeight = nameBlocks[i].offsetHeight;
		let j = 0
		while (nameHeight>70){
			var style = window.getComputedStyle(nameBlocks[i], null).getPropertyValue('font-size');
			var fontSize = parseFloat(style); 
			nameBlocks[i].style.fontSize = (fontSize - 2) + 'px';
			nameHeight = nameBlocks[i].offsetHeight
			
			// safety valve
			j += 1
			if (j>5){ break;}
		}
	}
}

function setThreshold(card)
{
  var threshold = card.querySelector('threshold');

  if(threshold){
    threshold.innerHTML = `
    <threshold-condition>
      ${getThresholdElements(threshold)}:
    </threshold-condition>
    ${threshold.innerHTML}
    `;
  }
}

function getThresholdElements(threshold)
{
  var result = '';

  var conditions = threshold.getAttribute('condition');
  var condition = conditions.split(',');
  for (let i = 0; i < condition.length; i++){
    var number = condition[i].split('-')[0];
    var element = condition[i].split('-')[1];
	result += `${number}<icon class="${element}"></icon>`;
	if (i < condition.length-1){
		result += "<div style='width:10px; height:1px; display:inline-block'></div>"
	}
  }
  /* for(var condition of conditions.split(','))
  {
    var number = condition.split('-')[0];
    var element = condition.split('-')[1];
    result += `${number}<icon class="${element}"></icon>`;
  } */

  return result;
}

function getElementHtml(elements)
{
  var result = '';
  for(var element of elements)
  {
    result += `<element class="${element}"></element>`;
  }

  return result;
}

function getData(quickCard)
{
  return {
    speed: quickCard.getAttribute("speed"),
    cost: quickCard.getAttribute("cost"),
    name: quickCard.getAttribute("name"),
    image: quickCard.getAttribute("image"),
    elements: (quickCard.getAttribute("elements") || '').split(','),
    range: getRangeModel(quickCard.getAttribute("range")),
    target: getTargetModel(quickCard.getAttribute("target")),
    targetTitle: quickCard.getAttribute("target-title") || 'TARGET LAND',
    artistName: quickCard.getAttribute("artist-name"),
    printFriendly: quickCard.getAttribute('print-friendly') === 'yes',
    innerHTML: getRulesNew(quickCard)
  };

}

/* function getRulesHTML(html)
{
  var result = replaceIcon(html);
  return result;
} */

function getRulesNew(quickCard)
{
  var rules = quickCard.querySelectorAll('rules')[0]
  ruleLines = rules.innerHTML.split("\n")
  rulesHTML = "<rules>";
  for (let i = 0; i < ruleLines.length; i++) {
	  if(ruleLines[i]){
		rulesHTML += "<div>"+ruleLines[i]+"</div>"
	  }else if(i>0){
		  rulesHTML += "<br>"
		  // allows user's line breaks to show up on the card
	  }
  }
  rulesHTML += "</rules>"

  var threshold = quickCard.querySelectorAll('threshold')[0]
  console.log("threshold? ="+threshold)
  console.log(threshold)
  console.log(quickCard.querySelectorAll('threshold'))
  thresholdInner = ""
  if(threshold){
	  thresholdLines = threshold.innerHTML.split("\n")
	  console.log(thresholdLines)
	  for (let i = 0; i < thresholdLines.length; i++) {
		  if(thresholdLines[i]){
			thresholdInner += "<div>"+thresholdLines[i]+"</div>"
		  }
	  }
	  threshold.innerHTML = thresholdInner
	  rulesHTML += threshold.outerHTML
  }
  return rulesHTML
}

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

function getTargetModel(targetString)
{
  return replaceIcon(targetString);
}

function insertAfter(newNode, referenceNode){
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

