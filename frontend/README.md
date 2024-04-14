# PeerPrep Frontend

![PeerPrep Logo](../GuideAssets/Logo.png)

## Overview

PeerPrep is a technical interview preparation platform designed to offer a
collaborative environment for students to practice and prepare for technical
interviews. Utilizing a microservices architecture, this platform focuses on
enabling real-time collaboration among users who are matched based on criteria
such as difficulty level and topic. The frontend component leverages
[Refine](https://refine.dev/docs), a robust framework that simplifies the creation
of admin panels, B2B, and B2C applications.

## Setup and Installation

### Clone the Repository

To get started, clone the repository and navigate to the frontend directory:

```bash

git  clone  https://github.com/TIC3001-AY2324S2/peerprep-g06.git

cd  frontend`

```

### Install Dependencies

Install the necessary dependencies using npm:

```bash

npm  install

```

### Environment Variables

Create a `.env` file in the root directory of your project and add the
following configurations:

```bash

VITE_QUESTION_SERVICE_ENDPOINT=http://localhost:3002

VITE_USER_SERVICE_ENDPOINT=http://localhost:3001

```

These variables set the endpoints for the question and user services.

## Running the Application

### Development Server

Start the development server with the following command, which will
also open the application in your default web browser:

```bash

npm  run  dev

```

### Build for Production

Compile and optimize the application for production using:

```bash

npm  run  build


npm  run  build

```

### Start the Production Server

After building the application, start the production server with:

```bash

npm  run  start


npm  run  start

```

### Access the Frontend

The frontend can be accessed through:

```bash

http://localhost:5174/


http://localhost:5174/

```

## Learn More

To deepen your understanding of the tools used in this project, explore the
following resources:

- **Refine** [Documentation](https://refine.dev/docs)

- **REST Data Provider** [Documentation](https://refine.dev/docs/core/providers/data-provider/#overview)

- **Material UI** [Tutorial](https://refine.dev/docs/ui-frameworks/mui/tutorial/)

- **React Router** [Documentation](https://refine.dev/docs/core/providers/router-provider/)

- **Custom Auth Provider** [Documentation](https://refine.dev/docs/core/providers/auth-provider/)
