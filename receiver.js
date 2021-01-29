var micEnabled; // Set micEnabled variable to be accessible elsewhere.
var recordedChunks = []; // Create global variable for recording.
const recordOptions = { mimeType: 'video/webm;codecs=vp9' }; // Set recording to webm.
var url = ""; // Create global variable for recording URL.

function handleDataAvailable(event) { // When recorded data is available
  if (event.data.size > 0) { // If data is more than 0:
    recordedChunks.push(event.data);  // Add data to recorded chunks.
  }
}

function download() { // Download file.
  var blob = new Blob(recordedChunks, { // Create webm blob out of all the segments.
    type: 'video/webm'
  });
  url = URL.createObjectURL(blob); // Create URL for blob.
  chrome.runtime.sendMessage({ download: true }); // Tell background script to download.
}

function tabClose() { // Kills streams.
  var player = document.getElementById('player'); // Get audio player.
  player.srcObject = null; // Unset audio player source.
  var tracks = currentStream.getTracks(); // Get all tracks.
  for (var i = 0; i < tracks.length; ++i) { // For all tracks:
    tracks[i].stop(); // Stop track.
  }
  stream = null; // Kill stream.
}

function shutdownReceiver() { // Shutdown recording.
  tabClose(); // Kill streams.
  download(); // Download file.
}

function play(stream) { // Play stream.
  var player = document.getElementById('player'); // Get player.
  player.addEventListener('canplay', function () { // When player is ready to play:
    this.volume = 1.00; // Set volume to full.
    this.muted = false; // Unmute.
    this.play(); // Play.
  });
  player.setAttribute('controls', '1'); // Enable player controls.
  player.srcObject = currentStream; // Set player to play audio stream from meet.

  mediaRecorder = new MediaRecorder(stream, recordOptions); // Create recorder object.
  mediaRecorder.ondataavailable = handleDataAvailable; // Set recorder data handler function.
  mediaRecorder.start(3000); // Start recording while saving to data handler function every 3 seconds.
  document.getElementById("download").addEventListener("click", function () { // When download button is clicked:
    download(); // Download.
  });
  var tracks = currentStream.getTracks(); // Get all streams from meet.
  for (var i = 0; i < tracks.length; ++i) { // For each stream:
    tracks[i].addEventListener('ended', function () { // When stream ends:
      mediaRecorder.stop(); // Stop recording.
      shutdownReceiver(); // Start recorder shutdown process.
    });
  }
}

window.addEventListener('load', function () { // When this page loads:
  navigator.mediaDevices.getUserMedia({ audio: true }).then((mic) => { // Get user mic input.
    micEnabled = mic; // Set global micEnabled object earlier to user mic input.
    window.currentStream.width = screen.width; // Set record width to user's screen's width.
    window.currentStream.height = screen.height; // Set record height to user's screen's height.
    let mixer = new MultiStreamsMixer([window.currentStream, mic]); // Create stream mixer to mix user mic and meet.
    mixer.frameInterval = 1; // Set frame interval.
    mixer.startDrawingFrames(); // Start video stream.
    play(mixer.getMixedStream()); // Start playback and recording.
  });
});

window.addEventListener('beforeunload', tabClose); // When page is closed, kill all streams.
