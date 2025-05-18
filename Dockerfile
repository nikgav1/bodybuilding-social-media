# ─────────────────────────────────────────────────────────────────────────────
# 1. Build Stage: Install dependencies & build frontend/backend
# ─────────────────────────────────────────────────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files for root, frontend, and backend
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies separately to leverage Docker caching
RUN npm install && \
    npm install --prefix frontend && \
    npm install --prefix backend

# Copy all source files (except those in .dockerignore)
COPY . .

# Build applications
RUN npm run build --prefix frontend && \
    npm run build --prefix backend

# ─────────────────────────────────────────────────────────────────────────────
# 2. Production Stage: Copy only what's needed to run the app
# ─────────────────────────────────────────────────────────────────────────────
FROM node:18-alpine AS runner

# Set production environment
ENV NODE_ENV=production

WORKDIR /app

# Copy backend package files and install only production dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# Copy built artifacts
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/frontend/dist ./frontend/dist

# Copy any additional files needed for backend to serve frontend
COPY backend/.env ./backend/.env

# Expose API port
EXPOSE 3000

# Run the app (note: only runs the compiled JS, not TypeScript)
CMD ["npm", "run", "start", "--prefix", "backend"]