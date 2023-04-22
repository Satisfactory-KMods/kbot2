FROM node:alpine

WORKDIR ./

# Packages
COPY *.json ./
COPY *.lock ./
RUN yarn install

# Copy main configs
COPY *.ts ./
COPY *.js ./
COPY *.html ./
COPY .browserslistrc ./

# Copy source folder
COPY ./src ./src
COPY ./server ./server
COPY ./public ./public
COPY ./shared ./shared
COPY .env ./

# create main files
RUN yarn build

CMD yarn production