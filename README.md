# 🚀 SkyFetch

> A unified log aggregation and search platform for developers

<!-- [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) -->
[![GitHub](https://img.shields.io/badge/GitHub-sky--fetch-blue)](https://github.com/RajneeshOjha0/sky-fetch)
[![npm](https://img.shields.io/badge/npm-%40skyfetch%2Fcli-red)](https://www.npmjs.com/package/@skyfetch/cli)

**SkyFetch** is a comprehensive logging platform that captures terminal logs, command outputs, and application logs, making them searchable and analyzable in one centralized dashboard. Perfect for developers, DevOps teams, and anyone who needs to track and debug their terminal activities.

## ✨ Features

- 🔄 **Real-time Log Streaming** - Capture terminal commands and outputs automatically
- 🔍 **Powerful Search** - Full-text search across all your logs with MongoDB Atlas Search
- 🎯 **Smart Filtering** - Filter by level, source, date, organization, and project
- 📊 **Web Dashboard** - Beautiful React-based UI for viewing and analyzing logs
- 🏢 **Multi-tenancy** - Organization and project-based isolation
- 🔐 **Secure Authentication** - JWT-based auth with email verification
- 📈 **System Monitoring** - Track CPU, memory, and disk usage
- 🌙 **Dark Mode** - Eye-friendly dark theme support
- 🐚 **Multi-Shell Support** - Works with bash, zsh, and fish
- 💾 **Offline Support** - Buffers logs locally when offline

## 📦 Project Structure

This is a monorepo managed by npm workspaces:

```
sky-fetch/
├── packages/
│   ├── api/              # Backend Express server
│   │   ├── src/
│   │   │   ├── routes/   # API routes
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── models/   # MongoDB models
│   │   │   └── middlewares/
│   │   └── package.json
│   │
│   ├── cli/              # Terminal agent (npm package)
│   │   ├── src/
│   │   │   ├── commands/ # CLI commands
│   │   │   ├── services/ # Core services
│   │   │   └── utils/
│   │   └── package.json
│   │
│   ├── sky-fetch-web/    # React dashboard
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   └── api.js
│   │   └── package.json
│   │
│   └── shared/           # Shared types and utilities
│       └── index.js
│
├── package.json          # Root workspace config
└── README.md
```

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have:

- **Node.js** (v14 or higher)
- **npm** (v7 or higher)
- **MongoDB** (local or MongoDB Atlas account)
- **Git**

### Option 1: Complete Installation (Recommended)

This will set up the entire SkyFetch platform locally.

#### Step 1: Clone the Repository

```bash
git clone https://github.com/RajneeshOjha0/sky-fetch.git
cd sky-fetch
```

#### Step 2: Install Dependencies

```bash
# Install all dependencies for all packages
npm install
```

This will install dependencies for:
- Root workspace
- API server
- CLI tool
- Web dashboard
- Shared utilities

#### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/skyfetch
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skyfetch

# JWT Secret (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_change_this

# Email Configuration (for OTP verification)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# API Configuration
PORT=3000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**For Gmail SMTP:**
1. Enable 2-factor authentication on your Google account
2. Generate an "App Password" from Google Account settings
3. Use that app password in `SMTP_PASS`

#### Step 4: Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB locally
# macOS
brew install mongodb-community

# Ubuntu
sudo apt-get install mongodb

# Start MongoDB
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

#### Step 5: Start the Development Servers

**Terminal 1 - Start API Server:**
```bash
npm run dev:api
```

The API will be available at `http://localhost:3000`

**Terminal 2 - Start Web Dashboard:**
```bash
npm run dev:web
```

The dashboard will be available at `http://localhost:5173`

#### Step 6: Set Up the CLI

**Terminal 3 - Link CLI for development:**
```bash
cd packages/cli
npm link
```

Now you can use the `skyfetch` command globally.

### Option 2: Install CLI Only (From npm)

If you just want to use the CLI tool:

```bash
# Install globally from npm
npm install -g @skyfetch/cli

# Configure
skyfetch config set apiUrl http://localhost:3000
skyfetch config set apiKey your_api_key_here

# Start capturing logs
skyfetch start
```

## 📖 Complete Setup Guide

### 1. Create Your Account

1. Open the web dashboard: `http://localhost:5173`
2. Click "Sign Up"
3. Enter your details (name, email, password)
4. Check your email for OTP verification code
5. Enter the OTP to verify your account
6. Login with your credentials

### 2. Create Organization and Project

1. After logging in, go to "Organizations" in the sidebar
2. Click "Create Organization"
3. Enter organization name (e.g., "My Company")
4. Click "Create Project" within your organization
5. Enter project name (e.g., "Production App")

### 3. Generate API Key

1. Go to "API Keys" in the sidebar
2. Click "Generate New Key"
3. Enter a name for the key (e.g., "Development Machine")
4. Select the project this key will be used for
5. Click "Generate"
6. **Copy the API key immediately** (you won't see it again!)

### 4. Configure CLI

```bash
# Set API endpoint
skyfetch config set apiUrl http://localhost:3000

# Set your API key
skyfetch config set apiKey sk_your_generated_api_key_here

# Verify configuration
skyfetch config list
```

### 5. Start Capturing Logs

**Option A: Background Agent (Shell History)**
```bash
skyfetch start
```

This will:
- Detect your shell (bash/zsh/fish)
- Monitor your shell history file
- Stream new commands to SkyFetch
- Run in the background

**Option B: Run Specific Commands**
```bash
# Run a command and capture output
skyfetch run "npm test"

# Run with filtering
skyfetch run "npm run dev" --exclude "nodemon|vite"
```

### 6. View Your Logs

1. Open the dashboard: `http://localhost:5173`
2. Go to "Live Logs"
3. See your captured commands and outputs
4. Use search and filters to find specific logs
5. Click on any log to see full details and context

## 🔧 Configuration

### API Server Configuration

Edit `.env` in the root directory:

```bash
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/skyfetch

# Authentication
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# CORS
FRONTEND_URL=http://localhost:5173
```

### CLI Configuration

Configuration is stored in `~/.skyfetch/config.json`:

```json
{
  "apiUrl": "http://localhost:3000",
  "apiKey": "sk_your_api_key",
  "bufferSize": 100,
  "flushInterval": 10000,
  "exclude": "nodemon|vite|debug"
}
```

**Configure via CLI:**
```bash
skyfetch config set apiUrl http://localhost:3000
skyfetch config set apiKey sk_your_key
skyfetch config set exclude "nodemon|vite|debug"
skyfetch config set bufferSize 100
skyfetch config set flushInterval 10000
```

## 🛠️ Development

### Running Individual Services

```bash
# API Server only
npm run dev:api

# Web Dashboard only
npm run dev:web

# Both together
npm run dev
```

### Building for Production

```bash
# Build web dashboard
cd packages/sky-fetch-web
npm run build

# The built files will be in packages/sky-fetch-web/dist
```

### Running Tests

```bash
# Run all tests
npm test

# Test specific package
npm test -w packages/api
```

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `POST /auth/verify-email` - Verify email with OTP
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update profile

### Logs
- `POST /api/logs/batch` - Ingest log batch
- `GET /api/logs/search` - Search logs
- `GET /api/logs/:id/context` - Get log context

### Organizations & Projects
- `POST /api/hierarchy/organizations` - Create organization
- `GET /api/hierarchy/organizations` - List organizations
- `POST /api/hierarchy/projects` - Create project
- `GET /api/hierarchy/projects` - List projects

### API Keys
- `POST /auth/keys` - Generate API key
- `GET /auth/keys` - List API keys
- `POST /auth/keys/:id/reveal` - Reveal API key

### Health & Monitoring
- `GET /health` - Health check
- `GET /health/metrics` - System metrics

## 🎯 Usage Examples

### Monitoring Development Server

```bash
skyfetch run "npm run dev" --exclude "webpack|hot-update"
```

### Capturing Test Results

```bash
skyfetch run "npm test"
```

### Background Shell Monitoring

```bash
# Start monitoring
skyfetch start

# Your commands are now automatically captured
git status
npm install
docker ps
```

### Filtering Logs in Dashboard

1. Open dashboard
2. Use search bar for text search
3. Apply filters:
   - **Level**: info, warn, error, debug
   - **Source**: terminal, github, gitlab, ci
   - **Date Range**: From/To dates
   - **Organization**: Select organization
   - **Project**: Select project

### Viewing Log Details

1. Click on any log entry
2. See full message and metadata
3. Expand "Context View" to see logs before and after
4. View session ID, host ID, trace ID

## 🔐 Security

- **Authentication**: JWT-based with email verification
- **API Keys**: Scoped to projects, encrypted storage
- **Tenant Isolation**: Organization-based data separation
- **HTTPS**: Use HTTPS in production
- **Environment Variables**: Never commit `.env` files
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Implement in production

## 🚀 Deployment

### Deploy API Server

**Using PM2:**
```bash
# Install PM2
npm install -g pm2

# Start API
cd packages/api
pm2 start src/index.js --name skyfetch-api

# Save process list
pm2 save
pm2 startup
```

**Using Docker:**
```dockerfile
# Dockerfile for API
FROM node:18-alpine
WORKDIR /app
COPY packages/api/package*.json ./
RUN npm install --production
COPY packages/api .
EXPOSE 3000
CMD ["node", "src/index.js"]
```

### Deploy Web Dashboard

**Build and serve:**
```bash
cd packages/sky-fetch-web
npm run build

# Serve with nginx, Apache, or any static host
# Built files are in dist/
```

**Deploy to Vercel/Netlify:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd packages/sky-fetch-web
vercel
```

### Environment Variables for Production

```bash
# API
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=strong_random_secret
FRONTEND_URL=https://your-domain.com

# Web
VITE_API_URL=https://api.your-domain.com
```

## 🐛 Troubleshooting

### API Server Won't Start

**Problem**: `Error: Cannot connect to MongoDB`

**Solution**:
```bash
# Check MongoDB is running
mongod --version

# Check connection string in .env
echo $MONGODB_URI

# Test connection
mongosh "your_connection_string"
```

### CLI Not Capturing Logs

**Problem**: `skyfetch start` doesn't capture commands

**Solution**:
```bash
# Check shell history is enabled
# For bash, add to ~/.bashrc:
shopt -s histappend
PROMPT_COMMAND="history -a; $PROMPT_COMMAND"

# For zsh, add to ~/.zshrc:
setopt INC_APPEND_HISTORY

# Restart shell
exec $SHELL
```

### Logs Not Appearing in Dashboard

**Problem**: Logs sent but not visible

**Solution**:
1. Check API key is valid
2. Verify organization/project filters
3. Check API server logs for errors
4. Verify MongoDB connection
5. Check browser console for errors

### Email Verification Not Working

**Problem**: OTP emails not received

**Solution**:
1. Check SMTP credentials in `.env`
2. For Gmail, use App Password (not regular password)
3. Check spam folder
4. Verify SMTP_HOST and SMTP_PORT
5. Check API server logs for email errors

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Commit**: `git commit -m 'Add amazing feature'`
5. **Push**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Test thoroughly before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **GitHub Repository**: https://github.com/RajneeshOjha0/sky-fetch
- **CLI npm Package**: https://www.npmjs.com/package/@skyfetch/cli
- **Issues**: https://github.com/RajneeshOjha0/sky-fetch/issues
- **Discussions**: https://github.com/RajneeshOjha0/sky-fetch/discussions

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/RajneeshOjha0/sky-fetch/issues)
- **Discussions**: [GitHub Discussions](https://github.com/RajneeshOjha0/sky-fetch/discussions)

## 🙏 Acknowledgments

Built with:
- [Express](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database
- [React](https://react.dev/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Axios](https://axios-http.com/) - HTTP client

## 🎯 Tech Stack

### Backend (API)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Search**: MongoDB Atlas Search
- **Authentication**: JWT, bcrypt
- **Validation**: Zod
- **Email**: Nodemailer

### Frontend (Web Dashboard)
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router
- **Icons**: Lucide React
- **HTTP Client**: Axios

### CLI (Terminal Agent)
- **Runtime**: Node.js
- **CLI Framework**: Commander.js
- **File Watching**: Chokidar
- **HTTP Client**: Axios with retry
- **Styling**: Chalk
- **Prompts**: Inquirer

## 📊 Current Status

- ✅ **API**: Fully functional with authentication, multi-tenancy
- ✅ **CLI**: Published on npm, captures logs, offline support
- ✅ **Web**: Dashboard with search, filters, dark mode
- ✅ **Auth**: Registration, login, email verification, password reset
- ✅ **Multi-tenancy**: Organizations, projects, scoped API keys
- ✅ **Monitoring**: System metrics, resource alerts
- ✅ **Log Details**: Expandable metadata, context view

## 🗺️ Roadmap

- [ ] Live log streaming (WebSockets)
- [ ] Log analytics and insights
- [ ] Custom dashboards
- [ ] Alerting and notifications
- [ ] Log retention policies
- [ ] Export logs (CSV, JSON)
- [ ] Team collaboration features
- [ ] Mobile app

---

**Made with ❤️ by the SkyFetch Team**

**Ready to get started?** Clone the repo and follow the Quick Start guide above!

```bash
git clone https://github.com/RajneeshOjha0/sky-fetch.git
cd sky-fetch
npm install
```
