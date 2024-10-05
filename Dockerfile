FROM node:20-alpine@sha256:c13b26e7e602ef2f1074aef304ce6e9b7dd284c419b35d89fcf3cc8e44a8def9

COPY .output /dist
COPY server/utils/db/postgres/migrations /dist/server/utils/db/postgres/migrations

WORKDIR /dist

CMD node server/index.mjs