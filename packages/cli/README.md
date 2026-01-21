# 🚀 SkyFetch CLI

> Stream your terminal logs and command outputs to a centralized logging platform

[![npm version](https://badge.fury.io/js/%40skyfetch%2Fcli.svg)](https://www.npmjs.com/package/@skyfetch/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-sky--fetch-blue)](https://github.com/RajneeshOjha0/sky-fetch)

**SkyFetch CLI** is a powerful command-line tool that captures your shell history, command outputs, and application logs, streaming them to your SkyFetch platform for centralized monitoring, searching, and analysis.

## ✨ Features

- 🔄 **Real-time Log Streaming** - Automatically capture and stream terminal commands
- 📊 **Command Output Capture** - Run commands and capture their stdout/stderr
- 🎯 **Smart Filtering** - Exclude noisy logs with regex patterns
- 🔐 **Secure Authentication** - API key-based authentication
- 💾 **Offline Support** - Buffer logs locally when offline, sync when back online
- 🐚 **Multi-Shell Support** - Works with bash, zsh, and fish
- ⚡ **Lightweight** - Minimal resource usage
- 🔄 **Auto-retry** - Resilient log delivery with automatic retries
- 📈 **System Monitoring** - Track CPU, memory, and disk usage

## 📦 Installation

### Option 1: Install from npm (Recommended)

```bash
npm install -g @skyfetch/cli
```

### Option 2: Install from Source

If you want to contribute or run the latest development version:

```bash
# Clone the repository
git clone https://github.com/RajneeshOjha0/sky-fetch.git
cd sky-fetch

# Install dependencies
npm install

# Navigate to CLI package
cd packages/cli
npm install

# Link globally for development
npm link

# Verify installation
skyfetch --version
```

## 🚀 Quick Start

### Step 1: Get Your API Credentials

Before using SkyFetch CLI, you need:
1. **API URL** - Your SkyFetch server endpoint
2. **API Key** - Authentication key from your SkyFetch dashboard

#### Running SkyFetch Server Locally

If you want to run the SkyFetch server locally:

```bash
# Clone the repository
git clone https://github.com/RajneeshOjha0/sky-fetch.git
cd sky-fetch

# Install dependencies
npm install

# Set up environment variables
# Create .env file in the root directory with:
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# SMTP_HOST=your_smtp_host (for email)
# SMTP_USER=your_smtp_user
# SMTP_PASS=your_smtp_password

# Start the API server
npm run dev:api

# In another terminal, start the web dashboard
npm run dev:web
```

The API will be available at `http://localhost:3000`

#### Create an Account and Get API Key

1. Open the web dashboard at `http://localhost:5173` (or your deployed URL)
2. Sign up for an account
3. Verify your email with the OTP sent
4. Create an organization
5. Create a project within your organization
6. Go to the API Keys section
7. Generate a new API key for your project
8. Copy the API key (you'll only see it once!)

### Step 2: Configure the CLI

Set up your API endpoint and authentication:

```bash
# Set API endpoint
skyfetch config set apiUrl http://localhost:3000

# Set your API key (get this from your SkyFetch dashboard)
skyfetch config set apiKey sk_your_api_key_here
```

**For production/deployed server:**
```bash
skyfetch config set apiUrl https://your-skyfetch-server.com
skyfetch config set apiKey sk_your_production_api_key
```

### Step 3: Start Capturing Logs

#### Option A: Start Background Agent (Shell History)

Capture all your shell commands automatically:

```bash
skyfetch start
```

This will:
- ✅ Detect your shell (bash/zsh/fish)
- ✅ Find your shell history file
- ✅ Start streaming new commands to SkyFetch
- ✅ Run in the background

#### Option B: Run Specific Commands

Capture output from specific commands:

```bash
# Run a command and capture its output
skyfetch run "npm run dev"

# Run tests and capture results
skyfetch run "npm test"

# Run with log filtering
skyfetch run "npm run dev" --exclude "nodemon|vite|debug"
```

### Step 4: View Your Logs

Open your SkyFetch dashboard to view, search, and analyze your logs:
- **Local**: http://localhost:5173
- **Production**: https://your-skyfetch-server.com

## 📖 Complete Usage Guide

### Configuration Management

#### View All Configuration

```bash
skyfetch config list
```

Output:
```
Current Configuration:
  apiUrl: http://localhost:3000
  apiKey: sk_****************************
  bufferSize: 100
  flushInterval: 10000
```

#### Set Configuration Values

```bash
# Set API URL
skyfetch config set apiUrl http://localhost:3000

# Set API Key
skyfetch config set apiKey sk_your_api_key_here

# Set global log filter
skyfetch config set exclude "nodemon|vite|webpack"

# Set buffer size (number of logs to buffer)
skyfetch config set bufferSize 100

# Set flush interval (milliseconds)
skyfetch config set flushInterval 10000
```

#### Get Specific Configuration

```bash
skyfetch config get apiUrl
skyfetch config get apiKey
```

#### Delete Configuration

```bash
skyfetch config delete exclude
```

### Starting the Background Agent

The background agent monitors your shell history and streams commands to SkyFetch.

```bash
# Start with auto-detected shell
skyfetch start

# Start with specific shell
skyfetch start --shell zsh
skyfetch start --shell bash
skyfetch start --shell fish

# Start with custom history file
skyfetch start --history-file ~/.custom_history
```

**What happens when you start:**
1. CLI detects your shell type
2. Locates your shell history file
3. Starts watching for new commands
4. Buffers logs locally
5. Sends batches to your SkyFetch server
6. Retries on failure

### Running Commands with Capture

Capture stdout and stderr from any command:

```bash
# Basic usage
skyfetch run "npm test"
skyfetch run "python script.py"
skyfetch run "docker-compose up"

# With log filtering
skyfetch run "npm run dev" --exclude "nodemon|vite|debug"

# Long-running processes
skyfetch run "npm start"
```

**The `--exclude` flag:**
- Accepts regex patterns
- Filters out matching log lines
- Reduces noise in your logs

**Examples:**
```bash
# Exclude build tool output
skyfetch run "npm run build" --exclude "webpack|babel"

# Exclude debug logs
skyfetch run "node app.js" --exclude "debug|trace"

# Exclude HTTP request logs
skyfetch run "npm start" --exclude "GET|POST|PUT|DELETE"
```

### Setting Global Filters

Set a filter once, use it everywhere:

```bash
# Set global exclusion pattern
skyfetch config set exclude "nodemon|vite|webpack|debug"

# Now all commands use this filter automatically
skyfetch run "npm run dev"
skyfetch run "npm test"
```

**Common filter patterns:**
- `nodemon|vite` - Exclude build tool output
- `debug|trace` - Exclude debug logs
- `webpack|babel` - Exclude bundler output
- `GET|POST` - Exclude HTTP logs
- `\[HMR\]` - Exclude hot module replacement logs

### System Monitoring

Send system metrics to SkyFetch:

```bash
# This is typically called automatically by the CLI
# But you can also run it manually for testing
node src/scripts/audit.js
```

This sends:
- CPU usage percentage
- Memory usage percentage
- Disk usage percentage
- Timestamp

## 🔧 Advanced Configuration

### Configuration File Location

Configuration is stored in: `~/.skyfetch/config.json`

Example configuration file:
```json
{
  "apiUrl": "http://localhost:3000",
  "apiKey": "sk_your_api_key_here",
  "exclude": "nodemon|vite|debug",
  "bufferSize": 100,
  "flushInterval": 10000
}
```

### Buffer File Location

Logs are buffered locally in: `~/.skyfetch/buffer.log`

This file stores logs when:
- You're offline
- The API is unreachable
- There's a network error

Logs are automatically synced when connection is restored.

### Environment Variables

You can also configure using environment variables:

```bash
# Set environment variables
export SKYFETCH_API_URL=http://localhost:3000
export SKYFETCH_API_KEY=sk_your_api_key_here

# Run CLI (will use environment variables)
skyfetch start
```

**Priority order:**
1. Command-line arguments
2. Environment variables
3. Config file (`~/.skyfetch/config.json`)

### Shell Integration

For automatic startup, add to your shell profile:

**Bash (~/.bashrc or ~/.bash_profile):**
```bash
# Auto-start SkyFetch agent
if command -v skyfetch &> /dev/null; then
    skyfetch start &
fi
```

**Zsh (~/.zshrc):**
```bash
# Auto-start SkyFetch agent
if (( $+commands[skyfetch] )); then
    skyfetch start &
fi
```

**Fish (~/.config/fish/config.fish):**
```fish
# Auto-start SkyFetch agent
if type -q skyfetch
    skyfetch start &
end
```

## 🏗️ Architecture

### Components

```
SkyFetch CLI
├── Config Manager      → Handles configuration storage
├── History Watcher     → Monitors shell history files
├── Command Runner      → Executes commands and captures output
├── Log Buffer          → Buffers logs locally for batch sending
├── API Client          → Communicates with SkyFetch API
├── Retry Logic         → Ensures reliable log delivery
└── Monitoring Service  → Tracks system metrics
```

### Data Flow

```
Shell Command
    ↓
History File
    ↓
Watcher Service → Detects new commands
    ↓
Log Buffer → Stores locally
    ↓
API Client → Sends batch to server
    ↓
SkyFetch API → Stores in MongoDB
    ↓
Web Dashboard → View and search logs
```

## 🔐 Security

- **API Keys**: Stored securely in `~/.skyfetch/config.json` with restricted permissions
- **HTTPS**: All communication with the API uses HTTPS (in production)
- **Local Buffering**: Logs buffered locally if API is unreachable
- **No Sensitive Data**: Passwords and secrets are not logged by default
- **Tenant Isolation**: Logs are isolated by organization and project

## 🐛 Troubleshooting

### CLI not found after installation

**Problem:** `skyfetch: command not found`

**Solution:**
```bash
# Check if npm global bin is in PATH
npm config get prefix

# Add to PATH (Linux/Mac)
export PATH="$(npm config get prefix)/bin:$PATH"

# Add to PATH (Windows)
# Add %APPDATA%\npm to your PATH environment variable

# Or reinstall globally
npm install -g @skyfetch/cli
```

### Logs not appearing in dashboard

**Problem:** Logs sent but not visible in dashboard

**Solution:**
1. Check your API configuration:
   ```bash
   skyfetch config list
   ```

2. Verify API key is valid:
   - Go to your SkyFetch dashboard
   - Check API Keys section
   - Ensure the key is active and not revoked

3. Check network connectivity:
   ```bash
   curl http://localhost:3000/health
   ```

4. View local buffer to see if logs are being captured:
   ```bash
   cat ~/.skyfetch/buffer.log
   ```

5. Check API server logs for errors

### Permission errors

**Problem:** Permission denied errors

**Solution:**
```bash
# Fix permissions on config directory (Linux/Mac)
chmod 755 ~/.skyfetch
chmod 644 ~/.skyfetch/config.json

# On Windows, run as administrator if needed
```

### Shell history not being captured

**Problem:** `start` command doesn't capture new commands

**Solution:**
1. Verify your shell:
   ```bash
   echo $SHELL
   ```

2. Check history file location:
   ```bash
   # Bash
   echo $HISTFILE
   
   # Zsh
   echo $HISTFILE
   ```

3. Manually specify history file:
   ```bash
   skyfetch start --history-file ~/.bash_history
   ```

4. Ensure history is being written:
   ```bash
   # Bash - add to ~/.bashrc
   shopt -s histappend
   PROMPT_COMMAND="history -a; $PROMPT_COMMAND"
   
   # Zsh - add to ~/.zshrc
   setopt INC_APPEND_HISTORY
   ```

### API connection errors

**Problem:** `ECONNREFUSED` or connection timeout

**Solution:**
1. Check if API server is running:
   ```bash
   curl http://localhost:3000/health
   ```

2. Verify API URL is correct:
   ```bash
   skyfetch config get apiUrl
   ```

3. Check firewall settings

4. For local development, ensure MongoDB is running

### High CPU/Memory usage

**Problem:** CLI using too many resources

**Solution:**
1. Increase flush interval (reduce frequency):
   ```bash
   skyfetch config set flushInterval 30000  # 30 seconds
   ```

2. Increase buffer size (send larger batches):
   ```bash
   skyfetch config set bufferSize 200
   ```

3. Add more aggressive filtering:
   ```bash
   skyfetch config set exclude "debug|trace|verbose|nodemon|vite"
   ```

## 💡 Examples & Use Cases

### Example 1: Monitoring Development Server

```bash
# Start dev server with log capture, excluding build tool noise
skyfetch run "npm run dev" --exclude "webpack|hot-update|vite"
```

### Example 2: Capturing Test Results

```bash
# Run tests and stream results to SkyFetch
skyfetch run "npm test"

# Run tests with coverage
skyfetch run "npm run test:coverage"
```

### Example 3: Monitoring Production Deployments

```bash
# Capture deployment logs
skyfetch run "npm run deploy"

# Monitor production app
skyfetch run "pm2 start app.js"
```

### Example 4: Debugging Issues

```bash
# Run with verbose logging
skyfetch run "node --trace-warnings app.js"

# Then search in dashboard for specific errors
```

### Example 5: CI/CD Integration

**GitHub Actions:**
```yaml
name: Test with SkyFetch

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install SkyFetch CLI
        run: npm install -g @skyfetch/cli
      
      - name: Configure SkyFetch
        run: |
          skyfetch config set apiUrl ${{ secrets.SKYFETCH_API_URL }}
          skyfetch config set apiKey ${{ secrets.SKYFETCH_API_KEY }}
      
      - name: Run tests with logging
        run: skyfetch run "npm test"
```

**GitLab CI:**
```yaml
test:
  script:
    - npm install -g @skyfetch/cli
    - skyfetch config set apiUrl $SKYFETCH_API_URL
    - skyfetch config set apiKey $SKYFETCH_API_KEY
    - skyfetch run "npm test"
```

### Example 6: Docker Container Logging

```bash
# Monitor Docker container logs
skyfetch run "docker-compose up"

# Stream specific container logs
skyfetch run "docker logs -f my-container"
```

## 🔗 Related Projects

- **SkyFetch API** - Backend server for log aggregation
- **SkyFetch Web** - Web dashboard for viewing and searching logs
- **SkyFetch Shared** - Shared types and utilities

## 📚 API Reference

### Commands

| Command | Description |
|---------|-------------|
| `skyfetch config list` | View all configuration |
| `skyfetch config set <key> <value>` | Set configuration value |
| `skyfetch config get <key>` | Get configuration value |
| `skyfetch config delete <key>` | Delete configuration value |
| `skyfetch start [options]` | Start background agent |
| `skyfetch run <command> [options]` | Run command with capture |
| `skyfetch --version` | Show version |
| `skyfetch --help` | Show help |

### Configuration Keys

| Key | Description | Default |
|-----|-------------|---------|
| `apiUrl` | SkyFetch API endpoint | - |
| `apiKey` | Authentication API key | - |
| `exclude` | Global regex filter pattern | - |
| `bufferSize` | Number of logs to buffer | 100 |
| `flushInterval` | Flush interval (ms) | 10000 |

### Options

**`skyfetch start` options:**
- `--shell <type>` - Specify shell type (bash/zsh/fish)
- `--history-file <path>` - Custom history file path

**`skyfetch run` options:**
- `--exclude <pattern>` - Regex pattern to exclude logs

## 🤝 Contributing

Contributions are welcome! Here's how to contribute:

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/sky-fetch.git
   cd sky-fetch
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   ```bash
   cd packages/cli
   # Make your changes
   ```

4. **Test your changes**
   ```bash
   npm link
   skyfetch --version
   # Test your feature
   ```

5. **Commit and push**
   ```bash
   git add .
   git commit -m "Add amazing feature"
   git push origin feature/amazing-feature
   ```

6. **Create a Pull Request**
   - Go to GitHub
   - Create a PR from your branch to `main`

## 📄 License

MIT © SkyFetch Team

See [LICENSE](./LICENSE) file for details.

## 🔗 Links

- **GitHub Repository**: https://github.com/RajneeshOjha0/sky-fetch
- **npm Package**: https://www.npmjs.com/package/@skyfetch/cli
- **Issues**: https://github.com/RajneeshOjha0/sky-fetch/issues
- **Documentation**: https://github.com/RajneeshOjha0/sky-fetch#readme

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/RajneeshOjha0/sky-fetch/issues)
- **Discussions**: [GitHub Discussions](https://github.com/RajneeshOjha0/sky-fetch/discussions)

## 🙏 Acknowledgments

Built with:
- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Chalk](https://github.com/chalk/chalk) - Terminal styling
- [Chokidar](https://github.com/paulmillr/chokidar) - File watching
- [Axios](https://github.com/axios/axios) - HTTP client
- [Inquirer](https://github.com/SBoudrias/Inquirer.js) - Interactive prompts

---

**Made with ❤️ by the SkyFetch Team**

**Ready to get started?** Install now:
```bash
npm install -g @skyfetch/cli
```
