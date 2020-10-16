var quickCards = document.querySelectorAll('quick-card');

for(var quickCard of quickCards)
{
  var data = getData(quickCard);
  var card = constructCard(data);
  insertAfter(card, quickCard);
  quickCard.remove();
}

function constructCard(data)
{
  var card = document.createElement('card');
  card.className = data.speed;
  card.innerHTML = `
  <img class="image" src=${data.image} />
  <cost>${data.cost}</cost>
  <name>${data.name}</name>
  
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

function setThreshold(card)
{
  var threshold = card.querySelector('threshold');

  if(threshold){
    threshold.innerHTML = `
    <threshold-line></threshold-line>
    <threshold-title>IF YOU HAVE</threshold-title>
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
  for(var condition of conditions.split(','))
  {
    var number = condition.split('-')[0];
    var element = condition.split('-')[1];
    result += `${number}<icon class="${element}"></icon>`;
  }

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
    innerHTML: getRulesHTML(quickCard.innerHTML)
  };
}

function getRulesHTML(html)
{
  var result = replaceIcon(html);
  return result;
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