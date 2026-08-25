# Kers0ne Forwarder

Kers0ne Forwarder is a single-page static interface for monitoring an authorized Discord channel and sending newly observed, forwardable messages to an authorized Discord webhook. It provides two modes: a **Channel Forwarder** for image, text-file, and substantive text-message forwarding, and a **Loadstring Grabber** for identifying configured text patterns before relaying them to a webhook.

> Use this project only with Discord channels, bot credentials, and webhooks that you own or are explicitly authorized to administer. Never use a personal Discord user token.

| Item | Requirement |
| --- | --- |
| Runtime | A modern browser with JavaScript enabled |
| Source access | A Discord application bot with access to the intended channel |
| Destination | A Discord incoming webhook URL for a channel you administer |
| Repository setup | No package installation or compilation is required |

## Run locally

Because the application is static, any web server that can serve `index.html` is sufficient. From the repository directory, run the following command and open the printed local URL in a browser.

```bash
npx --yes http-server . -p 4173 -c-1
```

Alternatively, deploy the contents of this repository to a static hosting provider. The forwarding and scanning run only while the page remains open in a browser tab; closing or reloading the tab stops active scans.

## Configuration

Create a Discord bot in the Developer Portal, add it to the server containing the authorized source channel, and grant only the permissions required to view that channel and read its message history. The interface uses the documented Discord REST API and `Authorization: Bot <token>` request format. [1]

Create or select an incoming webhook in the Discord channel that should receive forwarded items. Discord describes incoming webhooks as channel-bound endpoints; the Execute Webhook endpoint accepts a message payload and optional file upload. [2]

| Field | Enter | Behavior |
| --- | --- | --- |
| **Bot Token** | The bot token from your Discord application | Held only in the current browser tab; it is not written to local storage. |
| **Source Channel ID** | A 17–20 digit Discord channel ID | The channel that the bot is allowed to read. |
| **Destination Webhook URL** | A valid Discord incoming-webhook URL | The authorized destination channel. |
| **Scan Interval** | A value from 5 to 120 seconds | The delay between scans. |
| **Filter Keyword** | Optional comma-separated phrases | Used only by the Loadstring Grabber to limit inspected content. |

The first scan establishes a baseline at the newest visible message rather than forwarding channel history. Later scans request messages **after** the stored message identifier and process them in chronological order. Discord documents `before` and `after` snowflake parameters as the standard pagination mechanism. [3]

## Privacy and security

The page deliberately does not persist bot tokens or webhook URLs in browser storage. Nevertheless, browser-based credentials remain sensitive for the duration of a session. Use this page from a trusted device, avoid shared machines, and regenerate the bot token or webhook immediately if you suspect exposure.

Forwarded message content can contain Discord mention syntax. The application limits outbound payload size, but destination servers should still be configured thoughtfully. Discord notes that user-generated strings may need sanitization and that mention behavior can be controlled through `allowed_mentions`. [2]

## Verification

The repository includes a syntax and structure check. It validates the page’s essential controls, confirms credential persistence has not been added, checks after-baseline polling, and parses the inline JavaScript.

```bash
node validate_static_site.mjs
```

Browser verification was performed with blank credentials. The expected validation message was displayed and no real Discord channels, bot tokens, or webhook destinations were accessed during verification.

## References

[1]: https://docs.discord.com/developers/reference "Discord API Reference — Authentication"
[2]: https://docs.discord.com/developers/resources/webhook "Discord Webhook Resource — Execute Webhook"
[3]: https://docs.discord.com/developers/reference "Discord API Reference — Snowflake IDs in Pagination"
