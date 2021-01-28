chrome.storage.sync.get({ // Get all relevant settings. 
  automute: true,
  autojoin: true,
  refreshInterval: ""
}, function (items) {
  automute = items.automute;
  autojoin = items.autojoin;
  refreshInterval = items.refreshInterval;
});

function meetTools(oldCount) { // Checks current status of Meet.
  if (document.getElementsByClassName("I98jWb")[0] == undefined) { // Does the "show/hide captions" button not exist? If so, meet is not joined.
    if (document.getElementsByClassName("VfPpkd-vQzf8d")[0] != undefined) { // Does the "Refresh" button exist? If so then the meet does not yet exist.
      setTimeout(function () { // Click the "Refresh" button after waiting a certain amount of time (set in settings).
        document.getElementsByClassName("VfPpkd-vQzf8d")[0].click();
      }, refreshInterval)
    } else { // Meet exists but is not yet joined.
      try {

        let possibleJoinButton = document.getElementsByClassName("NPEfkd RveJvd snByac"); // Finds the possiblities for a "Join" button.
        joinLoop:
          for (i = 0; i < possibleJoinButton.length; i++) { // Checks each possibility to see if it is actually a "Join" button.
            if (possibleJoinButton[i].innerHTML == "Join now") { // Found "Join" button. Join page fully loaded.

              chrome.runtime.sendMessage({ // Tell background script to focus tab.
                focusThis: true
              });

              if (document.getElementsByClassName("sUZ4id")[0].innerHTML.includes("Turn on") == false && automute == true) { // Is automute enabled? Find mute button.
                console.log("Automuting...")
                document.getElementsByClassName("I5fjHe wb61gb")[0].click() // Click mute button.
              }

              if (document.getElementsByClassName("sUZ4id")[1].innerHTML.includes("Turn on") == false && automute == true) { // Is automute enabled? Find camera button.
                console.log("Auto-disabling camera...")
                document.getElementsByClassName("I5fjHe wb61gb")[1].click() // Click camera button.
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
    if (document.getElementsByClassName("I98jWb")[0].innerText != "Turn off captions") { // Find button to turn on captions.
      console.log("Auto enabling captions...")
      document.getElementsByClassName("I98jWb")[0].click() // Turn on captions.
    }

    //check for breakout
    if (document.getElementsByClassName("PNenzf").length > 0) { //if popup box exists
      for (x = 0; x < document.getElementsByClassName("RveJvd snByac").length; x++){ //Iterates through list of clickable buttons
                if (document.getElementsByClassName("RveJvd snByac")[x].innerText.includes("Join") || document.getElementsByClassName("RveJvd snByac")[x].innerText.includes("Return to the main call")) { //if button is "Join" or "Return to main call"
                    document.getElementsByClassName("RveJvd snByac")[x].click() //click on the button
                }
        }
      }

      var newCount = parseInt(document.getElementsByClassName('wnPUne N0PJ8e')[0].innerText) // Find current number of members in meet.
      if (newCount < oldCount - 3 || newCount <= oldCount * 0.75 && document.getElementsByClassName("ihVAlc").length < 1) { // Autoleave logic: If 4 people or 1/4 of the meet leave, then leave. (If breakout rooms not in session)
        console.log("Autoleaving...")
        chrome.runtime.sendMessage({ // Tell background script to close tab.
          closeThis: true
        });
        document.getElementsByClassName("I5fjHe wb61gb")[1].click() // Fallback to click disconnect button if tab does not close.
      } 
      else { // It is not time to leave yet.
        setTimeout(meetTools, 3000, newCount); // Check every 3 seconds.
      }
    }
  }

  window.addEventListener('load', function () { // On page load, start main function after 1 second.
    setTimeout(meetTools, 1000);
  }, false);