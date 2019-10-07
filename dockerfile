FROM node:10.16.2

RUN mkdir -p /app
WORKDIR /app
COPY ./package.json /app
COPY ./yarn.lock /app
COPY ./tsconfig.json /app

COPY ./private-key.json /app
COPY ./src /app
RUN yarn 

RUN yarn build

ENTRYPOINT ["yarn","start"]
