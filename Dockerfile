FROM node:20-bullseye@sha256:80234aa9669e62c1fb47780d96128127c96fed663bd17dfacfe7bf9e5473884c

RUN npm install -g pnpm bun
 
COPY . /dist
WORKDIR /dist

RUN pnpm install

# todo: add a build step with compatiple env
CMD pnpm run build && node .nuxt/dist/server.mjs