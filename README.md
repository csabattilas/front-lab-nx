# Front Lab NX

A modern frontend development workspace built with Nx, featuring Angular, React, and Next.js applications with shared libraries. This monorepo serves as an experimental laboratory for frontend technologies, allowing developers to explore different frameworks and approaches while sharing common UI components, repository services, and API interfaces. The project demonstrates how to effectively structure a multi-framework application ecosystem with code reuse and consistent development patterns.

It includes:

- A demo application
- Shared libraries providing UI components (NOT DOWNLOADABLE YET!!), repository services, and API interfaces

## Applications

- Angular App: A standalone Angular application showcasing Angular components and services
  - **Live Demo**: [https://frontlab.io](https://frontlab.io)

## Libraries

- UI Components: Reusable UI components built with Angular and Lion
- Repository Services: Data access layer for backend communication
- API Interfaces: Shared API models and services

More here: [https://github.com/csabattilas/front-lab-nx/blob/main/libs/ui/lion/form/README.md](https://github.com/csabattilas/front-lab-nx/blob/main/libs/ui/lion/form/README.md) and [https://github.com/csabattilas/front-lab-nx/blob/main/libs/ui/angular/form/README.md](https://github.com/csabattilas/front-lab-nx/blob/main/libs/repository/angular/README.md)

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

## Future

- add more components
- add e2e tests
- add more unit tests
