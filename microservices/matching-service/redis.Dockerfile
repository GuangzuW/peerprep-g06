FROM docker.io/redis:7

HEALTHCHECK --interval=1m --timeout=3s \
    CMD redis-cli --raw incr ping

# Default user
USER redis
