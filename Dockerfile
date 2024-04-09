FROM node:20-bullseye@sha256:c8a1c68561dab3f14505d472dc97d62e57275412c29ee481da60f724251d7b5e

RUN apt-get update && \
  apt-get install -y python-is-python3 python3 python3-dev python3-pip python3-virtualenv && \
  rm -rf /var/lib/apt/lists/* && \
  python --version && \
  node -v && npm -v
RUN npm install -g pnpm bun

COPY . /dist
WORKDIR /dist

# create main files
RUN bun run build

CMD pnpm run production