function muteCheck() { // Check if user is muted or not.
  if (document.getElementsByClassName("VfPpkd-Bz112c-LgbsSe yHy1rc eT1oJ tWDL4c uaILN Wsh1sb qIiG8c HNeRed")[0] != undefined) { // Does "Mute" button exist? (updated for new UI)
    chrome.runtime.sendMessage({ unmuted: true }); // Tell recorderHandler that user is unmuted.
  } else { // "Mute" button does not exist.
    chrome.runtime.sendMessage({ muted: true }); // Tell recorderHandler that user is muted.
  }
  setTimeout(muteCheck, 250); // Check every quarter of a second.
}

function endCheck() { // Check to see if meet is disconnected.
  if (document.getElementsByClassName("roSPhc")[0] != undefined) { // Check for meet end text. (updated for new UI)
    chrome.runtime.sendMessage({ end: true }); // Tell recorderHandler that meet is over.
    checkForMeet(); // Start checking for meet again.
  } else {
    setTimeout(endCheck, 1000); // Check every second.
  }
}

function checkForMeet() { // Check to see if meet is active.
  if (document.getElementsByClassName("VfPpkd-Bz112c-LgbsSe fzRBVc tmJved xHd4Cb rmHNDe Qr8aE")[0] != undefined) { // Does caption button exist? (updated for new UI)
    chrome.runtime.sendMessage({ record: true }); // Start recording.
    muteCheck(); // Start checking for mute status.
    endCheck(); // Start checking for meet end status.
  } else { // Meet is not active.
    setTimeout(checkForMeet, 1000); // Check again in a second.
  }
}

checkForMeet(); // Start checking if meet is active.
