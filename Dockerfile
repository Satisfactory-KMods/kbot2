FROM node:18-bullseye

RUN apt-get update && \
  apt-get install -y python-is-python3 python3 python3-dev python3-pip python3-virtualenv && \
  rm -rf /var/lib/apt/lists/* && \
  python --version && \
  node -v && npm -v
RUN npm install -g pnpm

WORKDIR /

# Packages
COPY package.json ./
COPY *.yaml ./
RUN pnpm install

# Copy main configs
COPY *.json ./
COPY .env.* ./
COPY *.ts ./
COPY *.js ./
COPY *.cjs ./
COPY .eslintrc ./
COPY *.html ./

# Copy source folder
COPY ./src ./src
COPY ./server ./server
COPY ./public ./public
COPY ./shared ./shared

# create main files
RUN pnpm build

CMD pnpm production