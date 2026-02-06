FROM node:20-alpine

WORKDIR /usr/src/app

# Copy dependency manifests first
COPY app/package*.json ./

RUN npm install

# Copy rest of the Angular app
COPY / .

EXPOSE 4200

CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--poll=2000"]
