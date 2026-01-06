# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Run Commands

```bash
npm run build      # Compile TypeScript to dist/
npm run start      # Run compiled server (dist/index.js)
npm run dev        # Build and run in one command
```

The server runs on port 8080.

## Architecture

This is a TypeScript Express 5 HTTP server ("Chirpy") with the following structure:

- **src/index.ts** - Express app entry point, route definitions
- **src/config.ts** - Global mutable config (fileserverHits counter)
- **src/api/** - Route handlers and middleware:
  - `middleware.ts` - Request logging, metrics increment, centralized error handling
  - `json.ts` - Response helpers (`respondWithJSON`, `respondWithError`)
  - `errors.ts` - Custom error classes (BadRequestError, NotFoundError, etc.)
  - `chirps.ts` - Chirp validation endpoint (POST /api/validate_chirp)
  - `rediness.ts` - Health check (GET /api/healthz)
  - `metrics.ts` - Admin metrics page (GET /admin/metrics)
  - `reset.ts` - Reset metrics (POST /admin/reset)
- **src/app/** - Static files served at /app

## Error Handling Pattern

Throw custom errors from `src/api/errors.ts` in handlers. The `errorMiddleWare` in `middleware.ts` catches them and maps to appropriate HTTP status codes:
- `BadRequestError` -> 400
- `UserNotAuthenticatedError` -> 401
- `UserForbiddenError` -> 403
- `NotFoundError` -> 404

Handlers are wrapped with `Promise.resolve(...).catch(next)` to propagate async errors to the middleware.

## Notes

- Uses ES modules (`"type": "module"` in package.json)
- Import paths in TypeScript must use `.js` extension (e.g., `import { config } from "../config.js"`)
- Static files in src/app are served directly (not from dist)