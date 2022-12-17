FROM node:18

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
RUN pwd
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .
# RUN npm run prisma:generate

# Creates a "dist" folder with the production build
# Start the server using the production build
CMD ["sh", "/usr/src/app/init.sh"]