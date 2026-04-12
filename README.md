# SchemaInsight — Adaptive Schema Integrity Analyzer

A full-stack web application that analyzes how database schema changes affect data redundancy patterns.

## What it does

Users upload two versions of a JSON schema (before and after a structural change) along with a sample dataset. The system detects what changed, identifies redundancy in the data, and reveals how the schema change caused or eliminated that redundancy. It also suggests an improved schema design to fix detected redundancy.

## The problem it solves

Existing tools treat schema evolution and redundancy detection as separate problems. No tool analyzes how schema changes dynamically introduce or eliminate redundancy — that is the gap this project fills.

## Team

| Member | Role | Tools |
|---|---|---|
| Vishakh S Gaitonde (1MS23CS221) | Frontend + Containerization + CI/CD | React.js, Docker, GitHub Actions |
| Yash Ingale (1MS23CS224) | Backend + Security + Monitoring + IaC | Node.js, Express.js, Jest, SonarQube, Trivy, Prometheus, Grafana, Terraform |

---

## Tech Stack

**Application**
- MongoDB — stores schema versions and analysis results
- Express.js — REST API
- React.js — frontend dashboard
- Node.js — backend runtime

### DevSecOps Pipeline
- GitHub Actions — CI/CD automation  
- Docker & Docker Compose — Containerization  
- Jest — Unit testing  
- SonarQube — Static code analysis  
- Trivy — Container vulnerability scanning  
- Terraform — Infrastructure as Code  
- Prometheus + Grafana — Monitoring & dashboards  

---

## 📁 Project Structure

    schemainsight/
    ├── backend/
    │   ├── src/
    │   │   ├── engines/
    │   │   │   ├── schemaDiff.js
    │   │   │   ├── redundancyDetector.js
    │   │   │   └── impactAnalyzer.js
    │   │   ├── models/
    │   │   │   └── Analysis.js
    │   │   ├── routes/
    │   │   │   └── analysis.js
    │   │   └── app.js
    │   ├── tests/
    │   │   └── schemaDiff.test.js
    │   └── Dockerfile
    │
    ├── frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   │   ├── UploadForm.jsx
    │   │   │   └── ReportView.jsx
    │   │   ├── App.jsx
    │   │   └── main.jsx
    │   └── Dockerfile
    │
    ├── .github/
    │   └── workflows/
    │       └── ci.yml
    │
    ├── docker-compose.yml
    └── README.md

---


## How to Run

### Prerequisites
- Node.js v18+
- Docker Desktop
- Git

### Option 1 — Run locally (development)

```bash
# Backend
cd backend
npm install
npm run dev
# Runs on http://localhost:5000

# Frontend (new terminal)
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### Option 2 — Run with Docker Compose

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| Health check | http://localhost:5000/health |
| Prometheus metrics | http://localhost:5000/metrics |

### Stop

```bash
# Stop containers
Ctrl + C

# Remove containers
docker compose down
```

---

## API

### POST `/api/analysis/analyze`

**Request body:**
```json
{
  "schemaV1": { "full_name": "string", "email": "string" },
  "schemaV2": { "first_name": "string", "last_name": "string", "email": "string" },
  "dataset": [
    { "full_name": "John Doe", "first_name": "John", "last_name": "Doe", "email": "john@example.com" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "diff": { "added": ["first_name", "last_name"], "removed": ["full_name"], "modified": [] },
    "redundanciesV2": [
      { "type": "derived", "fields": ["full_name", "first_name", "last_name"], "message": "..." }
    ],
    "impact": {
      "insights": [{ "type": "introduced", "message": "...", "recommendation": "..." }],
      "redundancyScore": 25
    }
  }
}
```

---

## CI/CD Pipeline

    Every push to `main` or `develop` triggers the following stages automatically:
    Push to GitHub
          ↓
    Backend Tests (Jest)
          ↓
    Frontend Build (Vite)
          ↓
    Docker Image Build
          ↓
    Trivy Security Scan
    View pipeline runs under the **Actions** tab in GitHub.

---

## Running Tests

```bash
cd backend
npm test
```

Currently covers:
- Schema diff detection (added, removed, modified fields)
- Edge cases (identical schemas, type changes)

---

## Week 1 Progress

- [x] MERN project structure set up
- [x] Express backend with health check and Prometheus metrics endpoint
- [x] MongoDB integration (graceful fallback if unavailable)
- [x] Schema Difference Engine
- [x] Redundancy Detection Engine (duplicate fields, derived fields)
- [x] Impact Analysis Engine (links schema changes to redundancy)
- [x] Schema Recommendation Engine (rule-based improvement suggestions)
- [x] React frontend with schema input and report display
- [x] Docker + Docker Compose setup
- [x] GitHub Actions CI pipeline (test → build → security scan)
- [x] Jest unit tests for core engine

## Upcoming (Week 2)

- [ ] Refine redundancy detection rules
- [ ] Redundancy score visualization in UI
- [ ] SonarQube integration in pipeline
- [ ] Postman/Newman API tests in CI
