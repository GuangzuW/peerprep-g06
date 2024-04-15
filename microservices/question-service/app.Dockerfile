ARG USERNAME=app
ARG USER_UID=1000
ARG USER_GID=${USER_UID}

# Build
FROM docker.io/node:lts AS build
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

WORKDIR /workspace
COPY . .

RUN true \
    # Install dependencies
    && npm ci \
    # Lint
    && npm run lint \
    # Run unit tests
    && npm test \
    # Build
    && npm run build

# Application
FROM docker.io/node:lts
ARG USERNAME
ARG USER_UID
ARG USER_GID
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

HEALTHCHECK --interval=1m --timeout=3s \
    CMD curl -f http://localhost:3002 || exit 1

WORKDIR /opt/peerprep-question-service
COPY --from=build /workspace/dist /opt/peerprep-question-service
COPY package*.json /opt/peerprep-question-service

RUN true \
    # https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#non-root-user
    && userdel -r node \
    # Add a non-root user.
    && groupadd -g "${USER_GID}" "${USERNAME}" \
    && useradd -s /bin/bash -u "${USER_UID}" -g "${USER_GID}" -m "${USERNAME}" -l \
    # Install runtime dependencies
    && npm ci --omit dev

# Default user
USER ${USERNAME}

CMD [ "node", "main.js" ]
