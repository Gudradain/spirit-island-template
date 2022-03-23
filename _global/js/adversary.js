window.onload = function startMain(){
	quickAdversary = document.querySelectorAll('quick-adversary')[0];
	console.log(quickAdversary)
	if (quickAdversary){
		var adversary = document.createElement('adversary');
		adversary.innerHTML = buildAdversary(quickAdversary)
		quickAdversary.parentNode.insertBefore(adversary, quickAdversary.nextSibling);
		quickAdversary.remove()
	}
	
	var html = document.querySelectorAll('adversary')[0].innerHTML;
    document.querySelectorAll('adversary')[0].innerHTML = replaceIcon(html);
}

function buildAdversary(quickAdversary) {
adversaryName = quickAdversary.getAttribute('name')
flagImage = quickAdversary.getAttribute('flag-image')
baseDifficulty = quickAdversary.getAttribute('base-difficulty')

lossCondition = quickAdversary.querySelectorAll('loss-condition')[0]
escalation = quickAdversary.querySelectorAll('escalation-effect')[0]

levels = quickAdversary.querySelectorAll('level')

html = `
    <adversary-title>${adversaryName}</adversary-title>
    <img class="flag" src="${flagImage}" />
    <adversary-base-dif>BASE DIFFICULTY ${baseDifficulty}</adversary-base-dif>
    <top-info>
      <loss-condition>
        <section-title>Additional Loss Condition</section-title>
        <div>
          <strong>${lossCondition.getAttribute('name')}:</strong> ${lossCondition.getAttribute('rules')}
        </div>
      </loss-condition>
      <escalation>
        <section-title>Escalation<icon class="escalation"></icon></section-title>
        <div>
          <strong>${escalation.getAttribute('name')}:</strong> ${escalation.getAttribute('rules')}
        </div>
      </escalation>
    </top-info>
    <adversary-levels>
      <header>
        <div>Level</div>
        <div>Fear Cards</div>
        <div>Game Effects <span class="cumulative">(cumulative)</span></div>
      </header>`;

		html+= buildLevel(quickAdversary.querySelectorAll('level-1')[0])
		html+=`<line></line>`
		html+= buildLevel(quickAdversary.querySelectorAll('level-2')[0])
		html+=`<line></line>`
		html+= buildLevel(quickAdversary.querySelectorAll('level-3')[0])
		html+=`<line></line>`
		html+= buildLevel(quickAdversary.querySelectorAll('level-4')[0])
		html+=`<line></line>`
		html+= buildLevel(quickAdversary.querySelectorAll('level-5')[0])
		html+=`<line></line>`
		html+= buildLevel(quickAdversary.querySelectorAll('level-6')[0])

    html+=`</adversary-levels>`

	return html
}

function buildLevel(quickLevel){
	console.log(quickLevel)
	
	fearCards = quickLevel.getAttribute('fear-cards')
	fearCardList = fearCards.split(",");
	if(!fearCardList[1]){
		fearCardList = fearCards.split("/");
	}
	let fearCardNum = 0;
	for (var i = 0; i < fearCardList.length; i++) {
	  fearCardNum += parseInt(fearCardList[i]);
	}
	console.log(fearCards)
	fearCards=fearCardList.join('/')
	console.log(fearCards)
    levelHTML =`<level>
        <div>${quickLevel.tagName.at(-1)}<span class="level-difficulty">(${quickLevel.getAttribute('difficulty')})</span></div>
        <div>${fearCardNum} (${fearCards})</div>
        <div>
          <strong>${quickLevel.getAttribute('name')}:</strong> ${quickLevel.getAttribute('rules')}
        </div>
      </level>`
	console.log(levelHTML)
return levelHTML
}

function getData(quickAdversary)
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