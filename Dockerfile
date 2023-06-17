FROM node:20.2.0-alpine3.18

WORKDIR ./

# Packages
COPY *.json ./
COPY *.lock ./
RUN yarn install

# Copy main configs
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
RUN yarn build

CMD yarn production