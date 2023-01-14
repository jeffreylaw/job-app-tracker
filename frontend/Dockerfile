FROM node:19 as builder

WORKDIR /app

COPY ./package.json /app/package.json
RUN npm install
RUN npm install -g serve
COPY . .
ARG version
ENV REACT_APP_VERSION $version
RUN npm run build
CMD ["serve", "-l", "3000", "-s", "build"]

# CMD ["npm", "run", "start"]
