FROM docker.io/mongo:7-jammy

HEALTHCHECK --interval=1m --timeout=3s \
    CMD mongosh --eval 'db.runCommand("ping").ok' localhost:27017/test --quiet

# Default user
USER mongodb
