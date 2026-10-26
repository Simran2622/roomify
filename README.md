# Roomify

Roomify is an interactive 2D room interior-design application built with React and TypeScript, with a small Express API and SQLite database. It lets users create room concepts, place furniture, customize layouts, save designs locally, and export the finished canvas as PNG.

## Features

- Landing page with product-style presentation
- Create a room design
- Room type selection
- Interior style selection
- Built-in room backgrounds
- Upload a local room image
- Interactive Konva 2D canvas
- Add furniture and decor
- Drag, resize and rotate elements
- Select and delete elements
- Change furniture colors
- Duplicate elements
- Save and edit designs
- Delete saved designs
- localStorage persistence
- PNG export
- Responsive desktop, tablet and mobile editor
- Accessible labels, focus states and friendly empty/error states
- Netlify SPA redirect configuration

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- react-konva / Konva
- lucide-react
- Node.js + Express
- SQLite (better-sqlite3)

The backend supports basic design CRUD operations. There is no login/authentication system, keeping the project intentionally small.

## Project Structure

```text
src/
├── components/
│   ├── Navbar.tsx
│   ├── Button.tsx
│   ├── DesignCard.tsx
│   ├── FurniturePanel.tsx
│   ├── RoomCanvas.tsx
│   ├── PropertiesPanel.tsx
│   ├── ColorPicker.tsx
│   └── EmptyState.tsx
├── pages/
│   ├── Home.tsx
│   ├── Dashboard.tsx
│   ├── NewDesign.tsx
│   └── DesignEditor.tsx
├── data/
│   ├── furniture.ts
│   └── roomStyles.ts
├── hooks/
│   └── useDesign.ts
├── services/
│   └── localStorage.ts  # API client (legacy filename)
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Installation

Use Node.js 18 or newer. From the project root, install dependencies:

```bash
npm install
```

## Run locally

Open **two terminals** in the project folder.

Terminal 1 — start the backend:

```bash
npm run server
```

The API runs at `http://localhost:4000`. You can check it at `http://localhost:4000/api/health`.

Terminal 2 — start the React frontend:

```bash
npm run dev
```

Open the Vite URL shown in the terminal (usually `http://localhost:5173`).

You can also run both at once with `npm run dev:all`.

## Backend API

- `GET /api/designs` — list saved designs
- `GET /api/designs/:id` — fetch one design
- `POST /api/designs` — create a design
- `PUT /api/designs/:id` — update a design
- `DELETE /api/designs/:id` — delete a design

Designs are stored in `server/roomify.db`, created automatically when the backend starts. The uploaded room image and canvas preview are stored as data URLs inside the design record, so use reasonable image sizes.

## Build

```bash
npm run build
```

The production output is generated in `dist/`.

## Netlify deployment

This project includes:

```text
public/_redirects
```

with:

```text
/* /index.html 200
```

This allows React Router routes such as `/dashboard` and `/design/:id` to work after a browser refresh.

For Netlify, use:

- Build command: `npm run build`
- Publish directory: `dist`

## How persistence works

Roomify now sends the complete design object to the Express API, which stores it as JSON in a SQLite table. The database file is `server/roomify.db`.

Each design contains:

- `id`
- `name`
- `roomType`
- `style`
- `roomImage`
- `elements`
- `createdAt`
- `updatedAt`
- optional `preview`

The backend must be running to create, view, edit, or delete saved designs. Removing `server/roomify.db` removes the saved designs.

## PNG export

The editor uses Konva's client-side canvas export (`Stage.toDataURL`) to generate a PNG. Nothing is uploaded to a server.

## Future improvements

- Undo/redo history
- More furniture shapes and room templates
- Snapping and alignment guides
- Layer ordering
- Multi-select
- Better keyboard shortcuts
- Optional backend synchronization
- More advanced realistic furniture assets

## Figma Design

Roomify now includes a Figma-ready design handoff in the `figma/` directory. The boards cover the existing Landing, Dashboard, New Design, and Editor screens and use the same visual structure as the React application.

Import the SVG boards into a Figma Design file and refine/annotate them as the UI source of truth. See `figma/README.md` and `figma/DESIGN-TOKENS.md` for the import workflow and design system.
