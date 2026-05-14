FROM node:20-alpine AS builder

WORKDIR /app/backend

# Copy package files
COPY backend/package*.json ./
COPY backend/tsconfig*.json ./
COPY backend/nest-cli.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY backend/src ./src

# Build
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app/backend

# Copy package files
COPY backend/package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application
COPY --from=builder /app/backend/dist ./dist

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
