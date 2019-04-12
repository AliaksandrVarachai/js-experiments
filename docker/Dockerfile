FROM node:10
EXPOSE 3000
WORKDIR /app
COPY index.js package.json package-lock.json ./
RUN npm i
CMD node index.js