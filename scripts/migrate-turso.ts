import { createClient } from '@libsql/client'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env' })
config({ path: '.env.local' })

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'libsql://skidsadvanced-satishskid.aws-ap-south-1.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjQzOTUwOTksImlkIjoiY2RjNjk0NWYtMjExMS00NDI2LTkxZmYtYzQwZTkzZTc5ZGNmIiwicmlkIjoiZTAzMjgxZGItN2RlNi00ZjlmLWIyNmQtMGFmYzQxMzRlNGQzIn0.T21ObBIMZQhJ313oWmpioEH7KU-huzcZxNXo-ftYqornU-Rg1dXVpHpC0imzBD-G3PUJU6C_kUDltfM0aHCUAg',
})

const schema = `
-- Users table
CREATE TABLE IF NOT EXISTS User (
  id TEXT PRIMARY KEY,
  clerkId TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'parent',
  fcmToken TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_user_clerkId ON User(clerkId);
CREATE INDEX IF NOT EXISTS idx_user_email ON User(email);

-- Clinic table
CREATE TABLE IF NOT EXISTS Clinic (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  whatsappNumber TEXT,
  isActive INTEGER DEFAULT 1,
  settings TEXT DEFAULT '{}',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  managerId TEXT UNIQUE,
  FOREIGN KEY (managerId) REFERENCES User(id)
);
CREATE INDEX IF NOT EXISTS idx_clinic_code ON Clinic(code);
CREATE INDEX IF NOT EXISTS idx_clinic_isActive ON Clinic(isActive);

-- ParentWhitelist table
CREATE TABLE IF NOT EXISTS ParentWhitelist (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  phone TEXT,
  name TEXT,
  isRegistered INTEGER DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  clinicId TEXT NOT NULL,
  FOREIGN KEY (clinicId) REFERENCES Clinic(id) ON DELETE CASCADE,
  UNIQUE(clinicId, email)
);
CREATE INDEX IF NOT EXISTS idx_whitelist_email ON ParentWhitelist(email);

-- ParentProfile table
CREATE TABLE IF NOT EXISTS ParentProfile (
  id TEXT PRIMARY KEY,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  userId TEXT UNIQUE NOT NULL,
  clinicId TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
  FOREIGN KEY (clinicId) REFERENCES Clinic(id)
);
CREATE INDEX IF NOT EXISTS idx_parent_clinicId ON ParentProfile(clinicId);

-- Child table
CREATE TABLE IF NOT EXISTS Child (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  dateOfBirth DATETIME NOT NULL,
  gender TEXT,
  bloodGroup TEXT,
  allergies TEXT,
  healthMetrics TEXT DEFAULT '{}',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  parentId TEXT NOT NULL,
  FOREIGN KEY (parentId) REFERENCES ParentProfile(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_child_parentId ON Child(parentId);

-- CarePlan table
CREATE TABLE IF NOT EXISTS CarePlan (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  billingCycle TEXT DEFAULT 'monthly',
  features TEXT DEFAULT '[]',
  isActive INTEGER DEFAULT 1,
  displayOrder INTEGER DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  clinicId TEXT,
  FOREIGN KEY (clinicId) REFERENCES Clinic(id)
);
CREATE INDEX IF NOT EXISTS idx_careplan_clinicId ON CarePlan(clinicId);
CREATE INDEX IF NOT EXISTS idx_careplan_isActive ON CarePlan(isActive);

-- Subscription table
CREATE TABLE IF NOT EXISTS Subscription (
  id TEXT PRIMARY KEY,
  status TEXT DEFAULT 'active',
  startDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  endDate DATETIME,
  razorpayId TEXT UNIQUE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  parentId TEXT UNIQUE NOT NULL,
  carePlanId TEXT NOT NULL,
  FOREIGN KEY (parentId) REFERENCES ParentProfile(id) ON DELETE CASCADE,
  FOREIGN KEY (carePlanId) REFERENCES CarePlan(id)
);
CREATE INDEX IF NOT EXISTS idx_subscription_status ON Subscription(status);
CREATE INDEX IF NOT EXISTS idx_subscription_endDate ON Subscription(endDate);

-- Assessment table
CREATE TABLE IF NOT EXISTS Assessment (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  category TEXT,
  results TEXT NOT NULL,
  score INTEGER,
  recommendations TEXT DEFAULT '[]',
  completedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  childId TEXT NOT NULL,
  FOREIGN KEY (childId) REFERENCES Child(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_assessment_childId ON Assessment(childId);
CREATE INDEX IF NOT EXISTS idx_assessment_type ON Assessment(type);
CREATE INDEX IF NOT EXISTS idx_assessment_completedAt ON Assessment(completedAt);

-- Appointment table
CREATE TABLE IF NOT EXISTS Appointment (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT,
  description TEXT,
  scheduledAt DATETIME NOT NULL,
  duration INTEGER DEFAULT 30,
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  reminderSent INTEGER DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  childId TEXT NOT NULL,
  FOREIGN KEY (childId) REFERENCES Child(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_appointment_childId ON Appointment(childId);
CREATE INDEX IF NOT EXISTS idx_appointment_scheduledAt ON Appointment(scheduledAt);
CREATE INDEX IF NOT EXISTS idx_appointment_status ON Appointment(status);

-- Report table
CREATE TABLE IF NOT EXISTS Report (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  fileUrl TEXT NOT NULL,
  fileName TEXT NOT NULL,
  fileSize INTEGER NOT NULL,
  mimeType TEXT NOT NULL,
  uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  childId TEXT NOT NULL,
  FOREIGN KEY (childId) REFERENCES Child(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_report_childId ON Report(childId);
CREATE INDEX IF NOT EXISTS idx_report_uploadedAt ON Report(uploadedAt);

-- Campaign table
CREATE TABLE IF NOT EXISTS Campaign (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT DEFAULT '{}',
  mediaUrl TEXT,
  mediaType TEXT,
  targetAudience TEXT DEFAULT 'all',
  targetIds TEXT DEFAULT '[]',
  ctaText TEXT,
  ctaUrl TEXT,
  status TEXT DEFAULT 'draft',
  startDate DATETIME,
  endDate DATETIME,
  viewCount INTEGER DEFAULT 0,
  clickCount INTEGER DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  clinicId TEXT,
  FOREIGN KEY (clinicId) REFERENCES Clinic(id)
);
CREATE INDEX IF NOT EXISTS idx_campaign_status ON Campaign(status);
CREATE INDEX IF NOT EXISTS idx_campaign_clinicId ON Campaign(clinicId);
CREATE INDEX IF NOT EXISTS idx_campaign_startDate ON Campaign(startDate);
CREATE INDEX IF NOT EXISTS idx_campaign_endDate ON Campaign(endDate);

-- Message table
CREATE TABLE IF NOT EXISTS Message (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  isFromParent INTEGER NOT NULL,
  isRead INTEGER DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  senderId TEXT NOT NULL,
  clinicId TEXT NOT NULL,
  childId TEXT,
  FOREIGN KEY (senderId) REFERENCES User(id),
  FOREIGN KEY (clinicId) REFERENCES Clinic(id)
);
CREATE INDEX IF NOT EXISTS idx_message_senderId ON Message(senderId);
CREATE INDEX IF NOT EXISTS idx_message_clinicId ON Message(clinicId);
CREATE INDEX IF NOT EXISTS idx_message_createdAt ON Message(createdAt);
CREATE INDEX IF NOT EXISTS idx_message_isRead ON Message(isRead);

-- SyncEvent table
CREATE TABLE IF NOT EXISTS SyncEvent (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  entity TEXT NOT NULL,
  entityId TEXT NOT NULL,
  action TEXT NOT NULL,
  data TEXT NOT NULL,
  processedAt DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_sync_userId ON SyncEvent(userId);
CREATE INDEX IF NOT EXISTS idx_sync_createdAt ON SyncEvent(createdAt);
CREATE INDEX IF NOT EXISTS idx_sync_processedAt ON SyncEvent(processedAt);
`

async function migrate() {
  console.log('Migrating schema to Turso...')
  
  const statements = schema.split(';').filter(s => s.trim())
  
  for (const statement of statements) {
    if (statement.trim()) {
      try {
        await client.execute(statement + ';')
        console.log('✓ Executed:', statement.substring(0, 50) + '...')
      } catch (error: any) {
        if (!error.message?.includes('already exists')) {
          console.error('Error:', error.message)
        }
      }
    }
  }
  
  console.log('Migration complete!')
}

migrate().catch(console.error)
