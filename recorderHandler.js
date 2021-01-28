chrome.storage.sync.get({ // Get all relevant settings.
  autorecord: false
}, function (items) {
  autorecord = items.autorecord;
});

function getFormattedTime() { // Function to add times to filename
  var today = new Date();
  var y = today.getFullYear();
  var m = today.getMonth() + 1;
  var d = today.getDate();
  var h = today.getHours();
  var mi = today.getMinutes();
  var s = today.getSeconds();
  return y + "-" + m + "-" + d + "-" + h + "-" + mi + "-" + s;
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) { // Message Handler
  if (message.record) { // Ready to record
    if (autorecord) { // Is autorecord enabled?
      record(); // Start recording.
    } else {
      chrome.pageAction.show(sender.tab.id); // Active pageAction on Meet Tab
      chrome.pageAction.onClicked.addListener(function (tab) { // When page action is clicked:
        if (sender.tab.id == tab.id) { // If clicked page action is for the same tab:
          record(); // Start recording.
          chrome.pageAction.hide(sender.tab.id); // Hide pageAction.
        }
      });
    }
  }
  if (message.muted) { // Meet mic is muted
    if (receiver != null) { // If receiver page exists
      if (receiver.micEnabled != undefined) { // If micEnabled exists
        receiver.micEnabled.getAudioTracks()[0].enabled = false; // Disable mic stream.
      }
    }
  }
  if (message.unmuted) { // Meet mic is unmuted
    if (receiver != null) { // If receiver page exists
      if (receiver.micEnabled != undefined) { // If micEnabled exists
        receiver.micEnabled.getAudioTracks()[0].enabled = true; // Enable mic stream.
      }
    }
  }
  if (message.end) { // Meet is over.
    if (receiver != null) { // If receiver page exists.
      receiver.shutdownReceiver(); // Shutdown recording.
    }
  }
  if (message.download) { // Download file.
    chrome.downloads.download({ // Start download of blob URL as webm.
      url: receiver.url,
      filename: getFormattedTime() + ".webm"
    });
    URL.revokeObjectURL(receiver.url); // Revoke blob URL.
  }
});

var receiver = null; // Set receiver to null.

function playCapturedStream(stream) { // After recording has started open the receiver.
  if (!stream) { // If stream does not exist:
    console.error('Error starting tab capture: ' +
      (chrome.runtime.lastError.message || 'UNKNOWN'));
    return;
  }
  if (receiver != null) { // If reciever is not null, set it to null.
    receiver = null;
  }
  receiver = window.open('receiver.html'); // Open receiver
  receiver.currentStream = stream; // Set receiver stream.
}

function record() { // Start recording.
  chrome.tabCapture.capture({ // Start Google Chrome tab capture.
    video: true, audio: true,
    videoConstraints: {
      mandatory: {
        minWidth: 16,
        minHeight: 9,
        maxWidth: screen.width,
        maxHeight: screen.height,
        maxFrameRate: 30
      },
    },
  },
    playCapturedStream)
}
