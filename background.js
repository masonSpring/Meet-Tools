chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if(message.closeThis) chrome.tabs.remove(sender.tab.id);
    if(message.focusThis) chrome.tabs.highlight({'tabs': sender.tab.index});
  });