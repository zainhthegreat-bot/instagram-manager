const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');

/**
 * Authentication Handler
 * Manages OAuth tokens and configuration
 */
class AuthHandler {
  constructor() {
    this.configPath = path.join(process.cwd(), 'config.json');
    this.envPath = path.join(process.cwd(), '.env');
  }

  /**
   * Check if config exists
   */
  hasConfig() {
    return fs.existsSync(this.configPath);
  }

  /**
   * Load configuration
   */
  loadConfig() {
    if (!this.hasConfig()) {
      throw new Error('No configuration file found. Run "auth setup" first.');
    }

    try {
      const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
      return config;
    } catch (error) {
      throw new Error('Failed to parse configuration file.');
    }
  }

  /**
   * Interactive setup flow
   */
  async setup() {
    console.log(chalk.bold.blue('\n📸 Instagram Manager - Authentication Setup\n'));

    const questions = [
      {
        type: 'input',
        name: 'access_token',
        message: 'Enter your Meta Access Token:',
        validate: input => input.length > 0 || 'Access token is required'
      },
      {
        type: 'input',
        name: 'instagram_business_account_id',
        message: 'Enter your Instagram Business Account ID:',
        validate: input => input.length > 0 || 'Instagram Business Account ID is required'
      },
      {
        type: 'input',
        name: 'app_id',
        message: 'Enter your Meta App ID:',
        validate: input => input.length > 0 || 'App ID is required'
      },
      {
        type: 'input',
        name: 'app_secret',
        message: 'Enter your Meta App Secret:',
        validate: input => input.length > 0 || 'App Secret is required'
      }
    ];

    const answers = await inquirer.prompt(questions);

    // Save configuration
    const config = {
      access_token: answers.access_token,
      instagram_business_account_id: answers.instagram_business_account_id,
      app_id: answers.app_id,
      app_secret: answers.app_secret
    };

    fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));

    // Create .env file
    const envContent = `INSTAGRAM_ACCESS_TOKEN=${answers.access_token}
INSTAGRAM_BUSINESS_ACCOUNT_ID=${answers.instagram_business_account_id}
INSTAGRAM_APP_ID=${answers.app_id}
INSTAGRAM_APP_SECRET=${answers.app_secret}
`;

    fs.writeFileSync(this.envPath, envContent);

    console.log(chalk.green('\n✓ Authentication setup complete!\n'));
    console.log(chalk.yellow('Configuration files created:'));
    console.log(chalk.gray('  - config.json'));
    console.log(chalk.gray('  - .env\n'));
    console.log(chalk.blue('You can now use Instagram Manager commands.\n'));

    return config;
  }

  /**
   * Validate current configuration
   */
  async validateConfig() {
    try {
      const config = this.loadConfig();
      const required = ['access_token', 'instagram_business_account_id', 'app_id', 'app_secret'];

      for (const field of required) {
        if (!config[field] || config[field] === 'YOUR_META_ACCESS_TOKEN' || config[field] === 'YOUR_IG_ID') {
          throw new Error(`Missing or invalid configuration: ${field}`);
        }
      }

      return { valid: true, config };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  /**
   * Clear authentication (for reset)
   */
  clearAuth() {
    if (fs.existsSync(this.configPath)) {
      fs.unlinkSync(this.configPath);
    }

    if (fs.existsSync(this.envPath)) {
      fs.unlinkSync(this.envPath);
    }

    console.log(chalk.green('\n✓ Authentication cleared successfully.\n'));
  }
}

module.exports = AuthHandler;
