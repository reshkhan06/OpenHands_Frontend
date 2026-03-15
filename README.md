# OpenHands React Application

Frontend for **OpenHands** — a donation platform connecting donors with NGOs for item pickups. Built with React, Vite, TypeScript, and Tailwind CSS.

## Tech Stack

| Layer | Technology |
|-------|------------|
| UI | React 18 |
| Build | Vite 5 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | Radix UI (Label, Popover), custom UI (Button, Card, Input, Label), CVA |
| Icons | Lucide React |
| Routing | React Router v6 |
| Toasts | Sonner |

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Backend API running (see backend repo); default base URL: `http://localhost:8000`

### Installation

```bash
npm install
```

### Environment

Copy the example env and set the API base URL if needed:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000` |

### Development

```bash
npm run dev
```

App runs at **http://localhost:5173**. Ensure the backend is running and CORS allows this origin.

### Build

```bash
npm run build
```

Output is in `dist/`. TypeScript is type-checked as part of the build.

### Preview production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```
frontend/
├── src/
│   ├── api/           # API client and endpoints (auth, pickups, ngos, admin, payments)
│   ├── components/    # Reusable UI and layout
│   │   ├── ui/        # Base components (Button, Card, Input, Label)
│   │   ├── Navbar.tsx, Footer.tsx, Logo.tsx
│   │   ├── ProtectedRoute.tsx, UserProfileDropdown.tsx
│   │   └── GeoapifyAddressInput.tsx, LocationInput.tsx, ...
│   ├── hooks/         # e.g. useAuth
│   ├── lib/            # utils (cn, etc.)
│   ├── pages/         # Route-level pages
│   ├── App.tsx        # Router, layout, Toaster
│   ├── main.tsx       # Entry point
│   └── index.css      # Tailwind + CSS variables
├── doc/               # Documentation (system design, API, integration, UI, icons, auth, env)
├── public/
├── package.json
├── vite.config.ts     # @ alias → src
└── .env / .env.example
```

## Features

- **Roles**: Donor (donate items), NGO (receive pickups), Admin (manage users, NGOs, config)
- **Auth**: Signup / login (donor & NGO), email verification, protected routes
- **Pickups**: Create pickup, choose NGO, pay deposit (Razorpay), track status; NGO manages pickups
- **Address**: Nominatim-based address autocomplete (registration, pickup address)
- **Maps**: Leaflet on Contact page
- Responsive layout, Tailwind + CSS variables, Sonner toasts

## Documentation

Detailed docs live in **[doc/](doc/)** (numbered 01–08 for reading order). Many include **Mermaid diagrams** (architecture, routing, API map, build pipeline, auth); render in GitHub, VS Code, or any Mermaid viewer.

| Doc | Description |
|-----|-------------|
| [doc/README.md](doc/README.md) | Index of all docs and diagram list |
| [01-system-design](doc/01-system-design.md) | Architecture, routing, roles, state |
| [02-api-calls](doc/02-api-calls.md) | Backend API usage, page→API map |
| [03-integration](doc/03-integration.md) | Backend, Nominatim, Leaflet, Razorpay |
| [04-ui-library](doc/04-ui-library.md) | Tailwind, Radix, components, theming |
| [05-icons](doc/05-icons.md) | Lucide React usage |
| [06-environment](doc/06-environment.md) | Env vars, build pipeline, deployment |
| [07-authentication](doc/07-authentication.md) | Auth flow, protected routes |
| [08-presentation-points](doc/08-presentation-points.md) | PPT cheat sheet and “system at a glance” diagram |

## Notes

- Copy any required assets (e.g. logo images) into `public/` and reference them accordingly.
- For production, set `VITE_API_BASE_URL` to your API URL and ensure the backend allows the frontend origin in CORS.
