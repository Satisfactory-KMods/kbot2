FROM node:20-alpine@sha256:80234aa9669e62c1fb47780d96128127c96fed663bd17dfacfe7bf9e5473884c

COPY .output /dist
COPY server/utils/db/postgres/migrations /dist/server/utils/db/postgres/migrations

WORKDIR /dist

CMD node server/index.mjs