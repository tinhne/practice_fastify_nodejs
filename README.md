# practice_fastify_nodejs

A small practice REST API written while learning Fastify. It has two resources, users and products, stored in PostgreSQL through Prisma, with request and response schemas defined in Zod and a JWT-protected route for creating products.

This is a learning exercise, not a finished application. It follows the common Fastify + Prisma + Zod tutorial structure (a users/products example).

## What it practices

- Registering route plugins with prefixes (`/api/users`, `/api/products`)
- Defining Zod schemas once and sharing them as JSON Schemas with `$ref` via `fastify-zod`
- JWT sign/verify with `@fastify/jwt` and an `authenticate` decorator used as a `preHandler`
- Password hashing with Node's `crypto.pbkdf2Sync` and a per-user salt
- Prisma models with a one-to-many relation (a user owns many products) and migrations

## Tech stack

| Layer | Technology |
| --- | --- |
| Runtime | Node.js, TypeScript 5.8 (run with `ts-node-dev`) |
| Framework | Fastify 4.29, `@fastify/jwt` 6 |
| Validation | Zod 3 + `fastify-zod` |
| Database | PostgreSQL, Prisma Client 6.5 |
| Logging | Pino + pino-pretty |

## API

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/healthcheck` | Public | Returns `{ "status": "ok" }` |
| POST | `/api/users/register` | Public | Create a user (`email`, `name`, `password`) |
| POST | `/api/users/login` | Public | Returns `{ accessToken }` on valid credentials |
| GET | `/api/users` | JWT | List users (id, email, name) |
| GET | `/api/products` | Public | List products with owner name |
| POST | `/api/products` | JWT | Create a product (`title`, `price`, optional `content`) owned by the current user |

## Data model

`User (id, email, name, password, salt)` → has many → `Product (id, title, content, price, ownerId, createAt, update)`. See `prisma/schema.prisma`.

## Getting started

Prerequisites: Node.js 18+, pnpm, and a PostgreSQL database.

```bash
pnpm install
cp .env.example .env          # set DATABASE_URL
```

The Prisma CLI is not listed in `package.json`, and `@prisma/client` is in `pnpm.ignoredBuiltDependencies`, so run the CLI through `pnpm dlx` to apply migrations and generate the client:

```bash
pnpm dlx prisma@6.5.0 migrate deploy
pnpm dlx prisma@6.5.0 generate
```

Start the server (port 3000):

```bash
pnpm dev
```

## Environment variables

| Name | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma |

## Known limitations

- The JWT secret is hard-coded in `src/app.ts`.
- A wrong password on login returns HTTP 200 with a message instead of 401.
- The product response schema uses `createdAt`/`updatedAt`, while the Prisma model fields are `createAt`/`update`.
- `src/server.ts`, `src/modules/utils/errorHandler.ts` and `src/modules/utils/logger.ts` are empty placeholders.
- No tests.

## Author

**Lê Văn Trung Tính** — Software Engineer | AI Product Builder

- Website: [trungtinh.site](https://trungtinh.site)
- GitHub: [@tinhne](https://github.com/tinhne)
