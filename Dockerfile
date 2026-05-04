FROM alpine
RUN apk add --no-cache nodejs npm
WORKDIR /src
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
