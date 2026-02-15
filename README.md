# Instagram Manager

<div align="center">

**A comprehensive CLI tool for managing Instagram accounts, posts, direct messages, and comments using the Meta Business API.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/instagram-manager)](https://nodejs.org/)
[![Version](https://img.shields.io/github/v/tag/zainhthegreat-bot/instagram-manager)](https://github.com/zainhthegreat-bot/instagram-manager/releases)

[Features](#features) • [Installation](#installation) • [Setup Guide](#setup-guide) • [Usage](#usage) • [Wiki](https://github.com/zainhthegreat-bot/instagram-manager/wiki)

</div>

---

## ✨ Features

- 📸 **Post Images**: Upload and publish images to Instagram with captions
- 💬 **Direct Messages**: Manage and reply to Instagram direct messages
- 💭 **Comment Management**: View post comments and reply to them
- 👤 **Profile Info**: Retrieve Instagram business account information
- 🔐 **Secure Auth**: Secure credential management with validation
- 🎯 **CLI Interface**: Intuitive command-line interface with colored output
- 📊 **Batch Operations**: Process multiple items with limit controls
- 🔔 **Real-time Webhooks**: Receive instant message and comment notifications via webhooks

---

## 📋 Requirements

Before installing Instagram Manager, ensure you have:

- **Node.js** 14.0 or higher
- **npm** (comes with Node.js)
- A **Meta Developer Account** (free to create)
- An **Instagram Business Account** or Creator Account
- Basic familiarity with command-line tools

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/zainhthegreat-bot/instagram-manager.git
cd instagram-manager
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Make the CLI Executable (Optional but Recommended)

On Linux/macOS:
```bash
chmod +x index.js
```

Or install it globally:
```bash
npm link
```

This allows you to run `instagram-manager` from anywhere.

---

## ⚙️ Setup Guide

### Overview

To use Instagram Manager, you need to authenticate with Meta's APIs using your Instagram Business Account. This involves:

1. Creating a Meta Developer app
2. Configuring Instagram Graph API permissions
3. Generating a long-lived access token
4. Getting your Instagram Business Account ID

### Step-by-Step: Getting Your Meta Credentials

#### 1. Create a Meta Developer Account

If you don't have one:
1. Visit [developers.facebook.com](https://developers.facebook.com/)
2. Click "Get Started" and sign up with your Facebook account
3. Complete the verification process

#### 2. Create an App

1. Go to [Meta App Dashboard](https://developers.facebook.com/apps/)
2. Click **Create App**
3. Select app type: **Business** (most common for Instagram API usage)
4. Enter an app name (e.g., "Instagram Manager")
5. Click **Create App**

#### 3. Add Instagram Graph API Product

1. In your app dashboard, find **Add Product** in the left sidebar
2. Click **Set Up** next to **Instagram Graph API**
3. Review and accept the terms

#### 4. Configure Permissions

Your app needs these permissions:
- `instagram_basic` - Read profile data
- `instagram_content_publish` - Publish media
- `pages_read_engagement` - Access page content
- `pages_manage_engagement` - Manage comments and messages

To add permissions:
1. Go to **App Review** → **Permissions and Features**
2. Click **Request** next to each permission
3. For development/testing, you may get instant approval
4. For production, submit for review with instructions and screenshots

#### 5. Generate a Long-Lived Access Token

**Method 1: Using Graph API Explorer (Recommended for Testing)**

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app from the dropdown
3. In "User or Page", select **Get User Access Token**
4. Check these permissions:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_read_engagement`
   - `pages_manage_engagement`
5. Click **Generate Access Token**
6. Authorize your account
7. Copy the generated **short-lived token**
8. Convert it to a long-lived token by visiting this URL (replace `YOUR_TOKEN`):
   ```
   https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=YOUR_SHORT_LIVED_TOKEN
   ```
9. The response contains your **long-lived access token** (valid for 60 days)

**Method 2: Using curl (After Testing)**

```bash
curl -X POST "https://graph.facebook.com/v18.0/oauth/access_token" \
  -d "grant_type=fb_exchange_token" \
  -d "client_id=YOUR_APP_ID" \
  -d "client_secret=YOUR_APP_SECRET" \
  -d "fb_exchange_token=YOUR_SHORT_LIVED_TOKEN"
```

#### 6. Get Your Instagram Business Account ID

1. Use the Graph API Explorer with your long-lived token
2. Make a GET request to:
   ```
   me/accounts?fields=instagram_business_account{id,name,username}
   ```
3. Copy the `id` field from the `instagram_business_account` object

Alternatively, use this curl command:
```bash
curl -X GET "https://graph.facebook.com/v18.0/me/accounts?fields=instagram_business_account{id,name,username}&access_token=YOUR_LONG_LIVED_TOKEN"
```

#### 7. Get Your App ID and App Secret

1. In your [App Dashboard](https://developers.facebook.com/apps/)
2. Go to **Settings** → **Basic**
3. Copy **App ID** and **App Secret**

### Initialize Authentication

Once you have all credentials, run the interactive setup:

```bash
npm start auth setup
```

Or if you installed globally:
```bash
instagram-manager auth setup
```

You'll be prompted to enter:
- Meta Access Token (your long-lived token)
- Instagram Business Account ID
- App ID
- App Secret

After setup, two files will be created:
- `config.json` - Main configuration file
- `.env` - Environment variables file

**⚠️ Important:** Never commit these files to version control!

### Verify Your Setup

Check if authentication is working:
```bash
npm start auth status
```

If successful, you should see:
```
✓ Authentication is valid and ready to use.
```

---

## 📖 Usage

### Authentication Commands

#### Setup Authentication
Interactive setup for your Meta credentials.

```bash
npm start auth setup
```

#### Check Authentication Status
Verify your credentials are valid.

```bash
npm start auth status
```

#### Clear Authentication
Remove stored credentials (useful for troubleshooting).

```bash
npm start auth clear
```

---

### Profile Commands

#### Get Profile Information
Retrieve your Instagram business account details.

```bash
npm start profile info
```

**Example output:**
```
📸 Profile Information

Username: example_business
Account Type: BUSINESS
Followers: 5,234
Total Posts: 156

Bio:
Welcome to our official business page! 🚀
Follow us for updates and insights.
```

---

### Post Commands

#### Post an Image
Upload and publish an image to Instagram.

```bash
npm start post --image https://example.com/image.jpg --caption "Hello Instagram!"
```

**Parameters:**
- `--image` (required): Public URL of the image
- `--caption` (required): Post caption

**Important Notes:**
- Image must be publicly accessible (no authentication required)
- Supported formats: JPG, PNG
- Maximum file size: 30MB
- Minimum resolution: 1080x1080 pixels (recommended)
- URL must use HTTPS

**Example:**
```bash
npm start post \
  --image "https://example.com/photos/product-001.jpg" \
  --caption "🎉 New product launch! Check out our latest addition. #new #launch #innovation"
```

---

### Direct Message Commands

#### List Direct Messages
View all conversation threads.

```bash
npm start dm list
```

**Options:**
- `--limit <number>`: Number of conversations to show (default: 20)

**Example:**
```bash
npm start dm list --limit 10
```

**Example output:**
```
📬 Direct Messages (10 conversations)

#1 Conversation ID: 17894567890123456
   Last Activity: 2/5/2025, 3:45:00 PM
   Unread: 2
   Last Message: Hi, I'm interested in your product!

#2 Conversation ID: 17894567890123457
   Last Activity: 2/5/2025, 2:30:00 PM
   Unread: 0
   Last Message: Thanks for the quick response!
```

#### Reply to a Direct Message
Send a reply to an existing conversation.

```bash
npm start dm reply <CONVERSATION_ID> Your reply message here
```

**Example:**
```bash
npm start dm reply 17894567890123456 "Thanks for reaching out! How can I help you today?"
```

**Tips:**
- Use the conversation ID from `dm list` output
- Messages are sent immediately
- You can use emojis and hashtags

---

### Comment Commands

#### List Comments on a Post
View all comments on a specific post.

```bash
npm start comments list <POST_ID>
```

**Options:**
- `--limit <number>`: Number of comments to show (default: 25)

**Example:**
```bash
npm start comments list 17901234567890123 --limit 50
```

**Example output:**
```
💬 Comments on Post 17901234567890123

#1 Comment ID: 17912345678901234
   Amazing product! Love it ❤️
   by @user123 • 2/5/2025, 10:30:00 AM

#2 Comment ID: 17912345678901235
   Where can I buy this?
   by @buyer456 • 2/5/2025, 11:15:00 AM
```

#### Reply to a Comment
Reply to a specific comment on a post.

```bash
npm start comments reply <COMMENT_ID> Your reply here
```

**Example:**
```bash
npm start comments reply 17912345678901235 "You can purchase it on our website! Link in bio. 🛒"
```

**Tips:**
- Use the comment ID from `comments list` output
- Reply notifications are sent to the commenter
- You can tag other users with @username

---

## 📁 Configuration Files

The tool creates two configuration files after setup:

### config.json
Main configuration file in JSON format.

**Example:**
```json
{
  "access_token": "EAA...",
  "instagram_business_account_id": "17841401234567890",
  "app_id": "1234567890123456",
  "app_secret": "abcdef1234567890abcdef1234567890"
}
```

### .env
Environment variables file.

**Example:**
```env
INSTAGRAM_ACCESS_TOKEN=EAA...
INSTAGRAM_BUSINESS_ACCOUNT_ID=17841401234567890
INSTAGRAM_APP_ID=1234567890123456
INSTAGRAM_APP_SECRET=abcdef1234567890abcdef1234567890
```

### Template Files

The repository includes template files:
- `config.example.json` - Configuration template
- `.env.example` - Environment variables template

**Security Note:** Never commit `config.json` or `.env` to version control. These files are already in `.gitignore`.

---

## 🗂️ Project Structure

```
instagram-manager/
├── index.js                      # Main CLI entry point
├── webhook.js                    # Standalone webhook server
├── package.json                  # Node.js dependencies
├── lib/                         # Core modules
│   ├── auth.js                 # Authentication handling
│   ├── instagram.js            # Instagram API client
│   ├── messenger.js            # Messenger/DM API client
│   └── webhook.js              # Express webhook server
├── api/                         # Serverless functions (Vercel)
│   └── webhook.js              # Vercel serverless webhook
├── config.example.json          # Configuration template
├── .env.example                 # Environment variables template
├── vercel.json                  # Vercel deployment config
├── .gitignore                   # Git ignore rules
├── README.md                    # This file
├── CHANGELOG.md                 # Version history
├── CONTRIBUTING.md              # Contribution guidelines
├── DEPLOYMENT.md                # Vercel deployment guide
├── WEBHOOK_SETUP.md             # Local webhook setup guide
└── LICENSE                      # MIT License
```

---

## 🧩 API Modules

### lib/instagram.js
Handles Instagram Graph API operations:
- **Profile Information**: Fetch account details, followers, posts
- **Image Posting**: Create containers and publish media
- **Comment Management**: List comments and post replies
- **Media Retrieval**: Get recent posts and media data

### lib/messenger.js
Handles Instagram Direct Messaging:
- **List Conversations**: Get all conversation threads
- **Fetch Messages**: Retrieve messages from a conversation
- **Send Replies**: Reply to messages in conversations
- **Thread Management**: Track unread counts and activity

### lib/auth.js
Manages authentication:
- **Interactive Setup**: Prompt-based credential collection
- **Configuration Validation**: Verify credentials are valid
- **Token Storage**: Secure storage in config files
- **Auth Clearing**: Remove credentials for reset

---

## 🔧 Troubleshooting

### "No configuration found" Error
**Problem:** The tool can't find your credentials.

**Solution:**
```bash
npm start auth setup
```
Follow the prompts to enter your Meta credentials.

### "Authentication error" Error
**Problem:** Your credentials are invalid or expired.

**Solution:**
1. Check if your access token expired (long-lived tokens last 60 days)
2. Generate a new access token using the instructions above
3. Run:
   ```bash
   npm start auth clear
   npm start auth setup
   ```

### Image Posting Fails
**Problem:** Unable to post images to Instagram.

**Solutions:**
- ✅ Ensure the image URL is publicly accessible (no auth required)
- ✅ Check the image format (JPG or PNG only)
- ✅ Verify file size is under 30MB
- ✅ Confirm minimum resolution (1080x1080 recommended)
- ✅ Make sure URL uses HTTPS
- ✅ Test the URL in a browser to ensure it loads

### Cannot Get Instagram Business Account ID
**Problem:** The Graph API doesn't return your Instagram account.

**Solutions:**
- ✅ Ensure your Instagram account is a Business or Creator account
- ✅ Link your Instagram account to a Facebook Page
- ✅ Check that you have `instagram_basic` permission
- ✅ Verify your access token is valid

### Rate Limit Errors
**Problem:** Getting "429 Too Many Requests" errors.

**Solutions:**
- ✅ Slow down your requests (add delays between calls)
- ✅ Check Meta's API rate limits for your usage tier
- ✅ Implement retry logic with exponential backoff
- ✅ Consider using a batch API for multiple operations

### Permission Errors
**Problem:** "Permission denied" or "Insufficient permissions".

**Solutions:**
- ✅ Verify all required permissions are granted
- ✅ Check if permissions need app review
- ✅ Ensure your account is authorized for the app
- ✅ Review Meta's permission documentation

---

## 🔔 Webhook Server

Receive real-time messages and comments from Instagram and Facebook using the built-in webhook server.

### Quick Start (Vercel - Recommended)

Deploy to Vercel for free hosting with automatic HTTPS:

1. **Deploy to Vercel:**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Configure Environment Variables** in Vercel Dashboard:
   - `WEBHOOK_VERIFY_TOKEN` = `meta_webhook_secret_2026`

3. **Update Meta Developer Portal** with your Vercel URL:
   - Webhook URL: `https://your-project.vercel.app/webhook`
   - Verify Token: `meta_webhook_secret_2026`

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete Vercel setup instructions.

### Local Webhook Server

Run the webhook server locally (requires ngrok for public access):

```bash
# Start webhook server
npm start webhook start

# Or use standalone
npm run webhook

# Show setup instructions
npm start webhook info
```

### Webhook Commands

```bash
# Start webhook server (default port 3000)
npm start webhook start

# Start on custom port
npm start webhook start --port 8080

# Show webhook setup info
npm start webhook info
```

### Webhook Events

**Instagram:**
- ✅ Messages (Direct Messages)
- ✅ Comments on posts
- ✅ Mentions in comments

**Facebook Messenger:**
- ✅ Text messages
- ✅ Postback events

### Customizing Webhooks

Edit `api/webhook.js` (Vercel) or `webhook.js` (local) to add custom logic:

```javascript
// Example: Auto-reply to messages
if (messageData.text?.includes('help')) {
  // Send help response
}
```

### Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - Complete Vercel deployment guide
- [WEBHOOK_SETUP.md](WEBHOOK_SETUP.md) - Local webhook setup with ngrok

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📚 Additional Resources

- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api/)
- [Meta for Developers](https://developers.facebook.com/)
- [Instagram Business Account Setup](https://help.instagram.com/502981925147549)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [GitHub Wiki](https://github.com/zainhthegreat-bot/instagram-manager/wiki)

---

## 🆘 Support

- 📖 Check the [GitHub Wiki](https://github.com/zainhthegreat-bot/instagram-manager/wiki)
- 🐛 Report bugs via [GitHub Issues](https://github.com/zainhthegreat-bot/instagram-manager/issues)
- 💡 Request features via [GitHub Issues](https://github.com/zainhthegreat-bot/instagram-manager/issues)

---

<div align="center">

Made with ❤️ by [zainhthegreat-bot](https://github.com/zainhthegreat-bot)

[⬆ Back to Top](#instagram-manager)

</div>
