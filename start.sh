#!/bin/bash
cd "$(dirname "$0")"

# Kill any existing Next.js dev server
pkill -f "next dev" 2>/dev/null

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the dev server
echo "Starting server at http://localhost:3000"
echo "Login: admin / Jossie is die beste"
echo ""
npm run dev
