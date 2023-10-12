# Use an official Node.js 18 runtime as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install



# Copy the rest of the application code to the container
COPY . .
RUN npm run build
# Expose the port that your Vite app is running on
EXPOSE 4173

# Define the command to start your Vite app
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]