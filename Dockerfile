FROM node:20-alpine@sha256:80234aa9669e62c1fb47780d96128127c96fed663bd17dfacfe7bf9e5473884c

RUN npm add -g bun pnpm

COPY . /dist
WORKDIR /dist

CMD pnpm install && bun run build && node .output/server/index.mjs