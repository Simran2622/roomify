# Roomify — Interactive 2D Room Design Platform

Roomify is a responsive room-design application that lets users create and customize 2D room layouts, arrange furniture, edit designs, and export room canvases as PNG images.

## Features

- Create room designs with room types and interior styles
- Interactive 2D editor built with React Konva
- Add, move, resize, rotate, duplicate, recolor, and delete furniture
- Upload room backgrounds and customize layouts
- Save, retrieve, update, and delete designs through a REST API
- PostgreSQL persistence using JSONB
- PNG export
- Responsive interface and accessible UI controls

## Tech Stack

**Frontend**
- React, TypeScript, Vite
- Tailwind CSS
- React Router
- Konva and react-konva

**Backend**
- Node.js and Express
- PostgreSQL
- `pg` connection pool
- JSON REST API

**Testing**
- Vitest
- Supertest
- In-memory database mock for isolated API tests

**Deployment**
- Netlify frontend
- Render backend and PostgreSQL database

## Architecture

The frontend sends HTTP requests to the Express API. The backend validates design data and stores each complete design as JSONB in PostgreSQL.

```text
React + TypeScript frontend
          |
          | HTTP / JSON
          v
     Express REST API
          |
          | pg connection pool
          v
      PostgreSQL
```

## Project Structure

```text
src/
  components/
  pages/
  data/
  hooks/
  services/
  types/
server/
  app.js
  index.js
tests/
  api.test.js
public/
netlify.toml
```

## Requirements

- Node.js 18 or newer
- npm
- A PostgreSQL database

## Local Setup

Install dependencies:

```bash
npm install
```

Configure the `DATABASE_URL` environment variable with your PostgreSQL connection string. Do not commit credentials to Git.

PowerShell example for the current terminal session:

```powershell
$env:DATABASE_URL = "postgresql://USER:PASSWORD@HOST:5432/DATABASE"
```

Replace the example with your actual connection string. For local development, use a database you control and have permission to access.

Start the backend:

```bash
npm run server
```

The backend creates the `designs` table on startup if it does not exist.

In another terminal, start the frontend:

```bash
npm run dev
```

Open the local Vite URL printed in the terminal, usually `http://localhost:5173`.

The frontend uses `VITE_API_URL` when configured; otherwise, its API client defaults to `http://localhost:4000/api`.

## Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string; required by the backend |
| `CLIENT_ORIGIN` | Optional additional allowed frontend origin |
| `PORT` | Backend port; defaults to `4000` |
| `NODE_ENV` | Enables production PostgreSQL SSL configuration when set to `production` |
| `VITE_API_URL` | Frontend API base URL, such as `https://your-api.example.com/api` |

Never expose database credentials in frontend variables or commit secrets to the repository.

## REST API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Checks API and database connectivity |
| GET | `/api/designs` | Lists saved designs |
| GET | `/api/designs/:id` | Retrieves a design by ID |
| POST | `/api/designs` | Creates a design |
| PUT | `/api/designs/:id` | Updates a design |
| DELETE | `/api/designs/:id` | Deletes a design |

Design creation requires a non-empty `id`, a non-empty `name`, and an `elements` array. Duplicate IDs return HTTP 409; missing designs return HTTP 404.

## Automated Tests

Run the API test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

The test suite checks health, create/list, retrieve-by-ID, update, delete, invalid design data, duplicate IDs, and missing designs. Tests use an in-memory mock and do not modify the production database.

## Production Build

Build the frontend:

```bash
npm run build
```

The generated static site is written to `dist/`.

Check backend JavaScript syntax:

```bash
node --check server/index.js
```

## Deployment

### Frontend — Netlify

- Build command: `npm run build`
- Publish directory: `dist`
- Configure `VITE_API_URL` to point to the deployed backend API.
- The Netlify configuration includes a single-page application redirect for client-side routes.

### Backend — Render

- Runtime: Node.js
- Build command: `npm install`
- Start command: `npm run server`
- Set `DATABASE_URL` to the PostgreSQL database connection string.
- Set `CLIENT_ORIGIN` to the deployed frontend origin if using a different frontend domain.

The backend creates the database table at startup. A PostgreSQL database must be available for the service to start successfully.

## Data Model

Each design is stored as a JSONB document alongside its database ID and timestamps. Design data may contain fields such as:

- `id`
- `name`
- `roomType`
- `style`
- `roomImage`
- `elements`
- `createdAt`
- `updatedAt`
- `preview`

Room images and previews may be embedded as data URLs. Large images can increase database and API payload sizes; object storage is a possible future improvement.

## Current Scope and Future Improvements

The project currently has no authentication system. Other possible improvements include:

- User accounts and per-user design ownership
- Undo and redo
- Furniture layers and alignment guides
- Image object storage
- Pagination for large design collections
- Additional integration tests against a dedicated test PostgreSQL database
- Frontend code splitting to reduce bundle size
