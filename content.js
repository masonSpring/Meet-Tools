chrome.storage.sync.get({
    automute: true,
    autojoin: true
  }, function(items) {
    automute = items.automute;
    autojoin = items.autojoin;
  });

function meetTools(oldCount) {
    if (document.getElementsByClassName("I98jWb")[0] == undefined) {
        if(document.getElementsByClassName("sUZ4id")[0].innerHTML.includes("Turn on") == false && automute == true){
            document.getElementsByClassName("I5fjHe wb61gb")[0].click()
        }
        if(document.getElementsByClassName("sUZ4id")[1].innerHTML.includes("Turn on") == false && automute == true){
            document.getElementsByClassName("I5fjHe wb61gb")[1].click()
        }
        if(autojoin == true){
        document.getElementsByClassName("e19J0b CeoRYc")[0].click();
    }
        setTimeout(function () {
            meetTools(0);
        }, 1000)

    }
    else{
        if(document.getElementsByClassName("I98jWb")[0].innerText != "Turn off captions"){
            document.getElementsByClassName("I98jWb")[0].click()
        }
        var newCount = parseInt(document.getElementsByClassName('wnPUne N0PJ8e')[0].innerText)
        console.log(oldCount,newCount)
        if (newCount < oldCount - 5 || newCount <= oldCount / 2) {
            console.log("Close!")
            chrome.runtime.sendMessage({closeThis: true});
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