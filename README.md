# Front Lab NX

A modern frontend development workspace built with Nx, featuring Angular, React, and Next.js applications with shared libraries. This monorepo serves as an experimental laboratory for frontend technologies, allowing developers to explore different frameworks and approaches while sharing common UI components, repository services, and API interfaces. The project demonstrates how to effectively structure a multi-framework application ecosystem with code reuse and consistent development patterns.

## What's Inside

- **Angular App**: Angular application with shared UI components
- **React App**: React application with custom components
- **Next.js App**: Next.js application for server-side rendering
- **Shared Libraries**:
  - UI components (Angular, React)
  - Repository services
  - API interfaces

## Quick Start

```bash
# Install dependencies
pnpm install

# Start Angular app
pnpm start:angular-app

# Start React app
pnpm start:react-app

# Start Next.js app
pnpm start:next-app

# Run tests
pnpm test
```

## Development

Run tasks with Nx:

```bash
pnpm nx <target> <project-name>

# Examples
pnpm nx serve angular-app
pnpm nx build react-app
pnpm nx test next-app
```

## Need Help?

For more information about Nx and this workspace, check out:

- [Nx Documentation](https://nx.dev)
- Install [Nx Console](https://nx.dev/getting-started/editor-setup) for your IDE
