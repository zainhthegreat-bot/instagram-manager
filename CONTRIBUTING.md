# Contributing to Instagram Manager

Thank you for considering contributing to Instagram Manager! We welcome contributions from the community.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors. We value respect, collaboration, and diverse perspectives.

### Our Standards

**Examples of behavior that contributes to a positive environment:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Examples of unacceptable behavior:**
- Use of sexualized language or imagery
- Trolling, insulting/derogatory comments, or personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Unethical or unprofessional conduct

### Reporting Issues

If you encounter any issues or have concerns about code of conduct violations, please contact the maintainers privately.

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:
- Node.js 14.0 or higher
- npm or yarn
- Git installed and configured
- A GitHub account
- Familiarity with JavaScript/Node.js

### Setting Up Your Development Environment

1. **Fork the Repository**
   ```bash
   # Visit https://github.com/zainhthegreat-bot/instagram-manager
   # Click the "Fork" button in the top-right corner
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/instagram-manager.git
   cd instagram-manager
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/zainhthegreat-bot/instagram-manager.git
   ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

5. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## Development Setup

### Running the CLI

For development, you can run the CLI directly:

```bash
node index.js --help
```

Or link it globally to test it like a user:

```bash
npm link
instagram-manager --help
```

### Testing Configuration

Create a local `config.json` and `.env` file for testing (these are in .gitignore):

```bash
cp config.example.json config.json
cp .env.example .env
```

Edit these files with your test credentials.

**⚠️ Important:** Never commit your test credentials!

### Project Structure

```
instagram-manager/
├── index.js              # CLI entry point
├── lib/                  # Core modules
│   ├── auth.js          # Authentication handling
│   ├── instagram.js     # Instagram API client
│   └── messenger.js     # Messenger API client
└── tests/               # Test files (when added)
```

---

## Making Changes

### Choosing What to Work On

**Good first contributions:**
- Documentation improvements
- Bug fixes
- Adding tests
- Small feature enhancements
- Code refactoring

**For larger features:**
1. Check if there's an existing issue or feature request
2. If not, create an issue to discuss the feature first
3. Wait for maintainer approval before starting
4. Break down large features into smaller PRs

### Branch Naming

Use descriptive branch names:

- `feature/add-video-support`
- `fix/auth-validation-error`
- `docs/update-readme`
- `refactor/api-client-structure`
- `test/add-unit-tests`

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

**Examples:**
```
feat(post): add video posting support

Add ability to post videos to Instagram using the post command.
Supports MP4 format up to 60 seconds.

Closes #123
```

```
fix(auth): validate access token format

Improve validation to check for proper access token format
before making API calls. Prevents confusing error messages.

Fixes #45
```

---

## Pull Request Process

### Before Submitting

1. **Sync with Upstream**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run Tests** (when available)
   ```bash
   npm test
   ```

3. **Lint Your Code** (when linter is added)
   ```bash
   npm run lint
   ```

4. **Test Your Changes**
   - Test all commands you modified
   - Test edge cases
   - Test error handling

### Creating Your Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Go to the repository on GitHub and click "New Pull Request"

3. Fill out the PR template with:
   - Description of changes
   - Related issues
   - Testing performed
   - Screenshots (if applicable)

4. Request review from maintainers

### PR Review Process

1. **Initial Review**: Maintainers will review your code
2. **Feedback**: Address any comments or requested changes
3. **Approval**: Once approved, your PR will be merged
4. **Merge**: Maintainers will squash and merge your changes

### Keeping Your PR Updated

Keep your branch in sync with upstream:

```bash
git fetch upstream
git rebase upstream/main
git push origin feature/your-feature-name --force
```

---

## Coding Standards

### JavaScript Style

- Use **camelCase** for variables and functions
- Use **PascalCase** for classes and constructors
- Use **UPPER_SNAKE_CASE** for constants
- Use **2 spaces** for indentation (no tabs)
- Use **single quotes** for strings (unless inside single quotes)
- Add **semicolons** at the end of statements
- Use **const** by default, **let** when reassignment is needed

**Example:**
```javascript
const InstagramClient = require('./instagram');

const MAX_RETRIES = 3;
const DEFAULT_TIMEOUT = 5000;

class MyClass {
  constructor(config) {
    this.config = config;
  }

  async fetchData() {
    try {
      const data = await this.apiCall();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error.message);
      throw error;
    }
  }
}

module.exports = MyClass;
```

### Error Handling

- Always handle errors with try-catch blocks
- Provide meaningful error messages
- Use chalk for colored error output
- Include context in error messages

**Example:**
```javascript
try {
  const response = await axios.get(url);
  return response.data;
} catch (error) {
  console.error(chalk.red('Error fetching data:'), error.response?.data?.error?.message || error.message);
  throw error;
}
```

### Comments and Documentation

- Add JSDoc comments for all public functions and classes
- Comment complex logic
- Keep comments up-to-date
- Avoid obvious comments

**Example:**
```javascript
/**
 * Fetch user profile information from Instagram
 * @param {string} userId - The Instagram user ID
 * @returns {Promise<Object>} Profile data
 * @throws {Error} If API request fails
 */
async getProfile(userId) {
  const response = await this.apiCall(userId);
  return response.data;
}
```

### File Naming

- Use **lowercase** with **hyphens** for files
- Match file names to module names where possible
- Keep file names descriptive but concise

---

## Testing

### Running Tests

When tests are added:

```bash
# Run all tests
npm test

# Run specific test file
npm test auth.test.js

# Run with coverage
npm test -- --coverage
```

### Writing Tests

- Write tests for all new features
- Test happy path and edge cases
- Test error handling
- Use descriptive test names

**Example:**
```javascript
describe('AuthHandler', () => {
  describe('validateConfig', () => {
    it('should return valid for correct config', () => {
      const auth = new AuthHandler();
      const result = await auth.validateConfig();
      expect(result.valid).toBe(true);
    });

    it('should return error for missing access token', () => {
      const auth = new AuthHandler();
      // Test implementation
    });
  });
});
```

---

## Documentation

### When to Update Documentation

Update documentation when you:
- Add a new command or option
- Change existing functionality
- Fix a bug that affects user experience
- Add a new feature
- Change configuration options

### Documentation Files

- **README.md**: Main documentation, update for user-facing changes
- **CHANGELOG.md**: Document version history
- **Wiki Pages**: Add to wiki for guides and references
- **Code Comments**: Update JSDoc for code changes

### Writing Documentation

- Use clear, simple language
- Provide examples
- Include command-line examples
- Keep screenshots up-to-date (if applicable)
- Use formatting (bold, code blocks, tables) effectively

---

## Reporting Issues

### Before Reporting

1. Check existing issues to avoid duplicates
2. Check the troubleshooting section in README
3. Verify you're using the latest version
4. Check if the issue is already fixed in the latest main branch

### Issue Template

When creating an issue, include:

**Bug Report:**
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment (Node.js version, OS)
- Error messages or screenshots
- Possible solutions

**Feature Request:**
- Description of the feature
- Use case and motivation
- Proposed implementation
- Alternatives considered
- Mockups or examples (if applicable)

---

## Feature Requests

### Before Requesting

1. Check if the feature already exists or is planned
2. Search existing issues
3. Check if the feature fits the project scope

### Making a Request

Use the feature request template on GitHub Issues. Include:
- Clear description of the feature
- Why you need it (use case)
- How you envision it working
- Any relevant examples or references
- Willingness to contribute (if applicable)

---

## Questions?

If you have questions about contributing:
- Check existing issues and discussions
- Read the [GitHub Wiki](https://github.com/zainhthegreat-bot/instagram-manager/wiki)
- Create a question issue using the "question" label

---

## Recognition

Contributors will be recognized in:
- The contributors section of README
- Release notes for their contributions
- Special contributor shout-outs in major releases

---

Thank you for contributing to Instagram Manager! 🎉
