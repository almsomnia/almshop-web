# Project Context: Almshop Frontend

## Overview

This is the frontend repository for the **Almshop** project. It is built using **Nuxt 4** and **Vue 3**, leveraging a **pnpm workspace** structure to organize the codebase into a modular "Layers" architecture.

## Architecture

The project is structured as a monorepo using pnpm workspaces:

- **`app/`**: The main Nuxt application entry point. This package consumes the functionality provided by the layers.
- **`layers/`**: Modular layers that isolate features and shared logic.
   - **`core/ui`**: Contains shared UI components, styles, and configuration (likely Tailwind CSS).
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
- `utils/`: Development utility packages.

## General Instruction

- Before you trying to update or modify a task, always make sure to read it first and understand any logic and/or patterns used in the code.
- When you generate new code, always follow the existing code style and patterns used in the project.
- When you generate new code, always make a proper documentation for the code.
- When you generate new code, always make a proper error handling.
- **Confirm Dangerous Commands**: If the intended command is potentially destructive (e.g., rm, mv, sudo, systemctl), you **must** explicitly preface the command proposal with a warning: 'WARNING: POTENTIALLY DESTRUCTIVE ACTION REQUIRED'.
- **Do not** create a git commit and/or push to remote repository unless explicitly asked to do so.
- **Do not** build the application unless explicitly asked to do so.

## Code Conventions

- Use Nuxt UI as primary UI component library.
- Always use TypeScript unless explicitly to use another language.
- Always use PascalCase for component names.
- Always use kebab-case for component's prop and emit names.
- Always use camelCase for variables, methods, utils and composables names.
- Always use kebab-case for file names and directories.
- Prefer nullish coalescing operator (`??`) over logical OR (`||`) for default values.
- **Utils naming**: Utility functions are prefixed with `$` (e.g., `$formatCurrency`) and are auto-imported.
- **Composables naming**: Composables are prefixed with `use` (e.g., `useAuth`) and are auto-imported.
- **Layer Extension Rules**:
    - `./app` is only allowed to extend Nuxt apps located in `./layers/domains`.
    - `./layers/core`apps are only allowed to be extended by `./layers/domains` apps.
- **Formatting**: Always format code using Prettier (`pnpm format`) after completing changes.

## llms.txt

Use these LLMs for different tasks:

- **Nuxt**: https://nuxt.com/llms.txt
- **Vue**: https://vuejs.org/llms.txt
- **Nuxt UI**: https://ui.nuxt.com/llms.txt
- **Tailwind CSS**: https://raw.githubusercontent.com/rgfx/tailwind-llms/refs/heads/main/tailwind-llms.txt
