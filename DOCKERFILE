FROM node:alpine

WORKDIR ./

# Packages
COPY *.json ./
COPY *.lock ./
RUN yarn install

# Copy main configs
COPY .eslintrc ./
COPY *.ts ./
COPY *.js ./
COPY *.html ./

# Copy source folder
COPY ./src ./src
COPY ./server ./server
COPY ./public ./public
COPY ./shared ./shared
COPY .browserslistrc ./
COPY .env ./

# create main files
RUN yarn build

CMD yarn production