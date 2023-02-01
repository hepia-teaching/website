# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install
```

Copy `.env.example` to `.env`

```bash
cp .env.example .env
```

Start the database

```
docker compose up -d
```

Create your database

```
npx prisma db push
```

Run all the migrations

```
npx prisma migrate reset
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

# Testing

Make sure to install the dependencies:

```
npx playwright install
```

Run playwright tests

```
npm run test
```

Or call the playwright cli directly to have more options

```
npx playwright --help
```

# Linting

Fix formatting

```
npm run fix
```
