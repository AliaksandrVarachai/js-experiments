FROM node:latest
RUN mkdir -p /usr/src/frontend-service
WORKDIR /usr/src/frontend-service
COPY . /usr/src/frontend-service/
RUN [ "npm", "install" ]
RUN [ "npm", "run", "build" ]
RUN [ "npm", "install", "-g", "http-server" ]
EXPOSE 8081
ENTRYPOINT [ "http-server", "./dist", "-p", "8081" ]
CMD [  ]
