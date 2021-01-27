chrome.storage.sync.get({
    include: "",
    exclude: "",
    ping: "",
    webhook: ""
  }, function(items) {
    include = items.include.replace(/\s/g, '').toLowerCase().split(',');
    exclude = items.exclude.replace(/\s/g, '').toLowerCase().split(',');
    webhook = items.webhook;
    ping = items.ping;
    if(webhook != ""){
        readCaption()
    }    
  });




function readCaption(){
    //generate caption text
    let captionArr = document.getElementsByClassName('CNusmb')
    let caption = ""
    for (let x = 0; x < captionArr.length; x += 1) {
        caption += captionArr[x].innerText + " "
    }
    shortloop = true
    for (let y = 0; y < include.length; y += 1){
    if (caption.toLowerCase().includes(include[y])) {
        shortloop = false
        for (let z = 0; z < exclude.length; z += 1){
            if(caption.toLowerCase().includes(exclude[z])){
                setTimeout(readCaption, 1000)
            }
        }
        let request = new XMLHttpRequest();
        request.open("POST", webhook);
        request.setRequestHeader('Content-type', 'application/json');

        let captionEmbed = { "title" : "Caption Text", "description" : caption}

        let params = {
            "content": "<@"+ping+">",
            embeds: [ captionEmbed ],
            username: document.getElementsByClassName('zs7s8d jxFHg')[document.getElementsByClassName('zs7s8d jxFHg').length - 1].innerText,
            avatar_url: document.getElementsByClassName('KpxDtd r6DyN')[document.getElementsByClassName('KpxDtd r6DyN').length - 1].src
        }



            request.send(JSON.stringify(params));

        
        
            setTimeout(readCaption, 15000)
        
    }
    }
    if(shortloop == true){
        setTimeout(readCaption, 1000)
    }
}

