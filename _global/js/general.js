function replaceIcon(html)
{
  var result = html;

  var regEx = new RegExp('(\\{[^\\}]*\\})', "ig");
  var matchs = result.match(regEx);
  for(var match of (matchs || []))
  {
    var iconName = match.replace('{', '').replace('}', '');
    let iconHtml
    if(iconName.startsWith('no-')){
        iconHtml = `<icon class="no"><icon class="${iconName.substring(3)}"></icon></icon>`;
    }else{
        iconHtml = `<icon class="${iconName}"></icon>`;
    }
    result = result.replace(new RegExp(match, "ig"), iconHtml);
  }

  return result;
}

