const axios = require('axios');
const chalk = require('chalk');

/**
 * Instagram API Client
 * Handles interactions with Instagram Graph API
 */
class InstagramClient {
  constructor(config) {
    this.accessToken = config.access_token;
    this.businessAccountId = config.instagram_business_account_id;
    this.apiVersion = 'v18.0';
    this.baseURL = `https://graph.facebook.com/${this.apiVersion}`;
  }

  /**
   * Get user profile information
   */
  async getProfileInfo() {
    try {
      const response = await axios.get(`${this.baseURL}/${this.businessAccountId}`, {
        params: {
          fields: 'id,username,account_type,media_count,followers_count,biography',
          access_token: this.accessToken
        }
      });

      return response.data;
    } catch (error) {
      console.error(chalk.red('Error fetching profile info:'), error.response?.data?.error?.message || error.message);
      throw error;
    }
  }

  /**
   * Create a container for posting an image
   */
  async createImageContainer(imageUrl, caption) {
    try {
      const response = await axios.post(`${this.baseURL}/${this.businessAccountId}/media`, null, {
        params: {
          image_url: imageUrl,
          caption: caption,
          access_token: this.accessToken
        }
      });

      return response.data;
    } catch (error) {
      console.error(chalk.red('Error creating image container:'), error.response?.data?.error?.message || error.message);
      throw error;
    }
  }

  /**
   * Publish a media container
   */
  async publishMedia(containerId) {
    try {
      const response = await axios.post(`${this.baseURL}/${this.businessAccountId}/media_publish`, null, {
        params: {
          creation_id: containerId,
          access_token: this.accessToken
        }
      });

      return response.data;
    } catch (error) {
      console.error(chalk.red('Error publishing media:'), error.response?.data?.error?.message || error.message);
      throw error;
    }
  }

  /**
   * Post an image with caption
   */
  async postImage(imageUrl, caption) {
    console.log(chalk.blue('Creating media container...'));
    const container = await this.createImageContainer(imageUrl, caption);
    console.log(chalk.green(`Container created with ID: ${container.id}`));

    console.log(chalk.blue('Publishing media...'));
    const result = await this.publishMedia(container.id);
    console.log(chalk.green(`Media published successfully! ID: ${result.id}`));

    return result;
  }

  /**
   * Get comments on a post
   */
  async getComments(postId, limit = 25) {
    try {
      const response = await axios.get(`${this.baseURL}/${postId}/comments`, {
        params: {
          fields: 'id,text,timestamp,username,like_count',
          limit: limit,
          access_token: this.accessToken
        }
      });

      return response.data;
    } catch (error) {
      console.error(chalk.red('Error fetching comments:'), error.response?.data?.error?.message || error.message);
      throw error;
    }
  }

  /**
   * Reply to a comment
   */
  async replyToComment(commentId, message) {
    try {
      const response = await axios.post(`${this.baseURL}/${commentId}/replies`, null, {
        params: {
          message: message,
          access_token: this.accessToken
        }
      });

      return response.data;
    } catch (error) {
      console.error(chalk.red('Error replying to comment:'), error.response?.data?.error?.message || error.message);
      throw error;
    }
  }

  /**
   * Get recent posts
   */
  async getRecentPosts(limit = 10) {
    try {
      const response = await axios.get(`${this.baseURL}/${this.businessAccountId}/media`, {
        params: {
          fields: 'id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count',
          limit: limit,
          access_token: this.accessToken
        }
      });

      return response.data;
    } catch (error) {
      console.error(chalk.red('Error fetching recent posts:'), error.response?.data?.error?.message || error.message);
      throw error;
    }
  }
}

module.exports = InstagramClient;
