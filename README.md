# Meet Tools

Semi-automatic Google Meet management for Google Chrome:
* Automatic Muting
* Automatic Video Disabling
* Automatic Joining
* Automatic* Recording
* Automatic Leaving
* Supports alerting through multiple services when your name (or any configured trigger word) is said by meeting members:
  * Discord
  * Home Assistant

\* Automatic recording requires Google Chrome start switches, otherwise recording must be started manually. See below.

## Recording
1. If autorecord is disabled you can manually trigger a recording once in an active meet by clicking the extension icon on the top right.
2. The recorder will open in a new tab. Once the meet is disconected or the tab is closed the recorded meet will be downloaded in `webm` format. To download the file while currently in the meet click `Download Current File`. Not that the file saved at the end of the meeting will still contain the whole meeting.

## Configure Notifier
1. Open extension settings.
2. Set included words to monitor for, separated by a comma. This is usually your name.
3. (Optional) Add any words you want to exclude.
    * If this word is said while an included word is said, the notifier does not trigger.
#### For Discord:
4. Set the webhook URL to that of the Discord channel webhook you wish to be notified in. See [here](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks).
5. Set user ID to your Discord user ID.
    * This is not your @name#0000, see [here](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-).
#### For Home Assistant:
6. Set webhook URL to your Home Assistant webhook URL. See [here](https://www.home-assistant.io/docs/automation/trigger/#webhook-trigger).

## Configure Autorecord
1. Add this extension's ID to the chrome start switch `--whitelisted-extension-id=<EXTENSION ID>`. See [here](https://www.chromium.org/developers/how-tos/run-chromium-with-flags). Depending on OS you may want to add this to your Google Chrome shortcut/start wrapper.
2. Enable `Autorecord` in extension settings.
