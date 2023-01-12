FROM node:19 as builder

WORKDIR /app

COPY ./package.json /app/package.json
RUN npm install
COPY . .
RUN npm run build

FROM nginx

COPY --from=builder /app/build/ /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
