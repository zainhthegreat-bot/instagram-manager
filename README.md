# Instagram Manager

A comprehensive CLI tool for managing Instagram accounts, posts, direct messages, and comments using the Meta Business API.

## Features

- 📸 Post images to Instagram
- 💬 Manage direct messages
- 💭 Handle comments
- 👤 View profile information
- 🔐 Secure credential management

## Installation

1. Clone the repository:
```bash
git clone https://github.com/zainhthegreat-bot/instagram-manager.git
cd instagram-manager
```

2. Install dependencies:
```bash
npm install
```

3. Make the CLI executable (optional):
```bash
chmod +x index.js
```

## Setup

Before using the tool, you need to set up authentication with your Meta credentials.

### Get Your Meta Credentials

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create an app with "Instagram Graph API" product
3. Generate a long-lived access token
4. Get your Instagram Business Account ID

### Initialize Authentication

Run the interactive setup:
```bash
npm start auth setup
```

Or if you made it executable:
```bash
./index.js auth setup
```

You'll be prompted for:
- Meta Access Token
- Instagram Business Account ID
- App ID
- App Secret

## Usage

### Authentication Commands

#### Setup Authentication
```bash
npm start auth setup
```

#### Check Authentication Status
```bash
npm start auth status
```

#### Clear Authentication
```bash
npm start auth clear
```

### Profile Commands

#### Get Profile Information
```bash
npm start profile info
```

Example output:
```
📸 Profile Information

Username: your_username
Account Type: BUSINESS
Followers: 1,234
Total Posts: 56
```

### Post Commands

#### Post an Image
```bash
npm start post --image https://example.com/image.jpg --caption "Hello Instagram!"
```

**Important:** The image must be publicly accessible via URL.

### Direct Message Commands

#### List Direct Messages
```bash
npm start dm list
```

List with a specific limit:
```bash
npm start dm list --limit 10
```

#### Reply to a Direct Message
```bash
npm start dm reply <CONVERSATION_ID> Your reply message here
```

Example:
```bash
npm start dm reply 1234567890 Thanks for reaching out!
```

### Comment Commands

#### List Comments on a Post
```bash
npm start comments list <POST_ID>
```

With a specific limit:
```bash
npm start comments list 1234567890 --limit 50
```

#### Reply to a Comment
```bash
npm start comments reply <COMMENT_ID> Your reply here
```

Example:
```bash
npm start comments reply 1234567890 Thanks for the comment!
```

## Configuration Files

The tool creates two configuration files after setup:

1. **config.json** - Main configuration file
2. **.env** - Environment variables file

### Example Configuration

**config.example.json** (template):
```json
{
  "access_token": "YOUR_META_ACCESS_TOKEN",
  "instagram_business_account_id": "YOUR_IG_ID",
  "app_id": "YOUR_APP_ID",
  "app_secret": "YOUR_APP_SECRET"
}
```

**.env.example** (template):
```env
INSTAGRAM_ACCESS_TOKEN=YOUR_META_ACCESS_TOKEN
INSTAGRAM_BUSINESS_ACCOUNT_ID=YOUR_IG_ID
INSTAGRAM_APP_ID=YOUR_APP_ID
INSTAGRAM_APP_SECRET=YOUR_APP_SECRET
```

## Project Structure

```
instagram-manager/
├── index.js                 # Main CLI entry point
├── package.json             # Node.js dependencies
├── lib/                    # Core modules
│   ├── auth.js            # Authentication handling
│   ├── instagram.js       # Instagram API client
│   └── messenger.js       # Messenger/DM API client
├── config.example.json     # Configuration template
├── .env.example            # Environment variables template
└── README.md               # This file
```

## API Modules

### lib/instagram.js
Handles Instagram Graph API operations:
- Profile information
- Image posting
- Comment management
- Media retrieval

### lib/messenger.js
Handles Instagram Direct Messaging:
- List conversations
- Fetch messages
- Send replies
- Thread management

### lib/auth.js
Manages authentication:
- Interactive setup
- Configuration validation
- Token storage

## Security Notes

- Never commit `config.json` or `.env` to version control
- Use long-lived access tokens (valid for 60 days)
- Keep your App Secret secure
- Rotate access tokens regularly

## Troubleshooting

### "No configuration found" Error
Run `npm start auth setup` to configure your credentials.

### "Authentication error" Error
Your credentials may be invalid or expired. Run `npm start auth clear` then `npm start auth setup` again.

### Image Posting Fails
Ensure the image URL is publicly accessible. The Instagram API doesn't support local file uploads directly.

## Requirements

- Node.js 14 or higher
- Meta Developer Account
- Instagram Business Account
- Valid Access Token

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
