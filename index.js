#!/usr/bin/env node

require('dotenv').config();
const { Command } = require('commander');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

// Import lib modules
const AuthHandler = require('./lib/auth');
const InstagramClient = require('./lib/instagram');
const MessengerClient = require('./lib/messenger');

const program = new Command();

program
  .name('instagram-manager')
  .description('A comprehensive tool for managing Instagram accounts')
  .version('1.0.0');

// ==================== AUTH COMMANDS ====================

const authCmd = program.command('auth');
authCmd.description('Authentication commands');

authCmd
  .command('setup')
  .description('Interactive authentication setup')
  .action(async () => {
    const auth = new AuthHandler();
    try {
      await auth.setup();
    } catch (error) {
      console.error(chalk.red('Error during setup:'), error.message);
      process.exit(1);
    }
  });

authCmd
  .command('status')
  .description('Check authentication status')
  .action(async () => {
    const auth = new AuthHandler();
    if (!auth.hasConfig()) {
      console.log(chalk.yellow('No configuration found. Run "auth setup" to get started.'));
      return;
    }

    const { valid, error } = await auth.validateConfig();
    if (valid) {
      console.log(chalk.green('✓ Authentication is valid and ready to use.'));
    } else {
      console.log(chalk.red('✗ Authentication error:'), error);
    }
  });

authCmd
  .command('clear')
  .description('Clear authentication data')
  .action(() => {
    const auth = new AuthHandler();
    auth.clearAuth();
  });

// ==================== POST COMMANDS ====================

program
  .command('post')
  .description('Post content to Instagram')
  .option('--image <path>', 'Path to image file (must be publicly accessible URL)')
  .option('--caption <text>', 'Caption for the post')
  .action(async (options) => {
    if (!options.image || !options.caption) {
      console.error(chalk.red('Error: Both --image and --caption are required.'));
      console.log(chalk.gray('\nExample: instagram-manager post --image https://example.com/image.jpg --caption "Hello Instagram!"'));
      process.exit(1);
    }

    const auth = new AuthHandler();
    if (!auth.hasConfig()) {
      console.error(chalk.red('No configuration found. Run "auth setup" first.'));
      process.exit(1);
    }

    const { valid, error, config } = await auth.validateConfig();
    if (!valid) {
      console.error(chalk.red('Authentication error:'), error);
      process.exit(1);
    }

    try {
      const ig = new InstagramClient(config);
      await ig.postImage(options.image, options.caption);
    } catch (error) {
      console.error(chalk.red('Error posting image:'), error.message);
      process.exit(1);
    }
  });

// ==================== DM COMMANDS ====================

const dmCmd = program.command('dm');
dmCmd.description('Direct message commands');

dmCmd
  .command('list')
  .description('List direct messages')
  .option('--limit <number>', 'Number of conversations to show', '20')
  .action(async (options) => {
    const auth = new AuthHandler();
    if (!auth.hasConfig()) {
      console.error(chalk.red('No configuration found. Run "auth setup" first.'));
      process.exit(1);
    }

    const { valid, error, config } = await auth.validateConfig();
    if (!valid) {
      console.error(chalk.red('Authentication error:'), error);
      process.exit(1);
    }

    try {
      const messenger = new MessengerClient(config);
      const conversations = await messenger.listDirectMessages(parseInt(options.limit));

      console.log(chalk.bold.blue(`\n📬 Direct Messages (${conversations.length} conversations)\n`));

      conversations.forEach((conv, index) => {
        console.log(chalk.gray(`#${index + 1} Conversation ID: ${conv.id}`));
        console.log(chalk.gray(`   Last Activity: ${new Date(conv.updatedTime * 1000).toLocaleString()}`));
        console.log(chalk.gray(`   Unread: ${conv.unread_count || 0}`));

        if (conv.lastMessage) {
          console.log(chalk.white(`   Last Message: ${conv.lastMessage}`));
        }

        console.log('');
      });

      console.log(chalk.gray('Use "dm reply <CONVERSATION_ID> <MESSAGE>" to reply to a conversation.\n'));
    } catch (error) {
      console.error(chalk.red('Error fetching messages:'), error.message);
      process.exit(1);
    }
  });

dmCmd
  .command('reply <id> <message...>')
  .description('Reply to a direct message conversation')
  .action(async (id, messageParts) => {
    const message = messageParts.join(' ');

    if (!message) {
      console.error(chalk.red('Error: Message text is required.'));
      process.exit(1);
    }

    const auth = new AuthHandler();
    if (!auth.hasConfig()) {
      console.error(chalk.red('No configuration found. Run "auth setup" first.'));
      process.exit(1);
    }

    const { valid, error, config } = await auth.validateConfig();
    if (!valid) {
      console.error(chalk.red('Authentication error:'), error);
      process.exit(1);
    }

    try {
      const messenger = new MessengerClient(config);
      await messenger.replyToMessage(id, message);
      console.log(chalk.green('✓ Reply sent successfully!'));
    } catch (error) {
      console.error(chalk.red('Error sending reply:'), error.message);
      process.exit(1);
    }
  });

// ==================== COMMENTS COMMANDS ====================

const commentsCmd = program.command('comments');
commentsCmd.description('Comment management commands');

commentsCmd
  .command('list <postId>')
  .description('List comments on a post')
  .option('--limit <number>', 'Number of comments to show', '25')
  .action(async (postId, options) => {
    const auth = new AuthHandler();
    if (!auth.hasConfig()) {
      console.error(chalk.red('No configuration found. Run "auth setup" first.'));
      process.exit(1);
    }

    const { valid, error, config } = await auth.validateConfig();
    if (!valid) {
      console.error(chalk.red('Authentication error:'), error);
      process.exit(1);
    }

    try {
      const ig = new InstagramClient(config);
      const comments = await ig.getComments(postId, parseInt(options.limit));

      console.log(chalk.bold.blue(`\n💬 Comments on Post ${postId}\n`));

      if (comments.data && comments.data.length > 0) {
        comments.data.forEach((comment, index) => {
          console.log(chalk.gray(`#${index + 1} Comment ID: ${comment.id}`));
          console.log(chalk.white(`   ${comment.text}`));
          console.log(chalk.gray(`   by @${comment.username} • ${new Date(comment.timestamp * 1000).toLocaleString()}`));
          console.log('');
        });
      } else {
        console.log(chalk.yellow('No comments found on this post.\n'));
      }
    } catch (error) {
      console.error(chalk.red('Error fetching comments:'), error.message);
      process.exit(1);
    }
  });

commentsCmd
  .command('reply <commentId> <message...>')
  .description('Reply to a comment')
  .action(async (commentId, messageParts) => {
    const message = messageParts.join(' ');

    if (!message) {
      console.error(chalk.red('Error: Message text is required.'));
      process.exit(1);
    }

    const auth = new AuthHandler();
    if (!auth.hasConfig()) {
      console.error(chalk.red('No configuration found. Run "auth setup" first.'));
      process.exit(1);
    }

    const { valid, error, config } = await auth.validateConfig();
    if (!valid) {
      console.error(chalk.red('Authentication error:'), error);
      process.exit(1);
    }

    try {
      const ig = new InstagramClient(config);
      await ig.replyToComment(commentId, message);
      console.log(chalk.green('✓ Reply sent successfully!'));
    } catch (error) {
      console.error(chalk.red('Error sending reply:'), error.message);
      process.exit(1);
    }
  });

// ==================== PROFILE COMMANDS ====================

const profileCmd = program.command('profile');
profileCmd.description('Profile information commands');

profileCmd
  .command('info')
  .description('Get profile information')
  .action(async () => {
    const auth = new AuthHandler();
    if (!auth.hasConfig()) {
      console.error(chalk.red('No configuration found. Run "auth setup" first.'));
      process.exit(1);
    }

    const { valid, error, config } = await auth.validateConfig();
    if (!valid) {
      console.error(chalk.red('Authentication error:'), error);
      process.exit(1);
    }

    try {
      const ig = new InstagramClient(config);
      const profile = await ig.getProfileInfo();

      console.log(chalk.bold.blue('\n📸 Profile Information\n'));
      console.log(chalk.white(`Username: ${profile.username}`));
      console.log(chalk.white(`Account Type: ${profile.account_type}`));
      console.log(chalk.white(`Followers: ${profile.followers_count.toLocaleString()}`));
      console.log(chalk.white(`Total Posts: ${profile.media_count}`));
      if (profile.biography) {
        console.log(chalk.white(`\nBio:\n${profile.biography}`));
      }
      console.log('');
    } catch (error) {
      console.error(chalk.red('Error fetching profile:'), error.message);
      process.exit(1);
    }
  });

// ==================== WEBHOOK COMMANDS ====================

const webhookCmd = program.command('webhook');
webhookCmd.description('Webhook server commands');

webhookCmd
  .command('start')
  .description('Start webhook server to receive real-time messages')
  .option('--port <number>', 'Port to run webhook server on', '3000')
  .action(async (options) => {
    const auth = new AuthHandler();
    if (!auth.hasConfig()) {
      console.error(chalk.red('No configuration found. Run "auth setup" first.'));
      process.exit(1);
    }

    const { valid, error, config } = await auth.validateConfig();
    if (!valid) {
      console.error(chalk.red('Authentication error:'), error);
      process.exit(1);
    }

    try {
      const WebhookServer = require('./lib/webhook');
      const webhookServer = new WebhookServer(config);
      await webhookServer.start(parseInt(options.port));
      console.log(chalk.green('\n✓ Webhook server is running!\n'));
      console.log(chalk.yellow('Next steps:'));
      console.log(chalk.gray('1. Set up ngrok: ngrok http ' + options.port));
      console.log(chalk.gray('2. Configure webhook in Meta Developer Portal:'));
      console.log(chalk.gray('   - Webhook URL: https://YOUR_NGROK_URL/webhook'));
      console.log(chalk.gray('   - Verify Token: meta_webhook_secret_2026'));
      console.log(chalk.gray('3. Subscribe to webhook events (messages, comments)\n'));

      // Handle graceful shutdown
      process.on('SIGINT', async () => {
        console.log(chalk.yellow('\n\n🛑 Shutting down webhook server...'));
        await webhookServer.stop();
        process.exit(0);
      });

      process.on('SIGTERM', async () => {
        console.log(chalk.yellow('\n\n🛑 Shutting down webhook server...'));
        await webhookServer.stop();
        process.exit(0);
      });

    } catch (error) {
      console.error(chalk.red('Error starting webhook server:'), error.message);
      process.exit(1);
    }
  });

webhookCmd
  .command('info')
  .description('Show webhook setup instructions')
  .action(() => {
    console.log(chalk.bold.blue('\n📋 Webhook Setup Instructions\n'));

    console.log(chalk.bold('1. Start the webhook server locally:'));
    console.log(chalk.gray('   npm start webhook start\n'));

    console.log(chalk.bold('2. Expose localhost publicly using ngrok:'));
    console.log(chalk.gray('   ngrok http 3000\n'));

    console.log(chalk.bold('3. Configure webhook in Meta Developer Portal:'));
    console.log(chalk.gray('   Go to: https://developers.facebook.com/apps/YOUR_APP_ID/messenger/settings'));
    console.log(chalk.gray('   or: https://developers.facebook.com/apps/YOUR_APP_ID/instagram-messaging/settings\n'));

    console.log(chalk.bold('4. Add webhook callback URL:'));
    console.log(chalk.gray('   URL: https://YOUR_NGROK_ID.ngrok-free.app/webhook'));
    console.log(chalk.gray('   Verify Token: meta_webhook_secret_2026\n'));

    console.log(chalk.bold('5. Subscribe to events:'));
    console.log(chalk.gray('   Instagram: messages, comments, mentions'));
    console.log(chalk.gray('   Facebook: messages, messaging_postbacks\n'));

    console.log(chalk.bold('6. Test the webhook:'));
    console.log(chalk.gray('   Send a test message from your Instagram/Facebook\n'));

    console.log(chalk.yellow('\n💡 Tip: For production, use a real server (not ngrok)\n'));
  });

// ==================== PARSE COMMANDS ====================

program.parse(process.argv);
