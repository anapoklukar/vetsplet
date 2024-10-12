FROM node:latest as build

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . /app


RUN npm run build


FROM nginx:alpine

COPY --from=build /app/dist/Veterinar /usr/share/nginx/html


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
