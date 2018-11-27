FROM node:8-alpine
RUN mkdir /equipment
WORKDIR /equipment
COPY . /equipment
CMD npm run prod
EXPOSE 8080