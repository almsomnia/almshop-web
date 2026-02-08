# Project Context: Almshop Frontend

## Overview

This is the frontend repository for the **Almshop** project. It is built using **Nuxt 4** and **Vue 3**, leveraging a **pnpm workspace** structure to organize the codebase into a modular "Layers" architecture.

## Architecture

The project is structured as a monorepo using pnpm workspaces:

- **`app/`**: The main Nuxt application entry point. This package consumes the functionality provided by the layers.
- **`layers/`**: Modular layers that isolate features and shared logic.
   - **`core/ui`**: Contains shared UI components, styles, and configuration (likely Tailwind CSS).
   - **`domains/auth`**: Encapsulates authentication-related logic, pages, and components.

## Key Technologies

- **Framework:** Nuxt 4, Vue 3
- **Package Manager:** pnpm (with workspaces and catalogs)
- **Styling:** Tailwind CSS (via `@nuxt/ui` in `core/ui`)
- **Language:** TypeScript

## Development Workflow

### Prerequisites

- Node.js (Ensure a compatible version for Nuxt 4)
- pnpm

### Setup

Install project dependencies from the root directory:

```bash
pnpm install
```

### Running the Application

To start the development server (runs the `app` package):

```bash
pnpm dev
```

Access the application at `http://localhost:3000`.

### Building for Production

To build the application:

```bash
pnpm build
```

### Code Quality

Format code using Prettier:

```bash
pnpm format
```

### Maintenance

To clean all `node_modules` and `.nuxt` directories across workspaces:

```bash
pnpm clean:all
```

## Directory Structure

- `package.json`: Root configuration defining workspaces and global scripts.
- `pnpm-workspace.yaml`: Defines workspace packages and catalogs.
- `app/`: Main application source.
- `layers/`: Shared feature and UI layers.
