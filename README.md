# URL Shortener

## Short Comings and Considerations

Some URL formats fail at the moment

- https://cdn.example.com/images/thumbnail(200x200).jpg

### Considerations

- Currently we make 2 DB calls to insert a URL so we can retrieve the ID to encode it. We could
  have a counter elsewhere (Redis Cache or something a little more persistent) that we can just read
  to encode instead of 2 write commands

- There's no caching in this implementation but we should use a Redis Cache to stored the most used URLs
  or we could even store all urls created for 1 week because it may be likely that most urls are "short" lived

- I'm using the url for the api as my short URL. I'm running up on 5 hours on the project and when I fetch
  the backend from the frontend and the backend redirects I get CORS errors because my front end is the ORIGIN
  - This could be remedied by my backend serving static react files.

# Dev

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines React, TanStack Router, Hono, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **TanStack Router** - File-based routing with full type safety
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Hono** - Lightweight, performant server framework
- **Bun** - Runtime environment
- **Drizzle** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
bun install
```

## Database Setup

This project uses PostgreSQL with Drizzle ORM.

1. Make sure you have a PostgreSQL database set up.
2. Update your `apps/server/.env` file with your PostgreSQL connection details.

3. Apply the schema to your database:

```bash
bun db:push
```

Then, run the development server:

```bash
bun dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.
The API is running at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
zaymo-url-shortener/
├── apps/
│   ├── web/         # Frontend application (React + TanStack Router)
│   └── server/      # Backend API (Hono)
```

## Available Scripts

- `bun dev`: Start all applications in development mode
- `bun build`: Build all applications
- `bun dev:web`: Start only the web application
- `bun dev:server`: Start only the server
- `bun check-types`: Check TypeScript types across all apps
- `bun db:push`: Push schema changes to database
- `bun db:studio`: Open database studio UI
