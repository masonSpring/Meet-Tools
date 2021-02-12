var micEnabled; // Set micEnabled variable to be accessible elsewhere.
var recordedChunks = []; // Create global variable for recording.
var mediaRecorder; // Create global variable for media recorder.
const recordOptions = { type: 'video', timeSlice: 1000 }; // Set recording options to save every second.
var url = ""; // Create global variable for recording URL.

function download() { // Download file.
  if (mediaRecorder.getState() != "recording") { // Is the media recorder done recording?
    var blob = mediaRecorder.getBlob(); // Use built-in function to get blob.
  } else { // Partial download while still recording.
    var blob = new Blob(mediaRecorder.getInternalRecorder().getArrayOfBlobs(), {type: 'video/webm'}); // Create blob using partially recorded data.
  }
  getSeekableBlob(blob, function(seekableBlob) { // Get seekable blob.
    url = URL.createObjectURL(seekableBlob); // Create URL for blob.
    chrome.runtime.sendMessage({ download: true }); // Tell background script to download.
  });
}

function end() { // Meet is over, finish recording.
  mediaRecorder.stopRecording(download); // Stop recording and call download function.
  var player = document.getElementById('player'); // Get audio player.
  player.srcObject = null; // Unset audio player source.
  micEnabled.stop(); // Stop recording microphone.
  var tracks = currentStream.getTracks(); // Get all tracks.
  for (var i = 0; i < tracks.length; ++i) { // For all tracks:
    tracks[i].stop(); // Stop track.
  }
  stream = null; // Kill stream.
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
  mediaRecorder = RecordRTC(stream, recordOptions); // Create recorder.
  mediaRecorder.startRecording(); // Start recording.
  document.getElementById("download").addEventListener("click", function () { // When download button is clicked:
    download(); // Download.
  });
  var tracks = currentStream.getTracks(); // Get all streams from meet.
  for (var i = 0; i < tracks.length; ++i) { // For each stream:
    tracks[i].addEventListener('ended', function () { // When stream ends:
      end(); // Start recorder shutdown process.
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

window.addEventListener('beforeunload', close); // When page is closed, kill all streams.
