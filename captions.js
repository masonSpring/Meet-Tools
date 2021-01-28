chrome.storage.sync.get({ // Get all relevant settings. 
  include: "",
  exclude: "",
  webhook: "",
  haHook: "",
  ping: ""
}, function (items) {
  include = items.include.replace(/\s/g, '').toLowerCase().split(',');
  exclude = items.exclude.replace(/\s/g, '').toLowerCase().split(',');
  webhook = items.webhook;
  haHook = items.haHook;
  ping = items.ping;

  if (!webhook || !haHook) { // If at least one of the webhooks are set, start caption reader.
    readCaption();
  }
});

function readCaption(oldCaption) { // Checks captions for included words.
  if (oldCaption == undefined) { // If oldCaption is not defined, define it to avoid errors.
    var oldCaption;
  }
  let captionArr = document.getElementsByClassName('CNusmb'); // Find captions.
  let caption = "";
  for (let x = 0; x < captionArr.length; x += 1) { // For each line of caption, add to whole string.
    caption += captionArr[x].innerText + " ";
  }
  shortloop = true; // As of now, keep checking for matches every second.
  if (caption != oldCaption) { // Caption has changed, check it.
    captionLoop:
    for (let y = 0; y < include.length; y += 1) { // Check for each included word.
      if (caption.toLowerCase().includes(include[y])) { // If caption includes trigger word.
        shortloop = false; // Check for match in 15 seconds.

        if (exclude != "") { // Are there excluded words?
          for (let z = 0; z < exclude.length; z += 1) { // Check if caption contains any excluded word.
            if (caption.toLowerCase().includes(exclude[z])) {
              shortloop = false; // If exclude word is in caption set check interval back to 1 second. 
              break captionLoop; // Break out of loop, ignore rest of notify logic.
            }
          }
        }
        if (webhook != "") { // If Discord webhook is defined.
          let request = new XMLHttpRequest(); // Create new AJAX request.
          request.open("POST", webhook); // Set POST request to Discord webhook.
          request.setRequestHeader('Content-type', 'application/json'); // Set application type to JSON.

          let captionEmbed = { // Set message. 
            "title": "Ping Alert",
            "description": caption
          };

          let params = { // Set message details.
            "content": "<@" + ping + ">",
            embeds: [captionEmbed],
            username: document.getElementsByClassName('zs7s8d jxFHg')[document.getElementsByClassName('zs7s8d jxFHg').length - 1].innerText,
            avatar_url: document.getElementsByClassName('KpxDtd r6DyN')[document.getElementsByClassName('KpxDtd r6DyN').length - 1].src
          }

          request.send(JSON.stringify(params)); // Send AJAX request.
        }

        if (haHook != "") { // If Home Assistant webhook is defined.
          let request = new XMLHttpRequest(); // Create a new AJAX request.
          request.open("POST", haHook); // Set POST request to HA webhook.
          request.send(); // Send request.
        }

        break captionLoop; // Don't check anymore words.
      }
    }
  }
  if (shortloop == true) { // 1 second check or 15 second check?
    setTimeout(readCaption, 1000, caption); // Check again in 1 second.
  } else {
    setTimeout(readCaption, 15000, caption); // Check again in 15 seconds (after a match).
  }
}
