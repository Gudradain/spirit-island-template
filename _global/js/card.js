var quickCards = document.querySelectorAll('quick-card');

for(var quickCard of quickCards)
{
  var data = getData(quickCard);
  var card = constructCard(data);
  insertAfter(card, quickCard);
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
    <info-title-target>TARGET LAND</info-title-target>
  </info-title>

  <info>
    <info-speed></info-speed>
    <info-range>
      <!--<range>0</range>-->
    </info-range>
    <info-target>
      <!--<icon class="sand"></icon>-->
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

  threshold.innerHTML = `
  <threshold-line></threshold-line>
  <threshold-title>IF YOU HAVE</threshold-title>
  <threshold-condition>
    ${getThresholdElements(threshold)}:
  </threshold-condition>
  ${threshold.innerHTML}
  `;
  
  console.log(threshold);
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
  return rangeString;
}

function getTargetModel(targetString)
{
  return targetString;
}

function insertAfter(newNode, referenceNode){
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function replaceIcon(html)
{
  var result = html;

  var tags = {
    '{explorer}': '<icon class="explorer"></icon>',
    '{town}': '<icon class="town"></icon>',
    '{fear}': '<icon class="fear"></icon>',
    '{dahan}': '<icon class="dahan"></icon>'
  };

  for(var tagName of Object.keys(tags))
  {
    var regEx = new RegExp(tagName, "ig");
    result = result.replace(regEx, tags[tagName]);
  }

  return result;
}