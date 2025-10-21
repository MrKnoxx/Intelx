# INTELX - IP tracker server

This small Node.js service accepts a client POST to `/track`, looks up a visitor IP via ip-api.com and forwards a small message to a Discord webhook (configured via `WEBHOOK_URL`).

Setup

1. Install dependencies: `npm install`.
2. Create `.env` or set environment variable `WEBHOOK_URL` to your Discord incoming webhook URL.
3. Start: `npm start`.

Privacy and legal

Collecting IP addresses and geolocation data of visitors can have legal/privacy implications in many jurisdictions. Only use this code where you have a lawful basis to collect and process visitor IP information. Avoid collecting PII beyond what is strictly necessary.
