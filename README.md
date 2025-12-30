# Sora UI

A desktop application for generating video scenes using OpenAI's Sora 2 API.

## Tech Stack

- **Electron** - Desktop application framework
- **React** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **OpenAI SDK** - Integration with Sora API

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key with Sora access

## Installation

1. Clone the repository:
```bash
git clone https://github.com/whydna/sora-ui.git
cd sora-ui
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Development

Start the application in development mode:
```bash
npm start
```

### Building

Package the application:
```bash
npm run package
```

Create distributables:
```bash
npm run make
```

### Linting

Run ESLint:
```bash
npm run lint
```

## Project Structure

```
sora-ui/
├── src/
│   ├── main/          # Electron main process
│   ├── renderer/      # Renderer process (React app)
│   └── shared/        # Shared types and utilities
├── resources/         # Application resources
└── forge.config.ts    # Electron Forge configuration
```

## Author

Andy Hin
