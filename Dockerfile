FROM node:20-alpine@sha256:df02558528d3d3d0d621f112e232611aecfee7cbc654f6b375765f72bb262799

COPY .output /dist
COPY server/utils/db/postgres/migrations /dist/server/utils/db/postgres/migrations

WORKDIR /dist

CMD node server/index.mjs