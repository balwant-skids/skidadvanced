#!/bin/bash

# Add all environment variables to Vercel
# Run this script to configure production environment

echo "Adding environment variables to Vercel..."

# Database
vercel env add DATABASE_URL production <<< "libsql://skidsadvanced-satishskid.aws-ap-south-1.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjQzOTUwOTksImlkIjoiY2RjNjk0NWYtMjExMS00NDI2LTkxZmYtYzQwZTkzZTc5ZGNmIiwicmlkIjoiZTAzMjgxZGItN2RlNi00ZjlmLWIyNmQtMGFmYzQxMzRlNGQzIn0.T21ObBIMZQhJ313oWmpioEH7KU-huzcZxNXo-ftYqornU-Rg1dXVpHpC0imzBD-G3PUJU6C_kUDltfM0aHCUAg"

# Clerk Webhook
vercel env add CLERK_WEBHOOK_SECRET production <<< "whsec_BC1cir8/9s7aTVKgm0RsFVVFooC/AkJ0"

# Clerk URLs
vercel env add NEXT_PUBLIC_CLERK_SIGN_IN_URL production <<< "/sign-in"
vercel env add NEXT_PUBLIC_CLERK_SIGN_UP_URL production <<< "/sign-up"
vercel env add NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL production <<< "/dashboard"
vercel env add NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL production <<< "/dashboard"

# Firebase
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production <<< "AIzaSyAbaiPB_y1WanpGfCdNzq7ds41eMV_t8eY"
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production <<< "skidsadvanced.firebaseapp.com"
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production <<< "skidsadvanced"
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production <<< "skidsadvanced.firebasestorage.app"
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production <<< "576880068310"
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production <<< "1:576880068310:web:e9aef8b82dffdf4a016b77"

# R2 Storage
vercel env add CLOUDFLARE_R2_ENDPOINT production <<< "https://9f4998a66a5d7bd7a230d0222544fbe6.r2.cloudflarestorage.com"
vercel env add CLOUDFLARE_R2_BUCKET production <<< "skidsadvanced"
vercel env add CLOUDFLARE_R2_ACCESS_KEY_ID production <<< "53da3ff3a3f0ab3bc06e6d7ebadf6203"
vercel env add CLOUDFLARE_R2_SECRET_ACCESS_KEY production <<< "dbac6de2f429ad4e89042ad6aca6965449ccdaf9a834a22e586610b9544aef90"
vercel env add CLOUDFLARE_ACCOUNT_ID production <<< "9f4998a66a5d7bd7a230d0222544fbe6"
vercel env add NEXT_PUBLIC_R2_PUBLIC_URL production <<< "https://9f4998a66a5d7bd7a230d0222544fbe6.r2.cloudflarestorage.com/skidsadvanced"

# Application Settings
vercel env add NODE_ENV production <<< "production"
vercel env add NEXT_PUBLIC_APP_NAME production <<< "SKIDS Advanced"
vercel env add NEXT_PUBLIC_ENABLE_OFFLINE_MODE production <<< "true"
vercel env add NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS production <<< "true"
vercel env add NEXT_PUBLIC_ENABLE_GOOGLE_AUTH production <<< "true"

echo "✅ All environment variables added!"
echo "Now deploy with: vercel --prod"
