# 📋 Webhook Setup Guide

## Overview

This guide helps you set up real-time webhooks to receive messages and comments from Facebook and Instagram via Meta's API.

## Prerequisites

1. ✅ Meta Developer Account (you have this)
2. ✅ Meta App with Instagram & Messenger products enabled (you have this)
3. ✅ Access tokens (configured in `config.json`)
4. ⏳ ngrok (to expose localhost publicly) - **Install with:** `brew install ngrok`
5. ⏳ Your Instagram Business Account ID (find below)
6. ⏳ Your Facebook Page ID (find below)

## Quick Setup Steps

### Step 1: Install ngrok

```bash
brew install ngrok
```

### Step 2: Get Your IDs

**Instagram Business Account ID:**
```bash
# Use Graph API Explorer or curl this:
curl -X GET "https://graph.facebook.com/v18.0/me/accounts?fields=instagram_business_account{id,name,username}&access_token=YOUR_ACCESS_TOKEN"
```

**Facebook Page ID:**
```bash
# Use Graph API Explorer or curl this:
curl -X GET "https://graph.facebook.com/v18.0/me/accounts?access_token=YOUR_ACCESS_TOKEN"
```

Update these IDs in your `config.json`:
- `instagram_business_account_id`: Your IG Business Account ID
- Add `facebook_page_id`: Your FB Page ID

### Step 3: Start the Webhook Server

```bash
# Option 1: Using npm script
npm start webhook start

# Option 2: Standalone
npm run webhook
```

You should see:
```
✓ Webhook server running!
  URL: http://localhost:3000/webhook
  Health check: http://localhost:3000/health
  Verify token: meta_webhook_secret_2026
```

### Step 4: Expose with ngrok

In a **new terminal**:

```bash
ngrok http 3000
```

You'll get a URL like: `https://abc123.ngrok-free.app`

### Step 5: Configure Webhook in Meta Developer Portal

**For Instagram Messaging:**
1. Go to: https://developers.facebook.com/apps/1858988228120926/instagram-messaging/settings
2. Click "Add Callback URL"
3. Enter: `https://YOUR_NGROK_URL.ngrok-free.app/webhook`
4. Verify Token: `meta_webhook_secret_2026`
5. Click "Verify and Save"
6. Subscribe to events: `messages`, `comments`, `mentions`

**For Facebook Messenger:**
1. Go to: https://developers.facebook.com/apps/1858988228120926/messenger/settings
2. Click "Add Callback URL"
3. Enter: `https://YOUR_NGROK_URL.ngrok-free.app/webhook`
4. Verify Token: `meta_webhook_secret_2026`
5. Click "Verify and Save"
6. Subscribe to events: `messages`, `messaging_postbacks`

### Step 6: Test the Webhook

Send a test message:
- Send a DM to your Instagram account from another account
- Or send a message to your Facebook Page

You should see logs in your terminal:
```
📸 New Instagram Message:
From: 123456789
To: 987654321
Message: Hello!
```

## Webhook Server Commands

```bash
# Start webhook server (default port 3000)
npm start webhook start

# Start on custom port
npm start webhook start --port 8080

# Show setup instructions
npm start webhook info
```

## Environment Variables (.env)

```env
WEBHOOK_PORT=3000
WEBHOOK_VERIFY_TOKEN=meta_webhook_secret_2026

# Auto-reply settings
AUTO_REPLY_MESSAGE=Thanks for your message! We'll get back to you soon. 😊
AUTO_REPLY_COMMENTS=false
LOG_COMMENTS=true
```

## Webhook Events Supported

### Instagram
- ✅ Direct Messages (`messages`)
- ✅ Comments (`comments`)
- ✅ Mentions (`mentions`)

### Facebook Messenger
- ✅ Text Messages (`messages`)
- ✅ Postback events (`messaging_postbacks`)

## Custom Message Handlers

Edit `webhook.js` to add custom logic:

```javascript
webhookServer.onMessage(async (messageData) => {
  // Your custom logic here
  if (messageData.text?.includes('help')) {
    // Send help response
  }
});
```

## Troubleshooting

**Webhook verification fails:**
- Check that ngrok is running
- Verify the URL is correct (https://YOUR_NGROK_URL.ngrok-free.app/webhook)
- Ensure verify token matches: `meta_webhook_secret_2026`

**No messages received:**
- Check you've subscribed to the correct webhook events
- Verify your access token has the right permissions
- Check terminal logs for errors

**ngrok tunnel errors:**
- Restart ngrok: `ngrok http 3000`
- Check port 3000 is not already in use
- Verify webhook server is running

## Security Notes

⚠️ **Important:**
- Never commit `config.json` or `.env` to git
- Use environment variables for production
- Verify webhook requests come from Meta (validate X-Hub-Signature)
- For production, use HTTPS with a real domain (not ngrok)

## Production Deployment

For production, you'll need:
1. A real server (AWS, Heroku, DigitalOcean, etc.)
2. A domain with HTTPS (required by Meta)
3. Environment variables for sensitive data
4. Process manager (PM2, systemd, etc.)

Example with PM2:
```bash
npm install -g pm2
pm2 start webhook.js --name meta-webhook
pm2 save
```

## Next Steps

1. Get your Instagram Business Account ID
2. Install ngrok and test the webhook server
3. Configure webhooks in Meta Developer Portal
4. Test with real messages
5. Add custom logic for auto-replies or integrations
