# Front Lab NX

A modern frontend development workspace built with Nx, featuring Angular, React, and Next.js applications with shared libraries. This monorepo serves as an experimental laboratory for frontend technologies, allowing developers to explore different frameworks and approaches while sharing common UI components, repository services, and API interfaces. The project demonstrates how to effectively structure a multi-framework application ecosystem with code reuse and consistent development patterns.

It includes:

- Angular, React, and Next.js applications
- Shared libraries providing UI components, repository services, and API interfaces

## Applications

- Angular App: A standalone Angular application showcasing Angular components and services
  - **Live Demo**: [https://angular-front-lab.web.app](https://angular-front-lab.web.app)
- React App: A React application with modern React patterns.
  Currently testing out some custom lion component integration
- Next.js App: Server-side rendered application using Next.js. Empty for now

## Libraries

- UI Components: Reusable UI components for Angular, React, and Web Components
- Repository Services: Data access layer for backend communication
- API Interfaces: Shared API models and services

## Getting Started

```bash
# Install dependencies
pnpm install

# Start Angular app
pnpm start:angular-app

# Start React app
pnpm start:react-app

# Run tests
pnpm test
```

## Development

Run tasks with Nx:

```bash
pnpm nx <target> <project-name>
pnpm <script-name>
# Examples
pnpm nx serve angular-app
pnpm lint:angular-libs
pnpm test:angular-libs
pnpm build:angular-app
```

## Deployment

The Angular application is automatically deployed to Firebase hosting when changes are pushed to the main branch:

- **Live Demo**: [https://angular-front-lab.web.app](https://angular-front-lab.web.app)

## Future

- add more components
- add e2e tests
- add more unit tests
