FROM node:20-alpine
 
COPY ./.nuxt/dist /dist
WORKDIR /dist

CMD node server.mjs