# Chirpy

A Twitter-like HTTP API server built with TypeScript, Express 5, and PostgreSQL.

**Features:**
- User authentication with JWT access tokens and refresh tokens
- Password hashing with Argon2
- CRUD operations for chirps (posts)
- Chirpy Red premium membership via webhook integration
- Content moderation with banned words filtering

## Motivation

I built Chirpy to learn backend development patterns the hard way - by implementing them from scratch. Instead of reaching for Firebase Auth or Auth0, I rolled my own JWT-based authentication with refresh token rotation. Instead of using a managed database, I set up PostgreSQL with Drizzle ORM and wrote my own migrations.

The goal was to understand what happens under the hood of production APIs: token expiration, password hashing, webhook verification, and content moderation. Chirpy is the result of that exploration.

## Quick Start

**Prerequisites:** Node.js 20+ and Docker

```bash
# Clone and install
git clone https://github.com/yourusername/chirpy.git
cd chirpy
npm install

# Start PostgreSQL and run migrations
docker compose up -d
cp .env.example .env
npm run migrate

# Start the server
npm run dev
```

The server runs on `http://localhost:8080`. Hit the health check to verify:

```bash
curl http://localhost:8080/api/healthz
```

## Usage

### Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Run compiled server |
| `npm run dev` | Build and run |
| `npm run test` | Run tests |
| `npm run generate` | Generate Drizzle migrations |
| `npm run migrate` | Apply database migrations |

### API Endpoints

#### Health
- `GET /api/healthz` - Health check

#### Authentication
- `POST /api/users` - Create user
- `PUT /api/users` - Update user (authenticated)
- `POST /api/login` - Login
- `POST /api/refresh` - Refresh access token
- `POST /api/revoke` - Revoke refresh token

#### Chirps
- `POST /api/chirps` - Create chirp (authenticated)
- `GET /api/chirps` - List chirps (`?authorId=`, `?sort=asc|desc`)
- `GET /api/chirps/:chirpId` - Get chirp
- `DELETE /api/chirps/:chirpId` - Delete chirp (authenticated, owner only)

#### Webhooks
- `POST /api/polka/webhooks` - Polka payment webhook

#### Admin
- `GET /admin/metrics` - View metrics
- `POST /admin/reset` - Reset data

## Contributing

### Clone the repo

```bash
git clone https://github.com/yourusername/chirpy.git
cd chirpy
```

### Set up the development environment

```bash
npm install
docker compose up -d
cp .env.example .env
npm run migrate
```

### Run the test suite

```bash
npm run test
```

### Build and run

```bash
npm run dev
```

### Submit a pull request

If you'd like to contribute, please fork the repository and open a pull request to the `main` branch.

## Tech Stack

- **Runtime**: Node.js with ES modules
- **Framework**: Express 5
- **Language**: TypeScript
- **Database**: PostgreSQL 16
- **ORM**: Drizzle ORM
- **Auth**: JWT + Argon2
- **Testing**: Vitest