# Step 1: Build the React app
FROM node:20-alpine AS builder
WORKDIR /app

# Accept build-time environment variables (build args)
ARG VITE_BS_BACKEND_URL

# Set environment variables for the React build process
ENV VITE_BS_BACKEND_URL=$VITE_BS_BACKEND_URL

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Step 2: Serve the React app with Node.js using `serve`
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
RUN npm install -g serve
EXPOSE 80
CMD ["serve", "-s", "dist", "-l", "80"]
