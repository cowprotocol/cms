# CoW CMS - Content Management System

This project is a Content Management System for the [cow.fi](https://cow.fi).

> It is an instance of Strapi, a headless CMS.

# API

Swagger Docs: <https://cms.cow.fi/swagger.html>

# 👨‍💻 Develop

Some requirements are:

- Node v18 or v20 (use an LTS version)
- Yarn
- PostgreSQL (optional), for local dev is easier to use sqlite3 (the default). Alternatively you can use PostgreSQL

## Run locally using sqlite3

The CMS relies on a database. The simplest is to use **Sqlite** for development (it will be created automatically at `data/sqlite.db` when you start the app).

**Steps:**

1. **Build the project** (required before running):

   ```bash
   yarn build
   ```

2. **Create a `.env` file** and set at least `APP_KEYS` (required for the app to start):

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set `APP_KEYS` to a comma-separated list of secret keys, for example:

   ```
   APP_KEYS="mySecretKey1,mySecretKey2"
   ```

   You can leave other values as in the example for local dev, or adjust them as needed (see [Strapi environment config](https://docs.strapi.io/dev-docs/configurations/environment)).

3. **Start the dev server:**

   ```bash
   yarn dev
   ```

4.  **Visit** <http://localhost:1337/admin> and create your local admin user.

## Dev locally using PostreSQL

If you want to use `PostgreSQL` (instead of `sqlite3`), you need to install it first:

- **Mac**: [Postgres.app](https://postgresapp.com/).
- **Linux**: [PostgreSQL for Linux](https://www.postgresql.org/download/linux/)
- **Windows**: [PostgreSQL for Windows](https://www.postgresql.org/download/windows/)

Once you know the running port, you can setup the .env file:

```bash
# Create an ENV file from the example
cp .env.example .env
```

Edit the .env file and set the database connection

- See <https://docs.strapi.io/dev-docs/configurations/environment>

To start with the new database, you simply start the dev server:

```bash
yarn dev
```

# 👷‍♀️ Build

Before running the server for the first time, you need to build it (see [Run locally using sqlite3](#run-locally-using-sqlite3) for the full setup). To build:

```bash
yarn build
```

## Run project (from a previous build)

🚨 For this command to work you must first have a build in place. You can do this via the previous command, `yarn build`.

```bash
yarn start
```

## 🐳 Run with Docker

```bash
# Create an ENV file from the example
cp .env.example .env

# Start the project
docker compose up
```

Then visit:

- [http://localhost:1337/admin](http://localhost:1337/admin)

Also, a Postgres database will be exposed on port `5432`.

## ⌨️ Strapi CLI

Strapi comes with a powerful CLI tooling
[Strapi documentation](https://docs.strapi.io/dev-docs/cli)

```bash
# Check version of the Strapi CLI
yarn strapi version

# Help command
yarn strapi help
```

# Library

This project also exposes a library that can be used to interact with the CMS API.

To build the library, run:

```bash
# Create a new version (patch, minor or major)
npm version minor

# Build and Publish to NPM
./scripts/publish-lib.sh
```
