ARG VITE_USER_SERVICE_ENDPOINT=http://localhost:3001
ARG VITE_QUESTION_SERVICE_ENDPOINT=http://localhost:3002

# Build
FROM docker.io/node:lts AS build
ARG VITE_USER_SERVICE_ENDPOINT
ARG VITE_QUESTION_SERVICE_ENDPOINT
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

WORKDIR /workspace
COPY . .

RUN true \
    # Set environment variables
    && export VITE_USER_SERVICE_ENDPOINT=$VITE_USER_SERVICE_ENDPOINT \
    && export VITE_QUESTION_SERVICE_ENDPOINT=$VITE_QUESTION_SERVICE_ENDPOINT \
    # Install dependencies
    && npm ci \
    # Lint
    && npm run lint \
    # Build
    && npm run build


# Application
#checkov:skip=CKV_DOCKER_3:
FROM docker.io/nginx:mainline
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

HEALTHCHECK --interval=1m --timeout=3s \
    CMD curl -f http://localhost || exit 1

COPY --from=build /workspace/dist /usr/share/nginx/html
RUN cat <<EOF > /etc/nginx/conf.d/default.conf
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }
}
EOF
