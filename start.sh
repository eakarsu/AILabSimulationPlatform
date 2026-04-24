#!/bin/bash

# ============================================
# AI Lab Simulation Platform - Start Script
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo -e "${PURPLE}╔══════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║    🔬 AI Lab Simulation Platform             ║${NC}"
echo -e "${PURPLE}║    Virtual Laboratory for Education          ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════╝${NC}"
echo ""

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

# Load .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
  echo -e "${GREEN}✓ Environment variables loaded${NC}"
else
  echo -e "${RED}✗ .env file not found! Please create one.${NC}"
  exit 1
fi

BACKEND_PORT=${BACKEND_PORT:-3001}
FRONTEND_PORT=${FRONTEND_PORT:-3000}

# ============================================
# Clean up used ports
# ============================================
echo -e "\n${YELLOW}▸ Cleaning up ports...${NC}"

cleanup_port() {
  local port=$1
  local pids=$(lsof -ti :$port 2>/dev/null || true)
  if [ -n "$pids" ]; then
    echo -e "  ${YELLOW}Killing processes on port $port: $pids${NC}"
    echo "$pids" | xargs kill -9 2>/dev/null || true
    sleep 1
  fi
  echo -e "  ${GREEN}✓ Port $port is free${NC}"
}

cleanup_port $BACKEND_PORT
cleanup_port $FRONTEND_PORT

# ============================================
# Check PostgreSQL
# ============================================
echo -e "\n${YELLOW}▸ Checking PostgreSQL...${NC}"
if pg_isready -q 2>/dev/null; then
  echo -e "  ${GREEN}✓ PostgreSQL is running${NC}"
else
  echo -e "  ${YELLOW}Starting PostgreSQL...${NC}"
  brew services start postgresql@14 2>/dev/null || brew services start postgresql 2>/dev/null || {
    echo -e "  ${RED}✗ Could not start PostgreSQL. Please start it manually.${NC}"
    exit 1
  }
  sleep 2
  echo -e "  ${GREEN}✓ PostgreSQL started${NC}"
fi

# ============================================
# Create database if not exists
# ============================================
echo -e "\n${YELLOW}▸ Setting up database...${NC}"
DB_NAME="ai_lab_simulation"

if psql -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
  echo -e "  ${GREEN}✓ Database '$DB_NAME' exists${NC}"
else
  createdb "$DB_NAME" 2>/dev/null && echo -e "  ${GREEN}✓ Database '$DB_NAME' created${NC}" || {
    psql -c "CREATE DATABASE $DB_NAME;" 2>/dev/null && echo -e "  ${GREEN}✓ Database '$DB_NAME' created${NC}" || {
      echo -e "  ${RED}✗ Failed to create database. Trying with postgres user...${NC}"
      psql -U postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || true
    }
  }
fi

# ============================================
# Install dependencies
# ============================================
echo -e "\n${YELLOW}▸ Installing dependencies...${NC}"

if [ ! -d "node_modules" ]; then
  echo -e "  ${CYAN}Installing server dependencies...${NC}"
  npm install --silent 2>&1 | tail -1
fi
echo -e "  ${GREEN}✓ Server dependencies ready${NC}"

if [ ! -d "client/node_modules" ]; then
  echo -e "  ${CYAN}Installing client dependencies...${NC}"
  cd client && npm install --silent 2>&1 | tail -1 && cd ..
fi
echo -e "  ${GREEN}✓ Client dependencies ready${NC}"

# ============================================
# Seed database
# ============================================
echo -e "\n${YELLOW}▸ Seeding database...${NC}"
node server/seeds/seed.js
echo -e "  ${GREEN}✓ Database seeded with sample data${NC}"

# ============================================
# Start application with hot reload
# ============================================
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  🚀 Starting AI Lab Simulation Platform      ║${NC}"
echo -e "${GREEN}║                                              ║${NC}"
echo -e "${GREEN}║  Backend:  http://localhost:${BACKEND_PORT}              ║${NC}"
echo -e "${GREEN}║  Frontend: http://localhost:${FRONTEND_PORT}              ║${NC}"
echo -e "${GREEN}║                                              ║${NC}"
echo -e "${GREEN}║  Login Credentials:                          ║${NC}"
echo -e "${GREEN}║  Email:    admin@ailab.edu                   ║${NC}"
echo -e "${GREEN}║  Password: password123                       ║${NC}"
echo -e "${GREEN}║                                              ║${NC}"
echo -e "${GREEN}║  Press Ctrl+C to stop                        ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════╝${NC}"
echo ""

# Trap to cleanup on exit
trap 'echo -e "\n${YELLOW}Shutting down...${NC}"; kill 0; exit 0' SIGINT SIGTERM

# Start backend with nodemon (hot reload) and frontend with react-scripts (hot reload)
npx concurrently \
  --names "SERVER,CLIENT" \
  --prefix-colors "blue,green" \
  --kill-others \
  "npx nodemon --watch server server/index.js" \
  "cd client && PORT=${FRONTEND_PORT} BROWSER=none npm start"
