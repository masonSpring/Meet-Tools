function save_options() {
  var optionsAutomute = document.getElementById('options-automute').checked;
  var optionsAutojoin = document.getElementById('options-autojoin').checked;
  var optionsInclude = document.getElementById('options-include').value;
  var optionsExclude = document.getElementById('options-exclude').value;
  var optionsWebhook = document.getElementById('options-webhook').value;
  var optionsPing = document.getElementById('options-ping').value;
  var optionsRefreshInterval = document.getElementById('options-refresh-interval').value;
  var optionsHAHook = document.getElementById('options-hahook').value;
  var optionsAutorecord = document.getElementById('options-autorecord').checked;
  var optionsAutoleave = document.getElementById('options-autoleave').checked;
  var optionsAutobreakout = document.getElementById('options-autobreakout').checked;
  chrome.storage.sync.set({
    automute: optionsAutomute,
    autojoin: optionsAutojoin,
    include: optionsInclude,
    exclude: optionsExclude,
    webhook: optionsWebhook,
    ping: optionsPing,
    haHook: optionsHAHook,
    refreshInterval: optionsRefreshInterval,
    autorecord: optionsAutorecord,
    autoleave: optionsAutoleave,
    autobreakout: optionsAutobreakout
  }, function () {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function () {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    automute: true,
    autojoin: true,
    include: "",
    exclude: "",
    ping: "",
    webhook: "",
    haHook: "",
    refreshInterval: "15000",
    autorecord: false,
    autoleave: true,
    autobreakout: true
  }, function (items) {
    document.getElementById('options-automute').checked = items.automute;
    document.getElementById('options-autojoin').checked = items.autojoin;
    document.getElementById("options-include").value = items.include;
    document.getElementById("options-exclude").value = items.exclude;
    document.getElementById("options-ping").value = items.ping;
    document.getElementById("options-webhook").value = items.webhook;
    document.getElementById("options-hahook").value = items.haHook;
    document.getElementById("options-refresh-interval").value = items.refreshInterval;
    document.getElementById("options-autorecord").checked = items.autorecord;
    document.getElementById('options-autoleave').checked = items.autoleave;
    document.getElementById('options-autobreakout').checked = items.autobreakout;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
  save_options);
