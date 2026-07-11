# Dockerized Todo App

A simple fullstack Todo application (Node.js/Express API + MongoDB + vanilla JS frontend), fully containerized with Docker so it can be built and run on any machine with minimal setup.

## Tech Stack

- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Frontend:** Vanilla HTML/CSS/JS (served statically by Express)
- **Containerization:** Docker (multi-stage build, `node:20-alpine` base) + Docker Compose

## Project Structure

```
fullstack-dockerize/
├── backend/
│   ├── models/Todo.js       # Mongoose schema
│   ├── routes/todos.js      # REST API routes
│   ├── public/               # Static frontend (HTML/CSS/JS)
│   ├── server.js             # Express entrypoint
│   └── package.json
├── Dockerfile                 # Multi-stage, lightweight image build
├── .dockerignore
├── docker-compose.yml         # App + MongoDB services
├── .env.example                # Documents required env vars
└── README.md
```

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed (Docker Desktop includes both).
- No local Node.js or MongoDB installation required — everything runs in containers.

## Environment Variables

Copy the example file and adjust if needed:

```bash
cp .env.example .env
```

| Variable        | Description                                                        | Default                              |
|-----------------|----------------------------------------------------------------------|---------------------------------------|
| `PORT`          | Port the app listens on / is exposed on                             | `5000`                                |
| `NODE_ENV`      | Node environment                                                     | `production`                          |
| `MONGO_DB_NAME` | Name of the MongoDB database used inside `docker-compose`           | `tododb`                              |
| `MONGO_URI`     | Full Mongo connection string (only used if running **without** Compose) | `mongodb://localhost:27017/tododb` |

> `docker-compose.yml` automatically builds `MONGO_URI` from `MONGO_DB_NAME` and points it at the `mongo` service, so you generally don't need to set `MONGO_URI` yourself when using Compose.

## Build & Run (recommended: Docker Compose)

This spins up both the app and a MongoDB instance with one command:

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/fullstack-dockerize.git
cd fullstack-dockerize

# 2. Set up environment variables
cp .env.example .env

# 3. Build and start the containers
docker compose up --build
```

The app will be available at **http://localhost:5000** (or whatever `PORT` you set).

Stop the app:

```bash
docker compose down
```

Stop and also wipe the database volume:

```bash
docker compose down -v
```

## Build & Run (Docker only, without Compose)

If you want to run just the app image against your own MongoDB instance:

```bash
# Build the image
docker build -t dockerized-todo-app .

# Run it, pointing at an external MongoDB instance
docker run -p 5000:5000 \
  -e PORT=5000 \
  -e MONGO_URI="mongodb://<your-mongo-host>:27017/tododb" \
  dockerized-todo-app
```

## API Endpoints

| Method | Endpoint            | Description          |
|--------|----------------------|-----------------------|
| GET    | `/api/todos`         | List all todos        |
| POST   | `/api/todos`         | Create a todo (`{ "title": "..." }`) |
| PATCH  | `/api/todos/:id`     | Update a todo (e.g. `{ "completed": true }`) |
| DELETE | `/api/todos/:id`     | Delete a todo         |
| GET    | `/api/health`        | Health check (app + DB connection status) |

## Docker Design Notes

- **Lightweight base image:** `node:20-alpine` keeps the final image small.
- **Multi-stage build:** dependencies are installed in a separate stage from the runtime image, so build tools and caches don't bloat the final image.
- **Non-root user:** the container runs as an unprivileged `appuser`, not root.
- **`.dockerignore`:** excludes `node_modules`, `.env`, `.git`, logs, and docs from the build context to keep builds fast and images lean.
- **Environment variables:** the app reads configuration (`PORT`, `MONGO_URI`, `NODE_ENV`) from environment variables / a `.env` file rather than hardcoding values, so the same image works across machines and environments.
- **Healthcheck:** the image defines a `HEALTHCHECK` hitting `/api/health` so orchestrators (Docker, Compose, Kubernetes, etc.) can detect an unhealthy container.

## Troubleshooting

- **Port already in use:** change `PORT` in `.env` and re-run `docker compose up --build`.
- **App can't connect to MongoDB:** make sure the `mongo` service is healthy (`docker compose logs mongo`) and that you didn't override `MONGO_URI` to point somewhere unreachable.
- **Stale image after code changes:** run `docker compose up --build` to force a rebuild.
