function replaceIcon(html) {
  var result = html;

  var regEx = new RegExp('(\\{[^\\}]*\\})', "ig");
  var matchs = result.match(regEx);
  for (var match of (matchs || [])) {
    var iconName = match.replace('{', '').replace('}', '');
    var iconNamePieces = iconName.split(",");
    let elementCount = "";
    let elementCountText = "";
    if (iconNamePieces[1]) {
      iconName = iconNamePieces[0];
      elementCount = iconNamePieces[1];
      elementCountText += "<div class='element-for-each'><span>" + elementCount + "</span></div>";
    }

    let iconHtml
    iconHtml = elementCountText;
    if (iconName.startsWith('no-')) {
      iconHtml += `<icon class="no ${iconName.substring(3)}"></icon>`;
    } else {
      iconHtml += `<icon class="${iconName}"></icon>`;
    }
    result = result.replace(new RegExp(match, "ig"), iconHtml);
  }

  return result;
}

function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}

window.addEventListener('load', ev => {

  const root = document.body;

  const elements = new Array(...root.childNodes);

  const button = document.createElement('button');
  button.innerText = "Save"
  button.addEventListener('click', () => {
    elements.forEach(async element => {
      /**
       * @type HTMLCanvasElement
       */
      const canvas = await html2canvas(element);
      const data = canvas.toDataURL();
      downloadURI(data, "Spirit.png");

    });
  })

  root.insertBefore(button, root.firstChild);
});