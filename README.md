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
- **Database**: MongoDB (Logs), Meilisearch (Search)
- **Agent**: Node.js CLI

## License

MIT
