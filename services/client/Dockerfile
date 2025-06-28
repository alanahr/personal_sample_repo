FROM node:20-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /client

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN npm install

COPY . .

EXPOSE 5173

CMD npm run dev