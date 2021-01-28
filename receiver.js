// Copyright 2016 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Note: |window.currentStream| was set in background.js.

// Stop video play-out, stop the MediaStreamTracks, and set style class to
// "shutdown".

var micEnabled = new MediaStream();
var recordedChunks = [];
const recordOptions = {mimeType: 'video/webm;codecs=vp9'};
var url = "";

function handleDataAvailable(event) {
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
  } else {
    // ...
  }
}

function download() {
  var blob = new Blob(recordedChunks, {
    type: 'video/webm'
  });
  url = URL.createObjectURL(blob);
  chrome.runtime.sendMessage("download");
  //window.URL.revokeObjectURL(url);
}

function tabClose() {
  var player = document.getElementById('player');
  player.srcObject = null;
  var tracks = currentStream.getTracks();
  for (var i = 0; i < tracks.length; ++i) {
    tracks[i].stop();
  }
  stream = null;
}

function shutdownReceiver() {
  //if (!currentStream) {
  //return;
  //}
  tabClose();
  
  
  download();
}

function play(stream) {
  var player = document.getElementById('player');
  player.addEventListener('canplay', function() {
    this.volume = 0.75;
    this.muted = false;
    this.play();
  });
  player.setAttribute('controls', '1');
  player.srcObject = currentStream;
  
  
  mediaRecorder = new MediaRecorder(stream, recordOptions);
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start(3000);
  document.getElementById("download").addEventListener("click", function() {
    download();
  });
  // Add onended event listeners. This detects when tab capture was shut down by
  // closing the tab being captured.
  var tracks = currentStream.getTracks();
  for (var i = 0; i < tracks.length; ++i) {
    tracks[i].addEventListener('ended', function() {
      console.log('MediaStreamTrack[' + i + '] ended, shutting down...');
      mediaRecorder.stop();
      shutdownReceiver();
    });
  }
}

window.addEventListener('load', function() {
  // Start video play-out of the captured audio/video MediaStream once the page
  // has loaded.
  
  navigator.mediaDevices.getUserMedia({ audio: true }).then((mic) => {
    micEnabled = mic;
    window.currentStream.width = screen.width;
    window.currentStream.height = screen.height;
    let mixer = new MultiStreamsMixer([window.currentStream, mic]);
    console.log(mixer.getMixedStream());
    mixer.frameInterval = 1;
    mixer.startDrawingFrames();
    play(mixer.getMixedStream());
  });
});
// Shutdown when the receiver page is closed.
window.addEventListener('beforeunload', tabClose);
