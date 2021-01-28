chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) { // Message Handler
  if (message.closeThis) chrome.tabs.remove(sender.tab.id); // Close Tab
  if (message.focusThis) chrome.tabs.highlight({ 'tabs': sender.tab.index }); // Highlight Tab
});
