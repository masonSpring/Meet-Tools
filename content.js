chrome.storage.sync.get({ // Get all relevant settings. 
  automute: true,
  autojoin: true,
  refreshInterval: "",
  autoleave: true,
  autobreakout: true
}, function (items) {
  automute = items.automute;
  autojoin = items.autojoin;
  refreshInterval = items.refreshInterval;
  autoleave = items.autoleave;
  autobreakout = items.autobreakout;
});

function meetTools(oldCount) { // Checks current status of Meet.
  if (document.getElementsByClassName("VfPpkd-Bz112c-LgbsSe fzRBVc tmJved xHd4Cb rmHNDe Qr8aE")[0] == undefined) { // Does the "show/hide captions" button not exist? If so, meet is not joined. (updated for new UI)
    if (document.getElementsByClassName("FayWyb")[0] != undefined) { // Does prompt for old UI exist?
      document.getElementsByClassName("FayWyb")[0].remove() // Remove prompt for old UI
    }
    if (document.getElementsByClassName("VfPpkd-vQzf8d")[0] != undefined) { // Does the "Refresh" exist? If so then the meet does not yet exist. (same for new UI)
      setTimeout(function () { // Refresh the page after waiting a certain amount of time (set in settings).
        location.reload();
      }, refreshInterval)
    } else if ((document.getElementsByClassName("CRFCdf")[0] != undefined) && !(document.getElementsByClassName("roSPhc")[0].innerHTML.includes("You left the meeting"))) { // Does the text for "Meet not started" exist? Also checks to see if user left meet manually. (second class updated)
      setTimeout(function () { // Refresh the page after waiting a certain amount of time (set in settings).
        location.reload();
      }, refreshInterval)
    } else { // Meet exists but is not yet joined.
      try {

        let possibleJoinButton = document.getElementsByClassName("NPEfkd RveJvd snByac"); // Finds the possiblities for a "Join" button. (same for new UI)
        joinLoop:
        for (i = 0; i < possibleJoinButton.length; i++) { // Checks each possibility to see if it is actually a "Join" button.
          if (possibleJoinButton[i].innerHTML == "Join now") { // Found "Join" button. Join page fully loaded.

            if (autojoin) { // Is autojoin enabled?
              chrome.runtime.sendMessage({ // Tell background script to focus tab.
                focusThis: true
              });
            }

            if (document.getElementsByClassName("sUZ4id")[1].innerHTML.includes("Turn on") == false && automute == true) { // Is automute enabled? Find mute button. (same for new UI)
              console.log("Automuting...")
              document.getElementsByClassName("I5fjHe wb61gb")[0].click() // Click mute button. (same for new UI)
            }

            if (document.getElementsByClassName("sUZ4id")[1].innerHTML.includes("Turn on") == false && automute == true) { // Is automute enabled? Find camera button. (same for new UI)
              console.log("Auto-disabling camera...")
              document.getElementsByClassName("I5fjHe wb61gb")[1].click() // Click camera button. (same for new UI)
            }

            if (autojoin) { // Is autojoin enabled?
              console.log("Autojoining...")
              possibleJoinButton[i].click(); // Click join button.
            }

            break joinLoop; // Don't keep looking for buttons.
          }
        }
        setTimeout(meetTools, 1000) // No join button found or autojoin is disabled, recheck in a second.
      } catch (error) {
        setTimeout(meetTools, 1000);
      }
    }
  } else { // Meet is active.
    if (document.getElementsByClassName("Q8K3Le")[0].innerHTML.includes("Turn on captions")) { // Find button to turn on captions. (updated for new UI)
      console.log("Auto enabling captions...")
      document.getElementsByClassName("VfPpkd-Bz112c-LgbsSe fzRBVc tmJved xHd4Cb rmHNDe Qr8aE")[0].click() // Turn on captions. (updated for new UI)
    }

    //check for breakout
    if (document.getElementsByClassName("PNenzf").length > 0 && autobreakout == true) { //if popup box exists
      for (x = 0; x < document.getElementsByClassName("RveJvd snByac").length; x++) { //Iterates through list of clickable buttons
        if (document.getElementsByClassName("RveJvd snByac")[x].innerText.includes("Join") || document.getElementsByClassName("RveJvd snByac")[x].innerText.includes("Return to the main call")) { //if button is "Join" or "Return to main call"
          document.getElementsByClassName("RveJvd snByac")[x].click() //click on the button
        }
      }
    }

    var newCount = parseInt(document.getElementsByClassName('uGOf1d')[0].innerText) // Get current person count (updated for new UI)
    if (((newCount < oldCount - 3 || newCount <= oldCount * 0.75) && document.getElementsByClassName("ihVAlc").length < 1 && document.getElementsByClassName("PNenzf").length < 1) && autoleave == true) { // Autoleave logic: If 4 people or 1/4 of the meet leave, then leave. (If breakout rooms not in session)
      console.log("Autoleaving...")
      chrome.runtime.sendMessage({ // Tell background script to close tab.
        closeThis: true
      });
      document.getElementsByClassName("VfPpkd-Bz112c-LgbsSe yHy1rc eT1oJ tWDL4c jh0Tpd Gt6sbf QQrMi ftJPW")[0].click() // Fallback to click disconnect button if tab does not close.
    } else { // It is not time to leave yet.
      setTimeout(meetTools, 3000, newCount); // Check every 3 seconds.
    }
  }
}

window.addEventListener('load', function () { // On page load, start main function after 1 second.
  setTimeout(meetTools, 1000);
}, false);
