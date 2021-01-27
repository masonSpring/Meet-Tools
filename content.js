chrome.storage.sync.get({
  automute: true,
  autojoin: true,
  refreshInterval: ""
}, function (items) {
  automute = items.automute;
  autojoin = items.autojoin;
  refreshInterval = items.refreshInterval;
});

function meetTools(oldCount) {
  if (document.getElementsByClassName("I98jWb")[0] == undefined) {
    if (oldCount == -1) {
      document.getElementsByClassName("VfPpkd-vQzf8d")[0].click();
    }
    // -1 oldCount means meet does not exist
    else if (document.getElementsByClassName("VfPpkd-vQzf8d")[0] != undefined) {
      setTimeout(function () {
        meetTools(-1);
      }, refreshInterval)
    } else {
      if (document.getElementsByClassName("sUZ4id")[0].innerHTML.includes("Turn on") == false && automute == true) {
        document.getElementsByClassName("I5fjHe wb61gb")[0].click()
      }
      if (document.getElementsByClassName("sUZ4id")[1].innerHTML.includes("Turn on") == false && automute == true) {
        document.getElementsByClassName("I5fjHe wb61gb")[1].click()
      }
      let possibleJoinButton = document.getElementsByClassName("NPEfkd RveJvd snByac");
      joinLoop:
      for (i = 0; i < possibleJoinButton.length; i++) {
        if (possibleJoinButton[i].innerHTML == "Join now") {
          if (autojoin == true) {
            possibleJoinButton[i].click();
            break joinLoop;
          }
        }
      }
      setTimeout(function () {
        meetTools(0);
      }, 1000)
    }
  } else {
    if (document.getElementsByClassName("I98jWb")[0].innerText != "Turn off captions") {
      document.getElementsByClassName("I98jWb")[0].click()
    }
    var newCount = parseInt(document.getElementsByClassName('wnPUne N0PJ8e')[0].innerText)
    console.log(oldCount, newCount)
    if (newCount < oldCount - 5 || newCount <= oldCount / 2) {
      console.log("Close!")
      chrome.runtime.sendMessage({
        closeThis: true
      });
      document.getElementsByClassName("I5fjHe wb61gb")[1].click()
    } else {
      setTimeout(function () {
        meetTools(newCount);
      }, 3000)
    }
  }
}
// Your code here...
window.addEventListener('load', function () {
  setTimeout(function () {
    meetTools(0);
  }, 1000)
}, false);
