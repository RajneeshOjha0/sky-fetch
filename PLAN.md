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

- [ ] **Day 4: Database Integration (MongoDB)**
  - [ ] Setup MongoDB connection (Mongoose)
  - [ ] Define Log Schema in Mongoose
  - [ ] Save valid logs to DB

- [ ] **Day 5: Search Engine (Meilisearch)**
  - [ ] Setup Meilisearch instance
  - [ ] Implement sync logic (Mongo -> Meili)
  - [ ] Create search index configuration

- [ ] **Day 6: Reliability & Error Handling**
  - [ ] Global error handler
  - [ ] Graceful shutdown
  - [ ] Input sanitization

- [ ] **Day 7: End-to-End Testing**
  - [ ] Script to send fake logs
  - [ ] Verify storage in Mongo
  - [ ] Verify search in Meilisearch

## Phase 2: The CLI Agent
**Goal:** A robust CLI tool to capture and ship terminal logs.

- [ ] **Day 8: CLI Skeleton**
  - [ ] Setup Commander/Yargs
  - [ ] Config management (`~/.skyfetch/config.json`)

- [ ] **Day 9: Shell History Hooks**
  - [ ] Read `.bash_history` / `.zsh_history`
  - [ ] File watcher implementation

- [ ] **Day 10: Buffering & Batching**
  - [ ] Local buffer file (append-only)
  - [ ] Flush logic (every 10s or 100 logs)

- [ ] **Day 11: Authentication**
  - [ ] API Key handshake
  - [ ] Local credential storage

- [ ] **Day 12: Resilience**
  - [ ] Retry logic for failed uploads
  - [ ] Offline mode handling

- [ ] **Day 13: Optimization**
  - [ ] Resource usage audit
  - [ ] Startup time optimization

- [ ] **Day 14: CLI Polish**
  - [ ] Installation script
  - [ ] Self-update mechanism

## Phase 3: The Dashboard (Frontend)
**Goal:** A React interface to visualize and search logs.

- [ ] **Day 15: Frontend Setup**
  - [ ] React + Vite + Tailwind
  - [ ] API Client setup

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
