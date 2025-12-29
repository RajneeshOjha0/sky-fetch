# SkyFetch Development Plan (JavaScript Edition)

## Phase 1: The Foundation (API & Storage)
**Goal:** A working Express API that receives, validates, and stores logs.

- [x] **Day 1: Project Setup & Schema**
  - [x] Initialize Monorepo (`api`, `cli`, `shared`)
  - [x] Define `LogEvent` schema (JSDoc) in `@skyfetch/shared`
  - [x] Configure CommonJS structure

- [x] **Day 2: Express API Skeleton**
  - [x] Setup Express
  - [x] Configure Middleware (Cors, Helmet, Morgan)
  - [x] Create `/health` endpoint

- [x] **Day 3: Ingest Endpoint**
  - [x] Create `POST /logs/batch`
  - [x] Implement Zod validation
  - [x] Handle batch processing

- [x] **Day 4: Database Integration (MongoDB)**
  - [x] Setup MongoDB connection (Mongoose)
  - [x] Define Log Schema in Mongoose
  - [x] Save valid logs to DB

- [x] **Day 5: Search Engine (MongoDB Atlas Search)**
  - [x] Create Search Index in Atlas UI
  - [x] Implement `$search` aggregation pipeline
  - [x] Create `GET /logs/search` endpoint

- [x] **Day 6: Reliability & Error Handling**
  - [x] Global error handler
  - [x] Graceful shutdown
  - [x] Input sanitization

- [x] **Day 7: End-to-End Testing**
  - [x] Script to send fake logs
  - [x] Verify storage in Mongo
  - [x] Verify search in Meilisearch

## Phase 2: The CLI Agent
**Goal:** A robust CLI tool to capture and ship terminal logs.

- [x] **Day 8: CLI Skeleton**
  - [x] Setup Commander/Yargs
  - [x] Config management (`~/.skyfetch/config.json`)

- [x] **Day 9: Shell History Hooks**
  - [x] Read `.bash_history` / `.zsh_history`
  - [x] File watcher implementation

- [x] **Day 10: Buffering & Batching**
  - [x] Local buffer file (append-only)
  - [x] Flush logic (every 10s or 100 logs)

- [x] **Day 11: Authentication**
  - [x] API Key handshake
  - [x] Local credential storage

- [x] **Day 12: Resilience**
  - [x] Retry logic for failed uploads
  - [x] Offline mode handling

- [x] **Day 13: Optimization**
  - [x] Resource usage audit
  - [x] Startup time optimization

- [x] **Day 14: CLI Polish**
  - [x] Installation script
  - [x] Self-update mechanism

## Phase 3: The Dashboard (Frontend)
**Goal:** A React interface to visualize and search logs.

- [x] **Day 15: Frontend Setup**
  - [x] React + Vite + Tailwind (in `packages/sky-fetch-web`)
  - [x] API Client setup

- [ ] **Day 16: Search Interface**
  - [ ] Search bar component
  - [ ] Results list view

- [ ] **Day 17: Log Stream**
  - [ ] Live tail view
  - [ ] Auto-refresh logic

- [ ] **Day 18: Filtering**
  - [ ] Filter by source/level/date
  - [ ] Faceted search

- [ ] **Day 19: Log Details**
  - [ ] Expanded view for JSON metadata
  - [ ] Context view (logs around time)

- [ ] **Day 20: UI Polish**
  - [ ] Dark mode
  - [ ] Keyboard shortcuts

- [ ] **Day 21: Launch Prep**
  - [ ] Docker Compose for full stack
  - [ ] Documentation
