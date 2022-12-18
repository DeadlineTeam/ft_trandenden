FROM node:18

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY ./app/package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY ./app/* .
# RUN npm run prisma:generate

# Start the server using the product
CMD [ "npm", "run", "start" ]