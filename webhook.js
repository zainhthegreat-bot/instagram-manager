#!/usr/bin/env node

require('dotenv').config();
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

// Import lib modules
const AuthHandler = require('./lib/auth');
const WebhookServer = require('./lib/webhook');
const MessengerClient = require('./lib/messenger');

/**
 * Start webhook server with message handlers
 */
async function startWebhook() {
  console.log(chalk.bold.blue('\n🔔 Meta Webhook Server\n'));

  // Load configuration
  const auth = new AuthHandler();
  if (!auth.hasConfig()) {
    console.error(chalk.red('No configuration found. Run "npm start auth setup" first.'));
    process.exit(1);
  }

  const { valid, error, config } = await auth.validateConfig();
  if (!valid) {
    console.error(chalk.red('Authentication error:'), error);
    process.exit(1);
  }

  // Set webhook configuration from config file or environment
  config.webhook_port = process.env.WEBHOOK_PORT || 3000;
  config.webhook_verify_token = process.env.WEBHOOK_VERIFY_TOKEN || 'meta_webhook_secret_2026';

  // Create webhook server
  const webhookServer = new WebhookServer(config);
  const messenger = new MessengerClient(config);

  // Register message handler for Instagram
  webhookServer.onMessage(async (messageData) => {
    console.log(chalk.cyan('\n📨 Processing message...'));

    // Handle Instagram message
    if (messageData.from_id && messageData.to_id) {
      // Auto-reply logic (customize as needed)
      const autoReply = process.env.AUTO_REPLY_MESSAGE || 'Thanks for your message! We\'ll get back to you soon. 😊';

      try {
        // This is a simplified example - you'd need conversation ID for actual replies
        console.log(chalk.gray('Auto-reply enabled:'), process.env.AUTO_REPLY_MESSAGE ? 'Yes' : 'No');

        // You can implement custom logic here, e.g.:
        // - Check message content
        // - Call external APIs
        // - Save to database
        // - Send to OpenClaw, etc.
      } catch (error) {
        console.error(chalk.red('Error sending auto-reply:'), error.message);
      }
    }

    // Handle Facebook message
    if (messageData.platform === 'facebook') {
      console.log(chalk.gray('Platform: Facebook'));
      // Facebook-specific logic here
    }
  });

  // Register comment handler for Instagram
  webhookServer.onComment(async (commentData) => {
    console.log(chalk.cyan('\n💭 Processing comment...'));

    // Auto-reply to comments (optional)
    const autoReplyComments = process.env.AUTO_REPLY_COMMENTS === 'true';

    if (autoReplyComments && commentData.text) {
      console.log(chalk.gray('Comment auto-reply enabled'));
      // Implement comment auto-reply logic
    }

    // Log comment to file (optional)
    if (process.env.LOG_COMMENTS === 'true') {
      const logPath = path.join(process.cwd(), 'comments.log');
      const logEntry = {
        timestamp: new Date().toISOString(),
        from_id: commentData.from_id,
        post_id: commentData.media_id,
        text: commentData.text
      };

      fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n');
      console.log(chalk.gray('Comment logged to:'), logPath);
    }
  });

  // Start the server
  try {
    await webhookServer.start();
    console.log(chalk.green('\n✓ Webhook server is ready to receive messages!\n'));

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
    console.error(chalk.red('Failed to start webhook server:'), error.message);
    process.exit(1);
  }
}

// Run the webhook server
startWebhook().catch(error => {
  console.error(chalk.red('Fatal error:'), error);
  process.exit(1);
});
