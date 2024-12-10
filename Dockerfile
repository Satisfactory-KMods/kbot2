FROM node:22-alpine@sha256:348b3e6ff4eb6b9ac7c9cc5324b90bf8fc2b7b97621ca1e9e985b7c80f7ce6b3

COPY .output /dist
COPY server/utils/db/postgres/migrations /dist/server/utils/db/postgres/migrations

WORKDIR /dist

CMD node server/index.mjs