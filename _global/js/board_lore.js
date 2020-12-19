window.onload = function startMain(){
    var html = document.querySelectorAll('board')[0].innerHTML;
    document.querySelectorAll('board')[0].innerHTML = replaceIcon(html);
    adjustComplexityValue();
    createPowerProperties();
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

    var offenseTag = document.getElementsByClassName("offense")[0];
    var controlTag = document.getElementsByClassName("control")[0];
    var fearTag = document.getElementsByClassName("fear")[0];
    var defenseTag = document.getElementsByClassName("defense")[0];
    var utilityTag = document.getElementsByClassName("utility")[0];

    var offenseValue = offenseTag.getAttribute("value");
    var controlValue = controlTag.getAttribute("value");
    var fearValue = fearTag.getAttribute("value");
    var defenseValue = defenseTag.getAttribute("value");
    var utilityValue = utilityTag.getAttribute("value");

    offenseTag.style.height = (offenseValue * 14) + 'px';
    controlTag.style.height = (controlValue * 14) + 'px';
    fearTag.style.height = (fearValue * 14) + 'px';
    defenseTag.style.height = (defenseValue * 14) + 'px';
    utilityTag.style.height = (utilityValue * 14) + 'px';
}
