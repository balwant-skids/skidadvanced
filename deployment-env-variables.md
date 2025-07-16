# 🔐 SKIDS Advanced - Deployment Environment Variables

## 📋 **REQUIRED ENVIRONMENT VARIABLES FOR PRODUCTION**

### **🏗️ Application Settings**
```env
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://your-domain.vercel.app
```

### **🔐 Authentication (Clerk) - REQUIRED**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_actual_key_here
CLERK_SECRET_KEY=sk_live_your_actual_key_here
```

### **💳 Payment Gateways - REQUIRED**
```env
# Razorpay (Primary for Indian market)
RAZORPAY_KEY_ID=rzp_live_your_key_here
RAZORPAY_KEY_SECRET=your_razorpay_secret_here

# Stripe (International)
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key_here
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_here

# PayPal (Optional)
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_secret_here
```

### **🗄️ Database (Supabase) - REQUIRED**
```env
DATABASE_URL=postgresql://user:password@host:port/database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key_here
```

### **🤖 External Services - OPTIONAL**
```env
# NutreeAI Integration
NUTREEAI_API_KEY=your_nutreeai_api_key_here
NUTREEAI_BASE_URL=https://nutreeai.netlify.com

# Shanti Pranayama Integration
SHANTI_API_KEY=your_shanti_api_key_here
SHANTI_BASE_URL=https://pranayama-coach-shanti-969652507861.us-west1.run.app
```

### **🎛️ Feature Flags - OPTIONAL**
```env
ENABLE_VENDOR_ONBOARDING=true
ENABLE_AI_RECOMMENDATIONS=true
ENABLE_ROI_ANALYTICS=true
ENABLE_REAL_TIME_ANALYTICS=true
USE_MOCK_PAYMENTS=false
USE_MOCK_AI=false
```

### **📊 Analytics & Monitoring - OPTIONAL**
```env
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Sentry Error Tracking
SENTRY_DSN=https://your-sentry-dsn-here
SENTRY_ORG=your-org
SENTRY_PROJECT=skids-advanced
```

---

## 🚨 **IMPORTANT NOTES**

### **🔒 Security Guidelines**
1. **Never commit secrets** to git repository
2. **Use live/production keys** for production deployment
3. **Test with sandbox keys** first in staging
4. **Rotate keys regularly** for security

### **📝 Setup Priority**
1. **Essential**: App settings, Authentication, Database
2. **Important**: Payment gateways (at least Razorpay)
3. **Optional**: External services, analytics, monitoring

### **🧪 Testing Strategy**
1. **Staging First**: Deploy with test/sandbox keys
2. **Verify Functionality**: Test all critical features
3. **Production**: Switch to live keys after testing
