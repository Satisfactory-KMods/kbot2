FROM node:22-alpine@sha256:96cc8323e25c8cc6ddcb8b965e135cfd57846e8003ec0d7bcec16c5fd5f6d39f

COPY .output /dist
COPY server/utils/db/postgres/migrations /dist/server/utils/db/postgres/migrations

WORKDIR /dist

CMD node server/index.mjs