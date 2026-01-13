#!/bin/bash

# Kill existing process on the configured port
PORT=${PORT:-4242}
pkill -9 -f "next dev.*$PORT" 2>/dev/null || true
lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
sleep 0.5
rm -f .next/dev/lock

# Start Next.js dev server in background
"$@" &
DEV_PID=$!

# Wait for server to be ready and open browser
echo "⏳ Waiting for server to start..."
sleep 2

# Open browser - reuse existing tab on macOS/Chrome, fallback otherwise
if [[ "$OSTYPE" == "darwin"* ]] && pgrep -x "Google Chrome" > /dev/null; then
    osascript "$(dirname "$0")/open-chrome-tab.applescript" "http://jamium.localhost:$PORT"
else
    open "http://jamium.localhost:$PORT" 2>/dev/null || xdg-open "http://jamium.localhost:$PORT" 2>/dev/null || true
fi

# Bring dev server to foreground
wait $DEV_PID
