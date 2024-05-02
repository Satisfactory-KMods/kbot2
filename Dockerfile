FROM node:20-bullseye@sha256:80234aa9669e62c1fb47780d96128127c96fed663bd17dfacfe7bf9e5473884c

RUN npm install -g pnpm bun

# set env for the app in build time
ENV DISCORD_CLIENT_ID=123123
ENV DISCORD_CLIENT_SECRET=secret
ENV DISCORD_BOT_TOKEN=secret
ENV NEXTAUTH_SECRET=secret
ENV NEXTAUTH_URL=secret
ENV REDIS_PASSWORD=secret
ENV REDIS_HOST=secret
ENV REDIS_PORT=123123
ENV POSTGRES_PASSWORD=secret
ENV POSTGRES_USER=secret
ENV POSTGRES_DB=secret
ENV POSTGRES_HOST=secret
ENV POSTGRES_PORT=123123
ENV FICSIT_APP_API_URL="https://api.ficsit.app/v2/query"
ENV FICSIT_APP_API_TOKEN=secret

COPY . /dist
WORKDIR /dist

RUN pnpm install
RUN bun run build

CMD node .nuxt/dist/server.mjs