FROM node:20-alpine@sha256:ec0c413b1d84f3f7f67ec986ba885930c57b5318d2eb3abc6960ee05d4f2eb28
 
COPY ./.nuxt/dist /dist
WORKDIR /dist

CMD node server.mjs