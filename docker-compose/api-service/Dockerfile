FROM node:latest
RUN mkdir -p /usr/src/api-service
WORKDIR /usr/src/api-service
COPY . /usr/src/api-service/
RUN [ "npm", "install" ]
EXPOSE 8080
ENTRYPOINT [ "npm", "start" ]
CMD []
