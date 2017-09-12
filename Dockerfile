#Build
FROM node:8-alpine as builder

RUN mkdir /ng-app
WORKDIR /ng-app
COPY package.json /ng-app

RUN npm install

COPY . /ng-app

RUN $(npm bin)/ng build --prod --build-optimizer


#Run
FROM nginx:1.13-alpine

COPY nginx/default.conf /etc/nginx/conf.d/
RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /ng-app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
