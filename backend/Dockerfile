FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Build the application
RUN npm run build

# Expose port
EXPOSE 3001

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Change ownership of uploads directory
RUN chown -R nestjs:nodejs uploads
RUN chown -R nestjs:nodejs dist

USER nestjs

# Start the application
CMD ["npm", "run", "start:prod"] 