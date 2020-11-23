window.onload = function startMain(){
    var html = document.querySelectorAll('board')[0].innerHTML;
    document.querySelectorAll('board')[0].innerHTML = replaceIcon(html);
    adjustComplexityValue();
    createPowerProperties();
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

function adjustComplexityValue() {
    var complexityValue = document.getElementsByTagName("complexity-value")[0].getAttribute("value");
    console.log(complexityValue);
    //add 45px for each value
    var basePixels = 120;
    var addedPixels = (complexityValue*45);
    var totalPixels = basePixels+addedPixels+"px";
    console.log(totalPixels);
    document.getElementsByTagName("complexity-value")[0].style.width = totalPixels;
}

function adjustPowerValue(tag, value) {
    var basePixels = 15;
    var addedPixels = (value*15);
    var totalPixels = basePixels+addedPixels+"px";
    console.log(totalPixels);
    tag.style.height = totalPixels;
}

function createPowerProperties(){
    var offenseTag = document.getElementsByTagName("offense-value")[0];
    var controlTag = document.getElementsByTagName("control-value")[0];
    var fearTag = document.getElementsByTagName("fear-value")[0];
    var defenseTag = document.getElementsByTagName("defense-value")[0];
    var utilityTag = document.getElementsByTagName("utility-value")[0];

    var offenseValue = offenseTag.getAttribute("value");
    var controlValue = controlTag.getAttribute("value");
    var fearValue = fearTag.getAttribute("value");
    var defenseValue = defenseTag.getAttribute("value");
    var utilityValue = utilityTag.getAttribute("value");

    adjustPowerValue(offenseTag, offenseValue);
    adjustPowerValue(controlTag, controlValue);
    adjustPowerValue(fearTag, fearValue);
    adjustPowerValue(defenseTag, defenseValue);
    adjustPowerValue(utilityTag, utilityValue);
}
