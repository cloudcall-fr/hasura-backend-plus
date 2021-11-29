FROM node:14-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh python3 make g++ build-base vips vips-dev

ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV
ENV PORT 3000

ENV PGOPTIONS "-c search_path=auth"

WORKDIR /app

# needed for jest --watch to work properly
RUN git init /app

COPY package.json yarn.lock ./
RUN yarn install

COPY ../../ .

EXPOSE 9229

CMD ["yarn", "run", "dev:in-docker"]
