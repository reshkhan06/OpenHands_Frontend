# OpenHands React Application

A modern React application built with Vite, Tailwind CSS, and shadcn/ui components.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library
- **React Router** - Client-side routing

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
react-app/
├── src/
│   ├── components/      # Reusable components
│   │   ├── ui/         # shadcn/ui components
│   │   ├── Navbar.tsx  # Navigation component
│   │   └── Footer.tsx  # Footer component
│   ├── pages/          # Page components
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── NGOs.tsx
│   │   └── Contact.tsx
│   ├── lib/            # Utility functions
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── index.html          # HTML template
└── package.json        # Dependencies
```

## Features

- ✅ Responsive design
- ✅ Modern UI with Tailwind CSS
- ✅ Reusable components
- ✅ Client-side routing
- ✅ Type-safe with TypeScript

## Notes

- Make sure to copy the `uploads` folder with logo images to the `public` directory
- Update image paths as needed for your deployment setup
