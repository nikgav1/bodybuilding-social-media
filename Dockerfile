# ─────────────────────────────────────────────────────────────────────────────
# 1. Build Stage: Install dependencies & build frontend/backend
# ─────────────────────────────────────────────────────────────────────────────
FROM node:18-alpine AS builder

# Create and switch to the app directory
WORKDIR /app

# Copy only package files to install dependencies first
COPY package.json package-lock.json ./

# Install root dependencies (if any). If you keep package.json empty here, this step does little.
RUN npm install

# Copy the entire project into the container
COPY . .

# Install and build frontend
RUN npm install --prefix frontend
RUN npm run build --prefix frontend

# Install and build backend
RUN npm install --prefix backend
RUN npm run build --prefix backend

# ─────────────────────────────────────────────────────────────────────────────
# 2. Production Stage: Copy build artifacts & run the backend
# ─────────────────────────────────────────────────────────────────────────────
FROM node:18-alpine AS runner
WORKDIR /app

# Copy everything from builder
COPY --from=builder /app /app

# Optionally, if you need environment files:
# COPY .env /app/backend/.env

# Expose the port your backend runs on (adjust if needed)
EXPOSE 3000

# Start the backend (assumes "start" script in backend/package.json)
CMD ["npm", "run", "start", "--prefix", "backend"]