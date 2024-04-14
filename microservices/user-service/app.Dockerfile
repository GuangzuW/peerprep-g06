FROM docker.io/node:lts
ARG USERNAME=app
ARG USER_UID=1000
ARG USER_GID=${USER_UID}
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

ENV PORT=3001
ENV ENV=PROD

HEALTHCHECK --interval=1m --timeout=3s \
    CMD curl -f http://localhost:${PORT} || exit 1

WORKDIR /opt/peerprep-user-service
COPY . .

RUN true \
    # https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#non-root-user
    && userdel -r node \
    # Add a non-root user.
    && groupadd -g "${USER_GID}" "${USERNAME}" \
    && useradd -s /bin/bash -u "${USER_UID}" -g "${USER_GID}" -m "${USERNAME}" -l \
    # Install dependencies
    && npm ci --omit dev

# Default user
USER ${USERNAME}

CMD [ "node", "server.js" ]
