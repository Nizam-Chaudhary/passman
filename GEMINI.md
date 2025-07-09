# Passman Monorepo

This is a monorepo for Passman, a password manager application.

## Workspaces

The monorepo is managed using pnpm and Turborepo and contains the following workspaces:

- `apps/api`: The backend server built with Hono.
- `apps/web`: The frontend application built with Vite and React.
- `packages/schema`: Shared Zod schemas for validation.

## Tech Stack

### Backend (`apps/api`)

- **Framework**: Hono
- **Database ORM**: Drizzle
- **Database**: MySQL
- **API Client**: Hono client

### Frontend (`apps/web`)

- **Framework**: React (with Vite)
- **Routing**: TanStack Router
- **Async State Management**: TanStack Query
- **State Management**: Zustand (with persist middleware for auth)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS

## Building and Deployment

Refer to the `Dockerfile`, `docker-compose.yaml`, `docker-stack.yml`, and GitHub Actions workflow files for details on building and deploying the applications.

## Development Guidelines

### Running the Development Server

To start the development servers for all workspaces, run:

```bash
pnpm turbo dev
```

### Linting

Before committing any changes, please run the following commands to ensure code quality and prevent errors.

To check for linting errors, run:

```bash
pnpm turbo lint
```

### Type Checking

To check for TypeScript errors, run:

```bash
pnpm turbo typecheck
```

This will ensure that your contributions are consistent with the project's standards.
