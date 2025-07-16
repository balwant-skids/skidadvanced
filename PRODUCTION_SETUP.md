# SKIDS Advanced - Production Setup Guide

## 🏗️ Architecture Overview

SKIDS Advanced is built as a **Unified Platform** with role-based access control, providing both parent-facing PWA functionality and provider dashboard capabilities in a single Next.js application.

### Key Architecture Decisions

✅ **Unified Platform** (Recommended)
- Single Next.js application with role-based routing
- Shared database and authentication system
- Integrated payment flow and content delivery
- Simplified deployment and maintenance

### Technology Stack

- **Frontend**: Next.js 14 with TypeScript
- **Authentication**: Clerk (with fallback for development)
- **Payments**: Razorpay with QR code support
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Database**: PostgreSQL (recommended: Supabase/PlanetScale)

## 🚀 Quick Start (Development Mode)

The application runs in development mode without requiring external service configuration:

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` - the app will work with mock authentication and display a development notice.

## 🔧 Production Configuration

### 1. Clerk Authentication Setup

1. Create account at [Clerk Dashboard](https://dashboard.clerk.com)
2. Create new application
3. Copy your keys to `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
CLERK_SECRET_KEY=sk_test_your_actual_key_here
```

4. Configure user roles in Clerk:
   - Go to Users & Authentication > Metadata
   - Add `role` field with values: `parent` or `provider`

### 2. Razorpay Payment Integration

1. Create account at [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Get API keys from Settings > API Keys
3. Add to `.env.local`:

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_here
RAZORPAY_KEY_SECRET=your_secret_key_here
```

4. Configure webhooks for subscription management
5. Enable QR code payments in dashboard

### 3. Database Setup (Recommended: Supabase)

1. Create project at [Supabase](https://supabase.com)
2. Get connection string
3. Add to `.env.local`:

```env
DATABASE_URL=postgresql://user:password@host:port/database
```

## 📱 PWA Configuration

The application is PWA-ready for mobile optimization:

1. **Manifest**: Already configured in `public/manifest.json`
2. **Service Worker**: Implement for offline functionality
3. **Icons**: Add PWA icons to `public/icons/`

## 🔐 User Roles & Permissions

### Parent Role (`role: "parent"`)
- Access to child dashboard
- Health discovery journeys
- Behavioral assessments
- Educational content (based on subscription)
- Appointment booking
- Payment management

### Provider Role (`role: "provider"`)
- Care plan management
- Basic campaign creation
- Family overview
- Appointment management
- Revenue tracking

## 💳 Payment Flow

1. **Plan Selection**: User selects care plan
2. **Authentication Check**: Redirect to sign-up if needed
3. **Razorpay Checkout**: Secure payment processing
4. **Verification**: Server-side payment verification
5. **Activation**: Subscription activation and dashboard access

## 🎯 Core Features

### Simplified Provider Dashboard
- ✅ Care plan creation/editing
- ✅ Basic campaign creation
- ✅ Family management
- ❌ Advanced analytics (use external tools)
- ❌ Complex CRM features (use HubSpot/Salesforce)
- ❌ Advanced marketing automation (use Mailchimp)

### Parent PWA Experience
- ✅ Personalized child dashboard
- ✅ Health discovery journeys
- ✅ Behavioral assessments
- ✅ Educational content access
- ✅ Appointment management
- ✅ Progress tracking

### Educational Content Integration
- **Essential Care**: Free access to Kurzgesagt & TED-Ed
- **Comprehensive Care**: Subsidized premium content
- **Premium Care**: Full access to all educational platforms

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Environment Variables for Production
```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=live_secret_...

# Database
DATABASE_URL=postgresql://...

# App
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 📊 Third-Party Integrations

### For Advanced Features (External Tools)
- **Analytics**: Google Analytics, Mixpanel
- **CRM**: HubSpot, Salesforce
- **Email Marketing**: Mailchimp, SendGrid
- **Customer Support**: Intercom, Zendesk
- **Monitoring**: Sentry, LogRocket

## 🔄 Migration Strategy

If migrating from a more complex setup:

1. **Export Data**: Care plans, user data, payment history
2. **Simplify Provider Features**: Remove advanced analytics/CRM
3. **Configure External Tools**: Set up HubSpot, Mailchimp, etc.
4. **Update User Roles**: Ensure proper Clerk role assignment
5. **Test Payment Flow**: Verify Razorpay integration

## 🛡️ Security Considerations

- ✅ HTTPS in production
- ✅ Environment variable security
- ✅ Clerk authentication
- ✅ Razorpay PCI compliance
- ✅ Database connection security
- ✅ API rate limiting

## 📈 Scaling Strategy

1. **Phase 1**: Single region deployment
2. **Phase 2**: CDN for static assets
3. **Phase 3**: Database read replicas
4. **Phase 4**: Multi-region deployment
5. **Phase 5**: Microservices (if needed)

## 🐛 Troubleshooting

### Common Issues

1. **Clerk Error**: Check publishable key format
2. **Payment Failure**: Verify Razorpay credentials
3. **Database Connection**: Check connection string
4. **Build Errors**: Ensure all dependencies installed

### Development Mode
- Mock authentication works without Clerk
- Payment integration requires Razorpay keys
- Educational content works with static data

---

**Ready to launch your simplified, production-ready SKIDS Advanced platform!** 🚀
