# Software Architecture Lab API

## Project Description

NestJS REST API for managing posts, users, tags, comments, notifications, and subscriptions with role-based access control and JWT authentication.

## Prerequisites

- Node.js v22.11.0+
- npm v10.9.0+

## Installation

```bash
npm install
npm run seed
npm run start:dev
```

API available at `http://localhost:3000`

## Environment Variables

```env
PORT=3000
DATABASE_URL=db/app.sqlite
JWT_SECRET=your-secret-key
JWT_EXPIRATION=3600
NODE_ENV=development
```

## API Documentation

Swagger UI: `http://localhost:3000/api`

## Testing

```bash
npm run test        # Unit tests
npm run test:e2e    # E2E tests
npm run test:cov    # Coverage
```

## Seed Data

```bash
npm run seed
```

### Default Users

| Username | Password | Role |
|----------|----------|------|
| `reader_user` | `password123` | user |
| `writer_user` | `password123` | writer |
| `moderator_user` | `password123` | moderator |
| `admin_user` | `password123` | admin |
