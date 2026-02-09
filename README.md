# Almshop Frontend

## Overview

This is the frontend repository for the **Almshop** project. It is built using **Nuxt 4** and **Vue 3**, leveraging a **pnpm workspace** structure to organize the codebase into a modular "Layers" architecture.

## Architecture

The project is structured as a monorepo using pnpm workspaces:

- **`app/`**: The main Nuxt application entry point. This package consumes the functionality provided by the layers.
- **`layers/`**: Modular layers that isolate features and shared logic.
   - **`core/ui`**: Contains shared UI components, styles, and configuration.
   - **`domains/auth`**: Encapsulates authentication-related logic, pages, and components.
- **`utils/`**: Internal utilities for development.
   - **`layer-generator`**: A CLI tool to scaffold new core or domain layers.

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

### Layer Generation

To scaffold a new layer (core or domain):

```bash
pnpm gen:layer
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
- `types/`: Centralized global TypeScript type definitions.
- `utils/`: Development utility packages.

## Code Conventions

- **Utils naming**: Utility functions are prefixed with `$` (e.g., `$formatCurrency`) and are auto-imported.
- **Composables naming**: Composables are prefixed with `use` (e.g., `useAuth`) and are auto-imported.
- **Layer Extension Rules**:
   - `./app` is only allowed to extend Nuxt apps located in `./layers/domains`.
   - `./layers/domains` are allowed to extend Nuxt apps located in `./layers/core`.
   - `./layers/core` are allowed to extend Nuxt apps located in `./layers/base`.
   - `./layers/base` is not allowed to extend any layers.
- **Formatting**: Always format code using Prettier (`pnpm format`) after completing changes.
- **Centralized Types**:
   - Global types are defined in `types/` directory (e.g., `API`, `DTO` namespaces).
   - These types are integrated into each Nuxt application via `nuxt.config.ts` by adding the appropriate relative path to the `include` array of the TypeScript configuration.
   - They are globally available and do not require explicit imports.

## llms.txt

Use these LLMs for different tasks:

- **Nuxt**: https://nuxt.com/llms.txt
- **Vue**: https://vuejs.org/llms.txt
- **Nuxt UI**: https://ui.nuxt.com/llms.txt
- **Tailwind CSS**: https://raw.githubusercontent.com/rgfx/tailwind-llms/refs/heads/main/tailwind-llms.txt
