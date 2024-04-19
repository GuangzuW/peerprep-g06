# Matching Service

![PeerPrep Logo](../../GuideAssets/Logo.png)

## Description

PeerPrep is a technical interview preparation platform designed to offer a
collaborative environment for students to practice and prepare for technical
interviews. Utilizing a microservices architecture, this platform focuses on
enabling real-time collaboration among users who are matched based on criteria
such as difficulty level and topic. The Matching Service uses the
[Nest](https://github.com/nestjs/nest) framework, designed to manage user
matches effectively and efficiently. This service uses Redis and MongoDB to
facilitate quick data retrieval and storage, ensuring optimal performance during
user matching operations.

## Installation

Before you can run the service, install the necessary dependencies:

```bash

npm install

```

## Environment Setup

Configure the environment variables necessary for connecting to Redis and
MongoDB by creating a `.env` file in your project root with the following contents:

```bash

PORT=3003
DB_CLOUD_URI=<CONNECTION_STRING>
REDIS_HOST=<CONNECTION_STRING>
REDIS_PASS=
REDIS_PORT=10885
API_AUTH_VERIFY_TOKEN_ENDPOINT=http://localhost:3001/auth/verify-token
API_GET_ALL_QUESTIONS_ENDPOINT=http://localhost:3002/questions
MATCHING_REQUEST_TIME_LIMIT=30

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
