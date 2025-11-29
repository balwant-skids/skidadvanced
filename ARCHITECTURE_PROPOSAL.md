# SKIDS Advanced - Sustainable Architecture Proposal

## 🎯 Business Requirements Summary

### User Roles
1. **Super Admin** - Creates clinics, content, campaigns, packages
2. **Clinic Admin/Manager** - Registers patients, manages subscriptions, explains plans
3. **Parent** - Subscribes, accesses discovery, chatbot, reports, assessments

### Core Features
- Multi-clinic white-labeling
- Frictionless registration (Google Auth)
- Subscription management (₹500/month plans)
- Head-to-toe assessments (72 parameters)
- PDF report generation
- Behavioral assessments (Autism, Hearing)
- Parent PWA with offline support
- BYOK AI (Groq/Gemini)
- Campaign & package management

---

## 🏗️ Recommended Tech Stack (Free Tier Optimized)

### Database: **Supabase** ⭐ Best Choice
```
✅ 500MB PostgreSQL database
✅ 1GB file storage (for reports/images)
✅ Built-in Auth (Google, Email, Phone)
✅ Row Level Security (multi-tenancy)
✅ Real-time subscriptions
✅ Edge Functions
✅ Great dashboard for non-technical admins
```

### Hosting: **Vercel**
```
✅ 100GB bandwidth/month
✅ Serverless functions
✅ Edge network (fast in India)
✅ Easy GitHub integration
✅ CLI deployment
✅ Preview deployments
```

### File Storage: **Supabase Storage + Cloudflare R2**
```
✅ Supabase: 1GB free (reports, small files)
✅ R2: 10GB free, no egress (larger files, backups)
```

### Payments: **Razorpay**
```
✅ UPI, Cards, Net Banking
✅ Subscription billing
✅ 2% transaction fee (no monthly cost)
```

### AI: **BYOK (Bring Your Own Key)**
```
✅ Groq (free tier: 30 req/min)
✅ Gemini (free tier: 60 req/min)
✅ Keys stored locally (encrypted)
✅ Zero server cost for AI
```

---

## 📊 Database Schema (Multi-Tenant)

```sql
-- Organizations (Clinics)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL, -- for white-labeling: clinic-name.skids.clinic
  logo_url VARCHAR,
  primary_color VARCHAR DEFAULT '#6366f1',
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Users (All roles)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE,
  phone VARCHAR UNIQUE,
  name VARCHAR NOT NULL,
  role VARCHAR CHECK (role IN ('super_admin', 'clinic_admin', 'parent')) NOT NULL,
  organization_id UUID REFERENCES organizations(id),
  avatar_url VARCHAR,
  auth_provider VARCHAR DEFAULT 'email', -- google, phone, email
  ai_keys JSONB DEFAULT '{}', -- encrypted BYOK keys
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Children (Patients)
CREATE TABLE children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id),
  name VARCHAR NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR,
  photo_url VARCHAR,
  medical_history JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscription Plans (Packages)
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id), -- NULL = global plan
  name VARCHAR NOT NULL,
  description TEXT,
  price_monthly INTEGER NOT NULL, -- in paise (50000 = ₹500)
  features JSONB NOT NULL,
  tests_included JSONB NOT NULL, -- which tests are included
  consultation_discount INTEGER DEFAULT 0, -- percentage
  vaccination_discount INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES plans(id),
  organization_id UUID REFERENCES organizations(id),
  razorpay_subscription_id VARCHAR,
  status VARCHAR CHECK (status IN ('active', 'paused', 'cancelled', 'expired')),
  current_period_start DATE,
  current_period_end DATE,
  tests_remaining JSONB DEFAULT '{}', -- track quarterly tests
  created_at TIMESTAMP DEFAULT NOW()
);

-- Assessments (Head-to-Toe, Behavioral, etc.)
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  type VARCHAR NOT NULL, -- 'head_to_toe', 'behavioral', 'hearing', 'autism_eye_tracking'
  parameters JSONB NOT NULL, -- 72 parameters for head-to-toe
  score INTEGER,
  report_url VARCHAR, -- PDF report URL
  conducted_by UUID REFERENCES users(id),
  conducted_at TIMESTAMP DEFAULT NOW(),
  notes TEXT
);

-- Assessment Parameters (72 parameters template)
CREATE TABLE assessment_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  category VARCHAR NOT NULL, -- vision, ent, heart, lungs, etc.
  normal_range JSONB,
  unit VARCHAR,
  order_index INTEGER
);

-- Campaigns
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  title VARCHAR NOT NULL,
  description TEXT,
  image_url VARCHAR,
  target_audience VARCHAR, -- 'all', 'subscribers', 'non_subscribers'
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Content (Discovery, Educational)
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id), -- NULL = global
  type VARCHAR NOT NULL, -- 'discovery', 'article', 'video', 'tip'
  category VARCHAR NOT NULL, -- 'brain', 'heart', 'nutrition', etc.
  title VARCHAR NOT NULL,
  body TEXT,
  media_url VARCHAR,
  is_premium BOOLEAN DEFAULT false,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chat History (for AI chatbot)
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  child_id UUID REFERENCES children(id),
  role VARCHAR CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Local Storage Sync (for offline)
CREATE TABLE sync_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR NOT NULL, -- 'create', 'update', 'delete'
  table_name VARCHAR NOT NULL,
  record_id UUID,
  data JSONB,
  synced_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔐 Row Level Security (Multi-Tenancy)

```sql
-- Parents can only see their own children
CREATE POLICY "Parents see own children" ON children
  FOR ALL USING (parent_id = auth.uid());

-- Clinic admins see children in their organization
CREATE POLICY "Clinic admins see org children" ON children
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid() AND role = 'clinic_admin'
    )
  );

-- Super admins see everything
CREATE POLICY "Super admins see all" ON children
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin')
  );
```

---

## 📱 PWA Architecture (Offline-First)

```
┌─────────────────────────────────────────────────────────────┐
│                     Parent PWA                               │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Discovery  │  │   Reports   │  │   Chatbot   │         │
│  │  (Offline)  │  │  (Cached)   │  │   (BYOK)    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│                    IndexedDB (Local)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Content   │  │   Reports   │  │ Chat History│         │
│  │   Cache     │  │   (PDFs)    │  │   (Local)   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│                  Service Worker                              │
│  • Cache discovery content on install                        │
│  • Background sync for offline actions                       │
│  • Push notifications for appointments                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 User Flows

### 1. Clinic Registration Flow (Frictionless)
```
Parent at Clinic → Clinic Manager opens tablet
                 → "Register New Patient" 
                 → Parent taps "Continue with Google"
                 → Auto-fills name, email
                 → Add child details (name, DOB)
                 → Done in 30 seconds!
```

### 2. Subscription Flow
```
Discovery Journey → Care Plans page
                  → Manager explains benefits
                  → Parent selects plan (₹500/month)
                  → Razorpay payment (UPI/Card)
                  → Subscription active
                  → First assessment scheduled
```

### 3. Assessment Flow
```
Quarterly reminder → Parent visits clinic
                   → 72-parameter test conducted
                   → Results entered in system
                   → PDF report generated
                   → Report available in Parent App
                   → AI chatbot can discuss results
```

---

## 🤖 BYOK AI Implementation

```typescript
// Store keys locally (encrypted)
const storeAIKey = (provider: 'groq' | 'gemini', key: string) => {
  const encrypted = encrypt(key, userSecret);
  localStorage.setItem(`ai_key_${provider}`, encrypted);
};

// Use key for chat
const chat = async (message: string) => {
  const key = decrypt(localStorage.getItem('ai_key_groq'), userSecret);
  
  // Call AI directly from browser (no server cost!)
  const response = await fetch('https://api.groq.com/v1/chat/completions', {
    headers: { 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({
      model: 'llama-3.1-70b-versatile',
      messages: [
        { role: 'system', content: SKIDS_SYSTEM_PROMPT },
        { role: 'user', content: message }
      ]
    })
  });
  
  return response.json();
};
```

---

## 📊 Admin Dashboard Features

### Super Admin
- Create/manage clinics
- Global content management
- Campaign templates
- Package templates
- Analytics across all clinics

### Clinic Admin
- Register patients (Google Auth)
- Manage subscriptions
- Conduct assessments
- View clinic analytics
- Local campaigns
- Upload reports

### Parent App
- Discovery journey (offline)
- View reports (cached)
- AI chatbot (BYOK)
- Appointment reminders
- Subscription management

---

## 💰 Cost Analysis (Free Tier)

| Service | Free Tier | Estimated Usage | Cost |
|---------|-----------|-----------------|------|
| Supabase | 500MB DB, 1GB storage | 100 clinics, 10K patients | $0 |
| Vercel | 100GB bandwidth | 50K visits/month | $0 |
| Cloudflare R2 | 10GB storage | Report PDFs | $0 |
| Razorpay | No monthly fee | 2% per transaction | Variable |
| **Total Monthly** | | | **$0** (+ payment fees) |

### When to Upgrade
- Supabase Pro ($25/mo): When >500MB data or need backups
- Vercel Pro ($20/mo): When >100GB bandwidth
- Estimated: Can handle 50+ clinics, 5000+ patients on free tier

---

## 🚀 Deployment Commands

```bash
# Initial setup
npx supabase init
npx supabase db push

# Deploy to Vercel
vercel --prod

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy
```

---

## 📋 Implementation Priority

### Phase 1 (Week 1-2): Core Infrastructure
1. Supabase setup with schema
2. Google Auth integration
3. Multi-tenant organization structure
4. Basic admin dashboard

### Phase 2 (Week 3-4): Patient Management
1. Frictionless registration
2. Child profile management
3. Subscription plans
4. Razorpay integration

### Phase 3 (Week 5-6): Assessments
1. 72-parameter assessment form
2. PDF report generation
3. Assessment history
4. Behavioral assessments

### Phase 4 (Week 7-8): Parent PWA
1. Offline discovery content
2. Report viewing/caching
3. BYOK AI chatbot
4. Push notifications

### Phase 5 (Week 9-10): Polish
1. Campaign management
2. Analytics dashboard
3. White-labeling
4. Performance optimization

---

## ✅ Non-Technical Admin Features

The system will be manageable by clinic admins through:

1. **Visual Dashboard** - No code needed
2. **Drag-drop Content Editor** - For campaigns
3. **Simple Forms** - For patient registration
4. **One-click Reports** - PDF generation
5. **Mobile-friendly** - Works on tablets at clinic

---

**This architecture is designed to:**
- Scale from 1 to 100+ clinics on free tier
- Work offline for parents
- Be managed by non-technical staff
- Cost $0/month until significant scale
- Be resilient and maintainable
