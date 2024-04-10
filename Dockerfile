<<<<<<< HEAD
FROM node:20-alpine
=======
FROM node:20-bullseye@sha256:7fc601c29df5288496fc08786e237b6d536ce7ce8811497017bd69e9adf58067
>>>>>>> f6934b5cd330db81ea55e64377e45a6a466ea9d0

COPY ./.nuxt/dist /dist
WORKDIR /dist

CMD node server.mjs