FROM node:20-bullseye@sha256:9844aa122d98fc760074cb361d2db7b1b76ee87a3c12ef659c365ad5050b1089

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

CMD bun run production