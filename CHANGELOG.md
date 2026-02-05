# Changelog

All notable changes to Instagram Manager will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Add support for video posting
- Add scheduling posts feature
- Add analytics and insights commands
- Add hashtag research tool
- Add bulk DM handling
- Add comment moderation features
- Add multiple account management
- Add web dashboard interface
- Add CI/CD pipeline
- Add comprehensive test suite

## [1.0.0] - 2025-02-05

### Added
- Initial release of Instagram Manager
- **Authentication System**
  - Interactive setup with `auth setup` command
  - Token validation with `auth status` command
  - Credential clearing with `auth clear` command
  - Secure storage in config.json and .env files
  - Support for long-lived access tokens

- **Profile Management**
  - `profile info` command to retrieve account information
  - Display username, account type, followers count, post count
  - Biography display support

- **Image Posting**
  - `post` command to upload and publish images
  - Support for captions with emojis and hashtags
  - Container creation and media publishing workflow
  - Public URL-based image upload

- **Direct Messages**
  - `dm list` command to view all conversations
  - `dm reply` command to respond to messages
  - Display unread count and last activity
  - Show recent messages in conversations
  - Configurable limit for conversation listing

- **Comment Management**
  - `comments list` command to view post comments
  - `comments reply` command to respond to comments
  - Display comment text, username, and timestamp
  - Configurable limit for comment listing
  - Support for tagging users in replies

- **Core Functionality**
  - Instagram Graph API integration (v18.0)
  - Messenger API integration for DMs
  - Error handling with colored output
  - Command-line interface using Commander.js
  - Configuration validation
  - Interactive prompts using Inquirer.js

- **Documentation**
  - Comprehensive README with installation and setup guide
  - Step-by-step Meta Developer app setup instructions
  - Usage examples for all commands
  - Troubleshooting section
  - Project structure documentation

### Security
- Secure credential management
- Environment variable support
- Config files in .gitignore
- No sensitive data in repository

### Development
- Node.js 14+ compatibility
- Modular code structure
- API client separation (Instagram, Messenger, Auth)
- JSON-based configuration
- Chalk for colored terminal output

## [0.1.0] - 2025-01-20 (Initial Development)

### Added
- Project initialization
- Basic CLI framework
- Authentication module stub
- Instagram API client stub
- Messenger API client stub
- Initial package.json setup

---

## Version Format
- **Major**: Breaking changes
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes (backward compatible)

## Release Notes
Each release includes detailed notes about new features, bug fixes, breaking changes, and upgrade instructions. Check the release notes for important migration information.

---

**For more information, visit [GitHub Releases](https://github.com/zainhthegreat-bot/instagram-manager/releases)**
