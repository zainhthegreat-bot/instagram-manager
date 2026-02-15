# 🚀 Vercel Deployment Guide

## Overview

Deploy your Instagram Manager webhook server to Vercel for free, with automatic HTTPS and continuous deployment from GitHub.

## Prerequisites

✅ GitHub account
✅ Vercel account (free tier)
✅ Meta Developer app with webhooks enabled

## Step-by-Step Deployment

### Step 1: Push to GitHub

```bash
cd /Users/zainapplemailgmail.com/.openclaw/workspace/instagram-manager

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Add webhook server and Vercel deployment"

# Add remote (your repo)
git remote add origin https://github.com/zainhthegreat-bot/instagram-manager.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Create Vercel Account

1. Go to: https://vercel.com/signup
2. Sign up with GitHub (recommended)
3. Vercel is free for personal projects

### Step 3: Deploy to Vercel

**Option 1: Via Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from the project directory
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? Your username
# - Link to existing project? N
# - Project name: instagram-manager (or any name)
# - Directory: ./ (default)
# - Override settings? N

# After deployment, Vercel will give you a URL like:
# https://instagram-manager.vercel.app
```

**Option 2: Via Vercel Dashboard**

1. Go to: https://vercel.com/dashboard
2. Click "Add New Project"
3. Select your GitHub repo: `zainhthegreat-bot/instagram-manager`
4. Click "Deploy"

### Step 4: Configure Environment Variables

In Vercel Dashboard:

1. Go to your project: https://vercel.com/dashboard
2. Click on your project: `instagram-manager`
3. Go to Settings → Environment Variables
4. Add these variables:

```env
WEBHOOK_VERIFY_TOKEN = meta_webhook_secret_2026
WEBHOOK_SECRET = your_optional_secret_for_signature_verification
INSTAGRAM_ACCESS_TOKEN = your_instagram_access_token
INSTAGRAM_BUSINESS_ACCOUNT_ID = 17841477130204892
INSTAGRAM_APP_ID = 1858988228120926
INSTAGRAM_APP_SECRET = your_app_secret
```

5. Click "Save"
6. Redeploy to apply environment variables

### Step 5: Get Your Webhook URL

After deployment, Vercel will provide:
- **Production URL**: `https://instagram-manager.vercel.app`
- **Webhook URL**: `https://instagram-manager.vercel.app/webhook`

If you deployed with a custom name, adjust accordingly.

### Step 6: Configure Webhooks in Meta Developer Portal

**Instagram Webhook:**

1. Go to: https://developers.facebook.com/apps/1858988228120926/instagram-messaging/settings
2. Click "Add Callback URL"
3. Enter: `https://your-vercel-url.vercel.app/webhook`
4. Verify Token: `meta_webhook_secret_2026`
5. Click "Verify and Save"
6. Subscribe to events:
   - ✅ messages
   - ✅ comments
   - ✅ mentions

**Facebook Messenger Webhook:**

1. Go to: https://developers.facebook.com/apps/1858988228120926/messenger/settings
2. Click "Add Callback URL"
3. Enter: `https://your-vercel-url.vercel.app/webhook`
4. Verify Token: `meta_webhook_secret_2026`
5. Click "Verify and Save"
6. Subscribe to events:
   - ✅ messages
   - ✅ messaging_postbacks

### Step 7: Test the Webhook

1. Send a DM to your Instagram account from another account
2. Send a message to your Facebook Page from Messenger
3. Check Vercel logs:
   - Go to: https://vercel.com/dashboard
   - Click on your project
   - Go to the "Functions" tab
   - Click on the webhook function
   - View logs

## Monitoring & Logs

### View Real-Time Logs

```bash
# View logs for production
vercel logs

# View logs for a specific function
vercel logs --filter "/api/webhook"
```

### In Vercel Dashboard

1. Go to your project
2. Click on the "Functions" tab
3. Click on the webhook function
4. View logs, errors, and performance

## Updating the Webhook

### Make Changes

1. Edit the webhook code in `api/webhook.js`
2. Commit and push to GitHub:
```bash
git add api/webhook.js
git commit -m "Update webhook logic"
git push
```

### Redeploy

Vercel automatically deploys when you push to GitHub!

Or trigger manually:
```bash
vercel --prod
```

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `WEBHOOK_VERIFY_TOKEN` | Token for Meta webhook verification | ✅ Yes |
| `WEBHOOK_SECRET` | Secret for X-Hub-Signature verification | Optional |
| `INSTAGRAM_ACCESS_TOKEN` | Your Instagram access token | Optional (if using API) |
| `INSTAGRAM_BUSINESS_ACCOUNT_ID` | Your IG Business Account ID | Optional |
| `INSTAGRAM_APP_ID` | Your Meta App ID | Optional |
| `INSTAGRAM_APP_SECRET` | Your Meta App Secret | Optional |

## Custom Domain (Optional)

To use a custom domain:

1. Go to your Vercel project
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `webhook.yourdomain.com`)
4. Follow DNS instructions
5. Update Meta webhook URL to use your custom domain

## Troubleshooting

**Webhook verification fails:**
- Verify Vercel URL is correct
- Check verify token matches: `meta_webhook_secret_2026`
- Ensure environment variable `WEBHOOK_VERIFY_TOKEN` is set in Vercel

**No messages received:**
- Check Vercel logs for errors
- Verify you've subscribed to correct events in Meta Portal
- Check access token permissions

**Deployment fails:**
- Check `vercel.json` syntax
- Ensure `api/webhook.js` exists
- Review Vercel build logs

**Environment variables not working:**
- Redeploy after adding variables
- Ensure variable names match exactly
- Check for typos

## Benefits of Vercel Deployment

✅ **Free** - No cost for personal projects
✅ **HTTPS** - Automatic SSL certificates
✅ **Fast** - Global CDN
✅ **Auto-deploy** - Deploy on git push
✅ **Logs** - Built-in logging and monitoring
✅ **Preview** - Preview URLs for each deployment
✅ **Serverless** - Pay only for what you use
✅ **GitHub Integration** - Seamless deployment from repo

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Deploy to Vercel
3. ✅ Configure environment variables
4. ✅ Update Meta Developer Portal with webhook URL
5. ✅ Test webhook with real messages
6. ✅ Add custom logic to `api/webhook.js` as needed
