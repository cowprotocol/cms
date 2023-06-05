# CoW Content Management System

This project is a content management system for the CoW Protocol. It is an instance of Strapi, a headless CMS. It is intended to be used for content for CoW websites.

# 💻 System requirements

It is recommended to have a system that has at least 4+ GB memory and 32+ GB disk space with a dual core or better CPU. However, at a bare minimum having 2 GB memory, 8 GB disk space and a single core CPU should be enough to run this project.

# 🚀 How to run locally?

## Node

This project uses Node. To be able to run this project on your local, you'll need to have `node` installed. You can check this by running `node --version` in your terminal. If you don't have it installed, you can follow the instructions [here](https://nodejs.org/en/download/).

You will need to use at least version 14 of Node. Ideally, you should use LTS versions (i.e. 14, 16, 18, etc.) That is because Strapi does not support officially non-LTS versions, meaning there is a slight chance you might end up seeing some bugs.

## Yarn

To be able to run this project on your local, you'll need to have `yarn` installed. You can check this by running `yarn --version` in your terminal. If you don't have it installed, you can follow the instructions [here](https://classic.yarnpkg.com/en/docs/install/).

## PostreSQL

This project relies on having a PostgreSQL instance up and running. There are many ways of achieving this. You can read more at PostgreSQL's own website [here](https://www.postgresql.org/download/). If you're on a Mac, you can use [Postgres.app](https://postgresapp.com/). If you're on Windows, you can use [PostgreSQL for Windows](https://www.postgresql.org/download/windows/). If you're on Linux, you can use [PostgreSQL for Linux](https://www.postgresql.org/download/linux/). You will need your database information for the next step.

To be able to run this project, you'll need to use at least version 11, but preferably version 14 of PostgreSQL.

## Environment Variables

This project relies on a `.env` file to supply the environment variables. For this, you'll need to create a `.env` file in the root directory of the project. The contents of the file should be as outlined in the `.env.example` file. You can copy the contents of the `.env.example` file into your `.env` file and fill in the values.

Environment variables here are following closely what Strapi makes available, for which docs can be found at [Strapi's documentation](https://docs.strapi.io/dev-docs/configurations/environment).

## Running the project

You are now set! You can run the following commands on your terminal to run the project:

### Run the project in development mode

This will run the project in development mode, with auto reload enabled. This mode is used when you want to update your instance, add new models, plugins etc.

```bash
yarn develop
```

### Build the project

```bash
yarn build
```

### Run the project from a previous build

🚨 For this command to work you must first have a build in place. You can do this via the previous command, `yarn build`.

```bash
yarn start
```

### Use the Strapi CLI

Strapi comes with a powerful CLI tooling. This is made available to you here as well, via the following command:

```bash
yarn strapi
```

Simply, append your desired command to the end of the above command. For more information on the CLI you can visit the [Strapi documentation](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html).

## ⚙️ How to run this project using Docker?

As we deploy this project using Docker, we've included a `Dockerfile` and `docker-compose.yml` file to manage this. You can use the following commands to run this project using Docker:

```bash
docker compose up
```

This would give you a running instance of the project. You can then access the project at `http://localhost:1337`.

If you use Docker, you will also end up with an instance of [adminer](https://www.adminer.org/) running at `http://localhost:9090`. You can use this to access your database.
