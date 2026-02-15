const express = require('express');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

/**
 * Webhook Server
 * Handles Meta (Facebook & Instagram) webhook verification and message callbacks
 */
class WebhookServer {
  constructor(config) {
    this.config = config;
    this.app = express();
    this.port = config.webhook_port || 3000;
    this.verifyToken = config.webhook_verify_token || 'meta_webhook_secret_2026';
    this.messageHandlers = [];
    this.commentHandlers = [];
    this.server = null;

    // Middleware
    this.app.use(bodyParser.json());

    // Setup routes
    this.setupRoutes();
  }

  /**
   * Setup webhook routes
   */
  setupRoutes() {
    // GET endpoint for webhook verification (Meta uses this)
    this.app.get('/webhook', (req, res) => {
      // Verify token from Meta
      const mode = req.query['hub.mode'];
      const token = req.query['hub.verify_token'];
      const challenge = req.query['hub.challenge'];

      if (mode === 'subscribe' && token === this.verifyToken) {
        console.log(chalk.green('✓ Webhook verified successfully!'));
        res.status(200).send(challenge);
      } else {
        console.log(chalk.red('✗ Webhook verification failed'));
        res.sendStatus(403);
      }
    });

    // POST endpoint for webhook events (messages, comments, etc.)
    this.app.post('/webhook', (req, res) => {
      const body = req.body;

      if (body.object === 'instagram') {
        // Handle Instagram events
        this.handleInstagramEvents(body);
      } else if (body.object === 'page') {
        // Handle Facebook Messenger events
        this.handleFacebookEvents(body);
      }

      res.status(200).send('EVENT_RECEIVED');
    });

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok', message: 'Webhook server is running' });
    });
  }

  /**
   * Handle Instagram webhook events
   */
  handleInstagramEvents(body) {
    try {
      const entries = body.entry || [];

      entries.forEach(entry => {
        const changes = entry.changes || [];

        changes.forEach(change => {
          if (change.field === 'messages') {
            // New Instagram Direct Message
            this.handleInstagramMessage(change.value);
          } else if (change.field === 'comments') {
            // New comment on a post
            this.handleInstagramComment(change.value);
          } else if (change.field === 'mentions') {
            // New mention in comments
            console.log(chalk.yellow('New Instagram mention received'));
          }
        });
      });
    } catch (error) {
      console.error(chalk.red('Error handling Instagram event:'), error.message);
    }
  }

  /**
   * Handle Facebook Messenger webhook events
   */
  handleFacebookEvents(body) {
    try {
      const entries = body.entry || [];

      entries.forEach(entry => {
        const messagingEvents = entry.messaging || [];

        messagingEvents.forEach(event => {
          if (event.message) {
            // New Facebook message
            this.handleFacebookMessage(event);
          } else if (event.postback) {
            // Postback from buttons
            console.log(chalk.yellow('Received postback:', event.postback.payload));
          }
        });
      });
    } catch (error) {
      console.error(chalk.red('Error handling Facebook event:'), error.message);
    }
  }

  /**
   * Handle Instagram Direct Message
   */
  handleInstagramMessage(messageData) {
    console.log(chalk.blue('\n📸 New Instagram Message:'));
    console.log(chalk.gray('From:'), messageData.from_id);
    console.log(chalk.gray('To:'), messageData.to_id);
    console.log(chalk.gray('Message:'), messageData.text || '(Media message)');

    // Trigger all registered message handlers
    this.messageHandlers.forEach(handler => {
      try {
        handler(messageData);
      } catch (error) {
        console.error(chalk.red('Error in message handler:'), error.message);
      }
    });
  }

  /**
   * Handle Facebook Messenger Message
   */
  handleFacebookMessage(event) {
    const senderId = event.sender.id;
    const recipientId = event.recipient.id;
    const message = event.message;

    console.log(chalk.blue('\n💬 New Facebook Message:'));
    console.log(chalk.gray('From:'), senderId);
    console.log(chalk.gray('To:'), recipientId);

    if (message.text) {
      console.log(chalk.gray('Message:'), message.text);
    } else if (message.attachments) {
      console.log(chalk.gray('Attachments:'), message.attachments.length);
    }

    // Trigger all registered message handlers
    this.messageHandlers.forEach(handler => {
      try {
        handler({
          platform: 'facebook',
          senderId,
          recipientId,
          message
        });
      } catch (error) {
        console.error(chalk.red('Error in message handler:'), error.message);
      }
    });
  }

  /**
   * Handle Instagram Comment
   */
  handleInstagramComment(commentData) {
    console.log(chalk.yellow('\n💭 New Instagram Comment:'));
    console.log(chalk.gray('From:'), commentData.from_id);
    console.log(chalk.gray('Post ID:'), commentData.media_id);
    console.log(chalk.gray('Comment:'), commentData.text);

    // Trigger all registered comment handlers
    this.commentHandlers.forEach(handler => {
      try {
        handler(commentData);
      } catch (error) {
        console.error(chalk.red('Error in comment handler:'), error.message);
      }
    });
  }

  /**
   * Register a handler for incoming messages
   */
  onMessage(handler) {
    if (typeof handler !== 'function') {
      throw new Error('Message handler must be a function');
    }
    this.messageHandlers.push(handler);
  }

  /**
   * Register a handler for incoming comments
   */
  onComment(handler) {
    if (typeof handler !== 'function') {
      throw new Error('Comment handler must be a function');
    }
    this.commentHandlers.push(handler);
  }

  /**
   * Start the webhook server
   */
  async start(port = this.port) {
    this.port = port;

    return new Promise((resolve, reject) => {
      this.server = this.app.listen(this.port, (err) => {
        if (err) {
          console.error(chalk.red('Failed to start webhook server:'), err.message);
          reject(err);
        } else {
          console.log(chalk.green('\n✓ Webhook server running!'));
          console.log(chalk.white('  URL:'), chalk.blue(`http://localhost:${this.port}/webhook`));
          console.log(chalk.white('  Health check:'), chalk.blue(`http://localhost:${this.port}/health`));
          console.log(chalk.white('  Verify token:'), chalk.yellow(this.verifyToken));
          console.log(chalk.gray('\nUse ngrok to expose this URL publicly:'));
          console.log(chalk.gray(`  ngrok http ${this.port}\n`));
          resolve(this.port);
        }
      });
    });
  }

  /**
   * Stop the webhook server
   */
  async stop() {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          console.log(chalk.green('\n✓ Webhook server stopped.'));
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = WebhookServer;
