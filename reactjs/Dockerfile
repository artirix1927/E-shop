FROM node:20-alpine

# RUN apt-get update && apt-get install -y libpq-dev build-essential

WORKDIR /reactjs

COPY . .

# COPY package.json ./
# COPY package-lock.json ./
RUN npm install --legacy-peer-deps

EXPOSE 3000

CMD ["npm", "start"]