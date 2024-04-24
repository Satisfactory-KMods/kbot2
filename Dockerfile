FROM node:18-bullseye@sha256:bb813e008fd9665d13763d9e825b6ba609c1ab7160ef1a30d0bbf3490b5082b1

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