<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://github.com/Excali-Studio/excali-api/assets/8248700/e4b10290-3d53-4a14-995c-8f196e1643fc" width="200" alt="Nest Logo" /></a>
</p>

## Description

ExcaliStudio Back-End repository

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Auth flow

1. http://localhost:3000/api/auth/google/login
2. http://localhost:3000/api/auth/status
3. http://localhost:3000/api/user/me


![Entities](docs_static/db_entities.png)


### Default DB config
* DB type: `postgres`
* host: `localhost`
* name: `excali_studio`
* username: `excali_studio`
* password: `excali_studio`

