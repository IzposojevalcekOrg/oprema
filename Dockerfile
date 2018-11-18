FROM node:8
RUN mkdir /equipment
WORKDIR /equipment
COPY . /equipment
CMD npm run prod
EXPOSE 8080