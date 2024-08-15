# Base image
FROM node:21-slim

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install --legacy-peer-deps

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Expose port 8000
EXPOSE 1999

# Start the server using the production build
CMD [ "npm", "run", "start:prod" ]