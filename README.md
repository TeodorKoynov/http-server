# Chirpy

A Twitter-like HTTP API server built with TypeScript, Express 5, and PostgreSQL.

## Features

- User authentication with JWT access tokens and refresh tokens
- Password hashing with Argon2
- CRUD operations for chirps (posts)
- Chirpy Red premium membership via webhook integration
- Content moderation (banned words filtering)

## Prerequisites

- Node.js 20+
- Docker (for PostgreSQL)

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the database**
   ```bash
   docker compose up -d
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your values.

4. **Run migrations**
   ```bash
   npm run migrate
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Run compiled server |
| `npm run dev` | Build and run |
| `npm run test` | Run tests |
| `npm run generate` | Generate Drizzle migrations |
| `npm run migrate` | Apply database migrations |

## API Endpoints

### Health
- `GET /api/healthz` - Health check

### Authentication
- `POST /api/users` - Create user
- `PUT /api/users` - Update user (authenticated)
- `POST /api/login` - Login
- `POST /api/refresh` - Refresh access token
- `POST /api/revoke` - Revoke refresh token

### Chirps
- `POST /api/chirps` - Create chirp (authenticated)
- `GET /api/chirps` - List chirps (`?authorId=`, `?sort=asc|desc`)
- `GET /api/chirps/:chirpId` - Get chirp
- `DELETE /api/chirps/:chirpId` - Delete chirp (authenticated, owner only)

### Webhooks
- `POST /api/polka/webhooks` - Polka payment webhook

### Admin
- `GET /admin/metrics` - View metrics
- `POST /admin/reset` - Reset data

## Tech Stack

- **Runtime**: Node.js with ES modules
- **Framework**: Express 5
- **Language**: TypeScript
- **Database**: PostgreSQL 16
- **ORM**: Drizzle ORM
- **Auth**: JWT + Argon2
- **Testing**: Vitest
