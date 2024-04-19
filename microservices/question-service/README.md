# Question Service

![PeerPrep Logo](../../GuideAssets/Logo.png)

## Description

PeerPrep is a technical interview preparation platform designed to offer a
collaborative environment for students to practice and prepare for technical
interviews. Utilizing a microservices architecture, this platform focuses on
providing access to a vast repository of technical questions. The Question
Service, built on the [Nest](https://github.com/nestjs/nest) framework, is
designed to manage and serve these technical questions efficiently. This
service uses MongoDB for storing and retrieving question data, ensuring quick
data access and reliable performance.

## Installation

Before you can run the service, install the necessary dependencies:

```bash

npm install

```

## Environment Setup

Configure the environment variables necessary for connecting to MongoDB and the
authentication service by creating a `.env` file in your project root with the
following contents:

```bash

DB_CLOUD_URI=<MONGODB_CONNECTION_STRING>
API_AUTH_VERIFY_TOKEN_ENDPOINT=http://localhost:3001/auth/verify-token

```

## Running the App

### Development

Start the service in development mode:

```bash

npm run start

```

### Watch Mode

Run the service in watch mode to automatically reload on file changes:

```bash

npm run start:dev

```

### Production Mode

Deploy the service in production mode:

```bash

npm run start:prod

```

## Testing

Ensure your application is running smoothly by executing the following test commands:

### Unit Tests

```bash

npm run test

```

### End-to-End Tests

```bash

npm run test:e2e

```

### Test Coverage

Generate and view test coverage reports:

```bash

npm run test:cov

```
