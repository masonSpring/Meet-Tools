chrome.storage.sync.get({
  autorecord: false
}, function (items) {
  autorecord = items.autorecord;
});

function getFormattedTime() {
  var today = new Date();
  var y = today.getFullYear();
  // JavaScript months are 0-based.
  var m = today.getMonth() + 1;
  var d = today.getDate();
  var h = today.getHours();
  var mi = today.getMinutes();
  var s = today.getSeconds();
  return y + "-" + m + "-" + d + "-" + h + "-" + mi + "-" + s;
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message == "record") {
    if (autorecord) {
      record();
    } else {
      chrome.pageAction.show(sender.tab.id);
      chrome.pageAction.onClicked.addListener(function (tab) {
        if (sender.tab.id == tab.id) {
          record();
          chrome.pageAction.hide(sender.tab.id);
        }
      });
    }
  }
  if (message == "muted") {
    receiver.micEnabled.getAudioTracks()[0].enabled = false;
  }
  if (message == "unmuted") {
    receiver.micEnabled.getAudioTracks()[0].enabled = true;
  }
  if (message == "end") {
    receiver.shutdownReceiver();
  }
  if (message == "download") {
    chrome.downloads.download({
      url: receiver.url,
      filename: getFormattedTime() + ".webm" // Optional
    });
  }
});

var receiver = null;

function playCapturedStream(stream) {
  if (!stream) {
    console.error('Error starting tab capture: ' +
    (chrome.runtime.lastError.message || 'UNKNOWN'));
    return;
  }
  if (receiver != null) {
    receiver = null;
  }
  receiver = window.open('receiver.html');
  receiver.currentStream = stream;
}

function record() {
  chrome.tabCapture.capture({
    video: true, audio: true,
    videoConstraints: {
      mandatory: {
        // If minWidth/Height have the same aspect ratio (e.g., 16:9) as
        // maxWidth/Height, the implementation will letterbox/pillarbox as
        // needed. Otherwise, set minWidth/Height to 0 to allow output video
        // to be of any arbitrary size.
        minWidth: 16,
        minHeight: 9,
        maxWidth: screen.width,
        maxHeight: screen.height,
        maxFrameRate: 30,  // Note: Frame rate is variable (0 <= x <= 60).
      },
    },
  },
  playCapturedStream)
}
