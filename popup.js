function versionFromText(text) {
  var l = (new TextEncoder('utf-8').encode(text)).length;
  console.log('length=' + l);
  // Character max at 'L' correction level, with Kanji characters.
  // Might be set too low in pathological cases where Kanji and non-Kanji
  // characters interleave.
  var cutoff = [
    10,20,32,48,65,82,95,118,141,167,
    198,226,262,282,320,361,397,442,488,528,
    572,618,672,721,784,842,902,940,1002,1066,
    1132,1201,1273,1347,1417,1496,1577,1661,1729,1817];
  for (var i = 0; i < cutoff.length; i++) {
    if (l < cutoff[i]) {
      return i+1;
    }
  }
  return -1;
}

document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.executeScript( {
      code: "window.getSelection().toString();"
    }, function(selection) {
      if (selection) {
        var errorCorrectionLevel = 'L';
        var typeNumber = versionFromText(selection[0]);
        if (typeNumber > 0) {
	  var qr = qrcode(typeNumber, errorCorrectionLevel);
          qr.addData(selection[0]);
          qr.make();
          document.getElementById('code').innerHTML = qr.createImgTag();
	}
      }
    }
  );
});
