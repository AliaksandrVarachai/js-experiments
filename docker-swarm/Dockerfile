FROM node:latest
RUN mkdir -p /usr/src/docker-swarm
WORKDIR /usr/src/docker-swarm
COPY . .
# RUN [ "node server.mjs" ]
# just a recommendation which ports need to be published with -p flag
EXPOSE 3000
ENTRYPOINT [ "node", "server.js" ]
CMD [ "--port=3000" ]

# Flexibility: redefine application port 3000 to 3111 (internal container port)
# It can be tested outside the container on localhost:4000
# docker run -d -p 4000:3111 my-example --port=3111