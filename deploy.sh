#!/bin/bash

echo "🔄 Pulling latest code from GitHub..."
git pull origin master

echo "📦 Installing dependencies..."
pnpm install  # or use npm install if you're not using pnpm

echo "⚙️ Running Prisma generate..."
npx prisma generate

echo "🏗️ Building the app..."
pnpm build  # or npm run build

echo "🚀 Restarting the app with PM2..."
pm2 restart my-app || pm2 start npm --name "my-app" -- start

echo "✅ Deployment complete!"
