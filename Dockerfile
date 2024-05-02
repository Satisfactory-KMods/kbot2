FROM node:20-alpine@sha256:7a91aa397f2e2dfbfcdad2e2d72599f374e0b0172be1d86eeb73f1d33f36a4b2

RUN npm install -g pnpm
 
COPY . /dist
WORKDIR /dist

RUN pnpm install
RUN pnpm build

CMD node .nuxt/dist/server.mjs