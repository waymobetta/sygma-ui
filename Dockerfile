FROM node:14-alpine AS builder
RUN apk --no-cache add git
WORKDIR /app
RUN ls -al
COPY . .
RUN yarn install --frozen-lockfile
RUN ls -al
RUN yarn build:ui

FROM nginx:1.19-alpine AS server
COPY ./etc/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder ./app/packages/example/build /usr/share/nginx/html