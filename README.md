# SkyFetch

SkyFetch is a unified log and activity search platform for developers. It captures terminal logs, GitHub activity, and CI/CD logs, making them searchable in one place.

## Project Structure

This is a monorepo managed by npm workspaces:

- **packages/api**: The backend Express server (Ingest & Search API).
- **packages/cli**: The terminal agent that captures and ships logs.
- **packages/shared**: Shared logic and schemas (LogEvent definition).

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the API Server**
   ```bash
   npm run dev -w packages/api
   ```

## Tech Stack

- **Runtime**: Node.js (JavaScript/CommonJS)
- **API**: Express, Zod, Morgan
- **Database**: MongoDB (Logs), MongoDB Atlas Search (Search)
- **Agent**: Node.js CLI (Commander, Chokidar)
- **Web**: React, Vite, TailwindCSS

## Current Status
- **API**: Ingest & Search endpoints active.
- **CLI**: Captures shell history, buffers logs, and syncs to API.
- **Search**: Full-text search via Atlas Search using mongodb indexing.
- **Web**: Dashboard with search bar and filters.

## License

MIT
