#!/bin/bash

# Script to set environment variables for Cloudflare Pages
# Project: skids-advanced

PROJECT_NAME="skids-advanced"

echo "🔧 Setting environment variables for $PROJECT_NAME..."
echo ""

# Database
echo "Setting DATABASE_URL..."
wrangler pages secret put DATABASE_URL --project-name=$PROJECT_NAME <<< "libsql://skidsadvanced-satishskid.aws-ap-south-1.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjQzOTUwOTksImlkIjoiY2RjNjk0NWYtMjExMS00NDI2LTkxZmYtYzQwZTkzZTc5ZGNmIiwicmlkIjoiZTAzMjgxZGItN2RlNi00ZjlmLWIyNmQtMGFmYzQxMzRlNGQzIn0.T21ObBIMZQhJ313oWmpioEH7KU-huzcZxNXo-ftYqornU-Rg1dXVpHpC0imzBD-G3PUJU6C_kUDltfM0aHCUAg"

# Clerk Authentication
echo "Setting Clerk variables..."
wrangler pages secret put NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY --project-name=$PROJECT_NAME <<< "pk_test_c3VtbWFyeS1zd2luZS0zOS5jbGVyay5hY2NvdW50cy5kZXYk"
wrangler pages secret put CLERK_SECRET_KEY --project-name=$PROJECT_NAME <<< "sk_test_joJOEjS1U0oaZe2ktjLVNMdK3v1Ejnrr87eOijX2b1"
wrangler pages secret put CLERK_WEBHOOK_SECRET --project-name=$PROJECT_NAME <<< "whsec_BC1cir8/9s7aTVKgm0RsFVVFooC/AkJ0"
wrangler pages secret put NEXT_PUBLIC_CLERK_SIGN_IN_URL --project-name=$PROJECT_NAME <<< "/sign-in"
wrangler pages secret put NEXT_PUBLIC_CLERK_SIGN_UP_URL --project-name=$PROJECT_NAME <<< "/sign-up"
wrangler pages secret put NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL --project-name=$PROJECT_NAME <<< "/dashboard"
wrangler pages secret put NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL --project-name=$PROJECT_NAME <<< "/dashboard"

# Firebase
echo "Setting Firebase variables..."
wrangler pages secret put NEXT_PUBLIC_FIREBASE_API_KEY --project-name=$PROJECT_NAME <<< "AIzaSyAbaiPB_y1WanpGfCdNzq7ds41eMV_t8eY"
wrangler pages secret put NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN --project-name=$PROJECT_NAME <<< "skidsadvanced.firebaseapp.com"
wrangler pages secret put NEXT_PUBLIC_FIREBASE_PROJECT_ID --project-name=$PROJECT_NAME <<< "skidsadvanced"
wrangler pages secret put NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET --project-name=$PROJECT_NAME <<< "skidsadvanced.firebasestorage.app"
wrangler pages secret put NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID --project-name=$PROJECT_NAME <<< "576880068310"
wrangler pages secret put NEXT_PUBLIC_FIREBASE_APP_ID --project-name=$PROJECT_NAME <<< "1:576880068310:web:e9aef8b82dffdf4a016b77"
wrangler pages secret put FIREBASE_SERVICE_ACCOUNT_KEY --project-name=$PROJECT_NAME <<< '{"type":"service_account","project_id":"skidsadvanced","private_key_id":"3a338ce557a0bdbcf0fc00893e5d462d3aa73566","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD7UUN8mGz0Rjcr\n8fGqaTco9lVt0uoqnB97oBbCLjaaHa8jbAZl7C6qcqeXYyyWp8RZ7Oc4aqv1sDyC\n8l/dHalVlLe/LK5KZNbjo0usyWHHDC/ddycB4Q0yJ1wDNjwhoXLIdJkw2tb/xshi\ngsHlWI6dnT5loWvkIK0lpMja3qyklB5lYbwdZBWIIYZMq36nuaJ0iVbqZqYD0Kgb\npg18C8Ecr2XTJFMwbNwfbHtTJSWoVqlf7tLoTi5C5puZNuFOetDE4A5tc9dKakDp\ntLAzyIZdiVi6HKlG1/Fd73PslEFfZBm9lYXeWRsJYQBCo+72Sk/nNb/SC/U5F8F3\nBpjo1f9zAgMBAAECggEAJwXhF5goFtf473hpIMpR7SjZbqz40kvysYSpSVaEAPM0\nriiIZ8wVb5RPrziQLwZ20nXFbg5WNtc6K3piEJiZ92FuafS7TW7nVRUWhjUGMIeV\nE8DRdupl3PtH6hxs7YCUV57kkzWae8B3KKC1ZcdrQaWtuiR8ocFse/Nggr0KYUrA\na1OqDG+LoqnOHpYriBFGOTO5hPJpQTn7JBzXFsk45DDPZqzCHW6AKDd8DiPohtZ2\nVqK3J6RTbJgIwI/WKlOwVqgvY+64JaUfcSxdHfEw9o9aFULkooZNbQA79JqKyOg+\nJ+WbFjQImXXG5jvXvhOIu6dBF4yUDMUigDPh/oIvbQKBgQD+tq7I3Fxvx4TYX8F4\nMeH82AD1B0AJP9Iajz+gXfLI+mLyojLm4Xq4W4MoyYSerhWRadNAIWQWlKU/d5ta\n3eegFATQBeDXyUEE0uIEINQyJY3VH0JeFDQpzzaYS/GFuEEQfhP4vMrXjMLVPsD1\n0Mqk66yq7AhRJ+vvVI4XCCUZzwKBgQD8ljCjBsKXF+Ht05UUi94sB3V76XM+TFv+\nLWd7YNj3QocgPbs2EuoiJ2poZU9Wejb3vcwIYnFYs1RkBQxQceUp6jrrDHdNdvli\nXtF5XwRFvA948JM+v0wdCogUdwsKSklaQgYHC7u8P4Gz0mfLH8XToZq27zAfwSA7\nxsO0Wnh9HQKBgQD6pPW1vfJQJHt7GC8fgaap0jyO4YWIFH9Bl3i66/f/ATThIe8I\n9xR12cdlGXghVZjvsL0qPDFrbvZ1T9NWRUqqYUijE0W/0dDjWEkEWvG0LvQ0pj/+\np8703W0RzJlsRnXwLsCkYdMQ7PjEMq5atgzS4P7WatF8WtZ2ejQgQemQTQKBgF7j\nXSohZAC27B0YGy04ziHkO3JtZOnGbdiy3ekvnNJmn7Sw/B94Q5TJEeReCswF5Zh0\nKK4NrV8RH2bjrpiZ8OkqITAj4r2rMEyQKklaNJSt7XIVjntICiPuzOhDQFaBScUq\ngHEtKz2w7dzL8koQiZTTZPfMK1wChUVvih26zwDRAoGAZ/8yx72o0T11GKiORzFd\nWDP7Pg5+X8BH8eDQipIY1SdWxN+qHIF4lC9DwlkY0lBezKMMWp/RDMyvkVXKQH8T\nCrGKu8JRAYRGYkI1cqkezmDBW3KUG3qRVvtTBxqvWsSYdgcyImDPG7N4NWvAH5fn\nVvXQeWg7xvVbow5fYRF2yXE=\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-fbsvc@skidsadvanced.iam.gserviceaccount.com","client_id":"114799434283517846104","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40skidsadvanced.iam.gserviceaccount.com","universe_domain":"googleapis.com"}'

# Cloudflare R2
echo "Setting R2 variables..."
wrangler pages secret put CLOUDFLARE_R2_ENDPOINT --project-name=$PROJECT_NAME <<< "https://9f4998a66a5d7bd7a230d0222544fbe6.r2.cloudflarestorage.com"
wrangler pages secret put CLOUDFLARE_R2_BUCKET --project-name=$PROJECT_NAME <<< "skidsadvanced"
wrangler pages secret put CLOUDFLARE_R2_ACCESS_KEY_ID --project-name=$PROJECT_NAME <<< "53da3ff3a3f0ab3bc06e6d7ebadf6203"
wrangler pages secret put CLOUDFLARE_R2_SECRET_ACCESS_KEY --project-name=$PROJECT_NAME <<< "dbac6de2f429ad4e89042ad6aca6965449ccdaf9a834a22e586610b9544aef90"
wrangler pages secret put CLOUDFLARE_ACCOUNT_ID --project-name=$PROJECT_NAME <<< "9f4998a66a5d7bd7a230d0222544fbe6"
wrangler pages secret put NEXT_PUBLIC_R2_PUBLIC_URL --project-name=$PROJECT_NAME <<< "https://9f4998a66a5d7bd7a230d0222544fbe6.r2.cloudflarestorage.com/skidsadvanced"

# Application Settings
echo "Setting application variables..."
wrangler pages secret put NODE_ENV --project-name=$PROJECT_NAME <<< "production"
wrangler pages secret put NEXT_PUBLIC_APP_NAME --project-name=$PROJECT_NAME <<< "SKIDS Advanced"
wrangler pages secret put NEXT_PUBLIC_APP_URL --project-name=$PROJECT_NAME <<< "https://skids-advanced.pages.dev"
wrangler pages secret put NEXT_PUBLIC_ENABLE_OFFLINE_MODE --project-name=$PROJECT_NAME <<< "true"
wrangler pages secret put NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS --project-name=$PROJECT_NAME <<< "true"
wrangler pages secret put NEXT_PUBLIC_ENABLE_GOOGLE_AUTH --project-name=$PROJECT_NAME <<< "true"

echo ""
echo "✅ All environment variables have been set!"
echo ""
echo "🚀 Your application is deployed at: https://skids-advanced.pages.dev"
echo ""
echo "📋 Next steps:"
echo "1. Configure Clerk webhook at: https://dashboard.clerk.com"
echo "2. Test your application"
echo "3. Monitor logs with: wrangler pages deployment tail --project-name=skids-advanced"
