#!/bin/bash

# Update NEXT_PUBLIC_APP_URL in Vercel
# This script helps update the environment variable

echo "🔄 Updating NEXT_PUBLIC_APP_URL in Vercel..."
echo ""
echo "New URL: https://skidsadvanced.vercel.app"
echo ""

# Remove old variable
vercel env rm NEXT_PUBLIC_APP_URL production --yes 2>/dev/null

# Add new variable
echo "https://skidsadvanced.vercel.app" | vercel env add NEXT_PUBLIC_APP_URL production

echo ""
echo "✅ Environment variable updated!"
echo ""
echo "Now redeploying..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
