# SKIDS Advanced - Comprehensive Child Development Platform

A multi-tenant clinic management platform for pediatric health monitoring, behavioral assessments, and parent engagement.

## 🚀 Features

### Authentication & Authorization
- **Clerk Integration** - Google OAuth + Email/Password authentication
- **Role-Based Access** - Super Admin, Clinic Manager, Parent roles
- **Clinic Code Verification** - Parents must enter valid clinic code during registration
- **Whitelist System** - Only pre-approved emails can register for a clinic

### Admin Dashboard (`/admin/*`)
- **Clinic Management** (`/admin/clinics`)
  - Create/edit clinics with auto-generated unique codes
  - Activate/deactivate clinics
  - View subscriber counts
  
- **Parent Management** (`/admin/parents`)
  - Manage parent whitelist per clinic
  - Track registration status
  - Add/remove whitelisted emails
  
- **Campaign Management** (`/admin/campaigns`)
  - Create marketing campaigns with media
  - Target by: All users, Specific clinic, Care plan subscribers
  - Track views and clicks
  - Draft/Active/Completed/Archived states

### Parent Dashboard (`/dashboard/*`)
- **Child Profiles** (`/dashboard/children`)
  - Add multiple children
  - Track health metrics, allergies, blood group
  - View assessment history
  
- **Appointments** (`/dashboard/appointments`)
  - View upcoming appointments
  - Status tracking (scheduled, confirmed, completed)
  - Today/Tomorrow highlighting
  
- **Reports** (`/dashboard/reports`)
  - Download reports uploaded by clinic
  - Secure signed URLs via Cloudflare R2
  - Filter by child
  
- **Messaging** (`/dashboard/messages`)
  - In-app messaging with clinic
  - WhatsApp click-to-chat integration
  - Real-time message display

### Backend Services
- **Push Notifications** (Firebase FCM)
  - New report notifications
  - Message notifications
  - Appointment reminders
  - Campaign announcements
  
- **File Storage** (Cloudflare R2)
  - Secure report uploads
  - Signed download URLs
  - Campaign media storage
  
- **Offline Support** (IndexedDB)
  - Cache children, appointments, campaigns, messages
  - Sync queue for offline mutations
  - Auto-sync on reconnect

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React, TailwindCSS |
| Authentication | Clerk |
| Database | SQLite (dev) / Turso (prod) |
| ORM | Prisma |
| File Storage | Cloudflare R2 |
| Push Notifications | Firebase Cloud Messaging |
| Offline | IndexedDB (idb library) |

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/satishskids-org/skidsadv_new.git
cd skidsadv_new/skidadvanced

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Start development server
npm run dev
```

## ⚙️ Environment Variables

Create `.env.local` with:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Firebase (Push Notifications)
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# Cloudflare R2 (File Storage)
CLOUDFLARE_R2_ENDPOINT=https://xxx.r2.cloudflarestorage.com
CLOUDFLARE_R2_BUCKET=skidsadvanced
CLOUDFLARE_R2_ACCESS_KEY_ID=xxx
CLOUDFLARE_R2_SECRET_ACCESS_KEY=xxx

# Feature Flags
NEXT_PUBLIC_ENABLE_OFFLINE_MODE=true
NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS=true
```

## 👤 User Roles

| Role | Access |
|------|--------|
| `super_admin` | Full system access, all clinics |
| `clinic_manager` | Manage assigned clinic |
| `parent` | Access own children, appointments, reports |

### Making Yourself Admin

```bash
npx prisma studio
# Edit your user record, set role = "super_admin"
```

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/           # Admin pages
│   │   ├── clinics/
│   │   ├── parents/
│   │   └── campaigns/
│   ├── dashboard/       # Parent pages
│   │   ├── children/
│   │   ├── appointments/
│   │   ├── reports/
│   │   └── messages/
│   └── api/             # API routes
│       ├── clinics/
│       ├── children/
│       ├── appointments/
│       ├── campaigns/
│       ├── messages/
│       ├── reports/
│       ├── subscriptions/
│       └── notifications/
├── lib/
│   ├── prisma.ts        # Database client
│   ├── storage.ts       # R2 storage service
│   ├── notifications.ts # FCM service
│   ├── offline-sync.ts  # IndexedDB service
│   └── auth-utils.ts    # Auth helpers
├── components/
│   └── providers/
│       ├── AuthProvider.tsx
│       └── OfflineSyncProvider.tsx
├── hooks/
│   └── useOfflineSync.ts
└── contexts/
    └── UserContext.tsx
```

## 🗄 Database Schema

Key models:
- **User** - Clerk-synced users with roles
- **Clinic** - Multi-tenant clinics with unique codes
- **ParentWhitelist** - Pre-approved parent emails
- **ParentProfile** - Parent-clinic association
- **Child** - Children with health data
- **CarePlan** - Subscription plans
- **Subscription** - User subscriptions
- **Appointment** - Scheduled appointments
- **Report** - Uploaded reports (R2 storage)
- **Campaign** - Marketing campaigns
- **Message** - In-app messaging

## 🔌 API Endpoints

### Clinics
- `POST /api/clinics` - Create clinic
- `GET /api/clinics` - List clinics
- `PATCH /api/clinics/[id]` - Update clinic
- `GET /api/clinics/verify?code=XXX` - Verify clinic code

### Whitelist
- `POST /api/clinics/[id]/whitelist` - Add to whitelist
- `GET /api/clinics/[id]/whitelist` - List whitelist
- `DELETE /api/clinics/[id]/whitelist/[email]` - Remove

### Children
- `POST /api/children` - Add child
- `GET /api/children` - List children
- `GET /api/children/[id]` - Get child with health data
- `PATCH /api/children/[id]` - Update child

### Reports
- `POST /api/children/[id]/reports` - Upload report
- `GET /api/children/[id]/reports` - List reports
- `GET /api/reports/[id]/download` - Get signed download URL

### Appointments
- `POST /api/children/[id]/appointments` - Schedule
- `GET /api/appointments` - List upcoming

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages` - Get conversation

### Campaigns
- `POST /api/campaigns` - Create campaign
- `GET /api/campaigns` - List campaigns
- `PATCH /api/campaigns/[id]` - Update
- `DELETE /api/campaigns/[id]` - Archive

## 🚧 Pending / Future Work

### High Priority
- [ ] Payment integration (Razorpay) for subscriptions
- [ ] Email notifications (welcome, reminders)
- [ ] PWA manifest and service worker
- [ ] Production deployment (Vercel/Railway)

### Medium Priority
- [ ] Assessment modules integration
- [ ] Health metrics visualization/charts
- [ ] Appointment booking by parents
- [ ] Report generation (PDF)
- [ ] Admin analytics dashboard

### Low Priority / Nice to Have
- [ ] Multi-language support (i18n)
- [ ] Dark mode
- [ ] Export data (CSV/Excel)
- [ ] Audit logging
- [ ] Rate limiting

### Testing
- [ ] Property-based tests for clinic code uniqueness
- [ ] Property-based tests for whitelist enforcement
- [ ] Integration tests for API routes
- [ ] E2E tests with Playwright

## 🔐 Security Notes

- Never commit `.env.local` to git
- Rotate Firebase service account keys periodically
- R2 uses signed URLs (1-hour expiry) for downloads
- All API routes verify authentication via Clerk

## 📄 License

Proprietary - SKIDS.CLINIC

## 🤝 Contributing

Contact the development team for contribution guidelines.
