## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Seed Data

The repository includes a deterministic seed runner for the SQLite database.

```bash
$ npm run seed
```

By default, the seed script writes to `db/app.sqlite`. If `DATABASE_URL` is set, that path is used instead. The seeded data includes four users, four posts, five tags, sample comments, one subscription, and sample notifications.

The application stores roles and post statuses using the values expected by the codebase (`user`, `writer`, `moderator`, `admin` and `draft`, `waiting`, `accepted`, `rejected`), even when the assignment describes them in uppercase.
