function muteCheck() {
  if (document.getElementsByClassName("U26fgb JRY2Pb mUbCce kpROve uJNmj A00RE M9Bg4d HNeRed")[0] != undefined) {
    chrome.runtime.sendMessage({unmuted: true});
  } else {
    chrome.runtime.sendMessage({muted: true});
  }
  setTimeout(muteCheck, 1000);
}

function endCheck() {
  if (document.getElementsByClassName("CRFCdf")[0] != undefined) {
    chrome.runtime.sendMessage("end");
  } else {
    setTimeout(endCheck, 1000);
  }
}


function checkForMeet() {
  if (document.getElementsByClassName("I98jWb")[0] != undefined) {
    chrome.runtime.sendMessage("record");
    muteCheck();
    endCheck();
  } else {
    setTimeout(checkForMeet, 1000);
  }
}

checkForMeet();
