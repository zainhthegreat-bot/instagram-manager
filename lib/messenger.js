const axios = require('axios');
const chalk = require('chalk');

/**
 * Messenger/DM API Client
 * Handles Instagram Direct Messaging functionality
 */
class MessengerClient {
  constructor(config) {
    this.accessToken = config.access_token;
    this.businessAccountId = config.instagram_business_account_id;
    this.apiVersion = 'v18.0';
    this.baseURL = `https://graph.facebook.com/${this.apiVersion}`;
  }

  /**
   * Get conversation threads
   */
  async getConversations(limit = 20) {
    try {
      const response = await axios.get(`${this.baseURL}/${this.businessAccountId}/conversations`, {
        params: {
          fields: 'id,participants,last_message,unread_count,updated_time',
          limit: limit,
          access_token: this.accessToken
        }
      });

      return response.data;
    } catch (error) {
      console.error(chalk.red('Error fetching conversations:'), error.response?.data?.error?.message || error.message);
      throw error;
    }
  }

  /**
   * Get messages from a conversation
   */
  async getMessages(conversationId, limit = 25) {
    try {
      const response = await axios.get(`${this.baseURL}/${conversationId}/messages`, {
        params: {
          fields: 'id,from,to,message,timestamp,attachment_type,attachment_url',
          limit: limit,
          access_token: this.accessToken
        }
      });

      return response.data;
    } catch (error) {
      console.error(chalk.red('Error fetching messages:'), error.response?.data?.error?.message || error.message);
      throw error;
    }
  }

  /**
   * Send a message
   */
  async sendMessage(recipientId, message) {
    try {
      const response = await axios.post(`${this.baseURL}/${this.businessAccountId}/messages`, null, {
        params: {
          recipient: {
            id: recipientId
          },
          message: {
            text: message
          },
          access_token: this.accessToken
        }
      });

      return response.data;
    } catch (error) {
      console.error(chalk.red('Error sending message:'), error.response?.data?.error?.message || error.message);
      throw error;
    }
  }

  /**
   * Reply to a message in a conversation
   */
  async replyToMessage(conversationId, message) {
    try {
      // Get the conversation to find participants
      const conversation = await axios.get(`${this.baseURL}/${conversationId}`, {
        params: {
          fields: 'participants',
          access_token: this.accessToken
        }
      });

      // Find the recipient (not the business account)
      const recipient = conversation.data.participants.data.find(
        p => p.id !== this.businessAccountId
      );

      if (!recipient) {
        throw new Error('Could not find recipient in conversation');
      }

      return await this.sendMessage(recipient.id, message);
    } catch (error) {
      console.error(chalk.red('Error replying to message:'), error.response?.data?.error?.message || error.message);
      throw error;
    }
  }

  /**
   * List direct messages (conversations)
   */
  async listDirectMessages(limit = 20) {
    try {
      const conversations = await this.getConversations(limit);
      const threads = [];

      for (const conv of conversations.data || []) {
        // Get recent messages for this conversation
        const messages = await this.getMessages(conv.id, 3);
        threads.push({
          id: conv.id,
          participants: conv.participants,
          lastMessage: conv.last_message,
          unreadCount: conv.unread_count,
          updatedTime: conv.updated_time,
          recentMessages: messages.data
        });
      }

      return threads;
    } catch (error) {
      console.error(chalk.red('Error listing direct messages:'), error.response?.data?.error?.message || error.message);
      throw error;
    }
  }
}

module.exports = MessengerClient;
