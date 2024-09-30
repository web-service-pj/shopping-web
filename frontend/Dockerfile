# Build stage
FROM node:14 as build

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    python

WORKDIR /app

# Install npm dependencies
COPY package.json package-lock.json ./
RUN npm cache clean --force
RUN npm install --no-optional

# Build the application
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]