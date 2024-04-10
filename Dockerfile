FROM node:18-bullseye@sha256:b68503c9d4766195873b6b04c3f55a018995ac1e4d6cbc091eeb4a5777aa528e

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