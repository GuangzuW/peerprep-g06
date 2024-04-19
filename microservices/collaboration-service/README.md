# Matching Service

![PeerPrep Logo](../../GuideAssets/Logo.png)

## Description

The collaboration service in PeerPrep, a technical interview preparation
platform, provides users with a vibrant and interactive space for real-time
collaboration, fostering productivity and enhancing interview readiness. This
service efficiently handles user matches using the Nest framework, ensuring
seamless connections between individuals. Leveraging Yjs and MongoDB enables
quick data retrieval and storage, enhancing the overall speed and responsiveness
of the platform. By focusing on user experience and performance, the
collaboration service plays a pivotal role in elevating PeerPrep's effectiveness,
empowering users to excel in their technical interviews.

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
