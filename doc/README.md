# Frontend Documentation

Documentation for the **OpenHands** frontend (React + Vite + TypeScript). Documents are numbered for **reading in sequence** (01 → 08). Many sections include **Mermaid diagrams** (flowcharts, sequence diagrams, state diagrams)—render them in GitHub, VS Code, or any Mermaid-compatible viewer for a clearer picture.

## Contents (read in order)

| # | Document | Description |
|---|----------|-------------|
| 01 | [System Design](01-system-design.md) | Architecture, folder structure, routing, roles, and state. |
| 02 | [API Calls](02-api-calls.md) | Backend API usage: client, auth, pickups, NGOs, admin, payments. |
| 03 | [Integration](03-integration.md) | Backend, Nominatim, Leaflet, Razorpay, Sonner, build. |
| 04 | [UI Library](04-ui-library.md) | Tailwind, Radix, CVA, custom components, theming. |
| 05 | [Icons](05-icons.md) | Lucide React usage and icon list by area. |
| 06 | [Environment](06-environment.md) | Env vars, Vite build, and deployment. |
| 07 | [Authentication](07-authentication.md) | Login, roles, protected routes, and auth helpers. |
| 08 | [Presentation Points](08-presentation-points.md) | Bullet-point cheat sheet for PPT/talks — explain without opening code. |

## Where to find diagrams

| Doc | Diagrams |
|-----|----------|
| 01-system-design | Architecture, data flow sequence, routing, role model |
| 02-api-calls | **Page → API module map** (who calls auth, pickups, ngos, admin, payments) |
| 03-integration | Integration overview (Backend, Nominatim, Razorpay, Leaflet) |
| 04-ui-library | **UI stack:** index.css → primitives → forms/layout/pages |
| 06-environment | **Build pipeline:** source → tsc → vite build → dist |
| 07-authentication | Auth overview, protected route flow, login/logout sequence |
| 08-presentation-points | Bullet points (no diagrams) |

## Quick Links

- **New to the project?** Start with [01-system-design](01-system-design.md) and [07-authentication](07-authentication.md).
- **Adding or changing API usage?** See [02-api-calls](02-api-calls.md) and [03-integration](03-integration.md).
- **UI or styling changes?** See [04-ui-library](04-ui-library.md) and [05-icons](05-icons.md).
- **Deploying or configuring env?** See [06-environment](06-environment.md).
