function muteCheck() { // Check if user is muted or not.
  if (document.getElementsByClassName("U26fgb JRY2Pb mUbCce kpROve uJNmj A00RE M9Bg4d HNeRed")[0] != undefined) { // Does "Mute" button exist?
    chrome.runtime.sendMessage({ unmuted: true }); // Tell recorderHandler that user is unmuted.
  } else { // "Mute" button does not exist.
    chrome.runtime.sendMessage({ muted: true }); // Tell recorderHandler that user is muted.
  }
  setTimeout(muteCheck, 250); // Check every quarter of a second.
}

function endCheck() { // Check to see if meet is disconnected.
  if (document.getElementsByClassName("CRFCdf")[0] != undefined) { // Check for meet end text.
    chrome.runtime.sendMessage({ end: true }); // Tell recorderHandler that meet is over.
    checkForMeet(); // Start checking for meet again.
  } else {
    setTimeout(endCheck, 1000); // Check every second.
  }
}

function checkForMeet() { // Check to see if meet is active.
  if (document.getElementsByClassName("I98jWb")[0] != undefined) { // Does caption button exist?
    chrome.runtime.sendMessage({ record: true }); // Start recording.
    muteCheck(); // Start checking for mute status.
    endCheck(); // Start checking for meet end status.
  } else { // Meet is not active.
    setTimeout(checkForMeet, 1000); // Check again in a second.
  }
}

checkForMeet(); // Start checking if meet is active.
