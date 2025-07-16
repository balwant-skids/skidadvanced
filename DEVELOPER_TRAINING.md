# SKIDS Advanced - Developer Training Materials

**Comprehensive onboarding guide for new developers joining the SKIDS Advanced project.**

---

## 🎯 **Training Overview**

### **Training Objectives**
By the end of this training, developers will be able to:
- Understand the SKIDS Advanced platform architecture and business model
- Navigate and contribute to the existing codebase effectively
- Follow established development practices and coding standards
- Implement new features using the existing component library and patterns
- Test and deploy changes using the established workflow

### **Training Timeline**
- **Day 1**: Platform overview, setup, and architecture understanding
- **Day 2**: Codebase walkthrough and component deep-dive
- **Day 3**: Development workflow and hands-on practice
- **Day 4**: Testing procedures and quality assurance
- **Day 5**: Deployment process and team integration

---

## 🏗️ **Platform Architecture Deep Dive**

### **Business Model Understanding**

#### **Target Users**
1. **Parents**: Primary users seeking child health monitoring and educational content
2. **Healthcare Providers**: Professionals managing patient care and family outreach
3. **Children**: End beneficiaries of health assessments and educational journeys

#### **Revenue Model**
- **Essential Plan (₹299/month)**: Basic features + FREE educational content
- **Comprehensive Plan (₹499/month)**: Enhanced features + SUBSIDIZED premium content
- **Premium Plan (₹799/month)**: Full features + UNLIMITED premium educational access

#### **Key Value Propositions**
- **For Parents**: Comprehensive child development tracking with engaging educational content
- **For Providers**: Efficient patient management with automated campaign tools
- **For Children**: Fun, educational exploration of health and body systems

### **Technical Architecture**

#### **Frontend Architecture**
```
Next.js 14 App Router
├── Server Components (Default)
│   ├── Static content rendering
│   ├── SEO optimization
│   └── Initial data fetching
├── Client Components ('use client')
│   ├── Interactive elements
│   ├── State management
│   └── User interactions
└── API Routes (/api)
    ├── Authentication endpoints
    ├── Payment processing
    └── Data operations
```

#### **State Management Strategy**
```typescript
// Global State: React Context + useReducer
// Local State: useState + useEffect
// Server State: SWR for data fetching
// Form State: React Hook Form
// URL State: Next.js router
```

#### **Styling Architecture**
```css
/* Tailwind CSS Utility-First Approach */
.component {
  @apply flex items-center justify-between p-4 bg-white rounded-lg shadow-md;
}

/* Custom CSS Variables for Theming */
:root {
  --color-primary: #3B82F6;
  --color-secondary: #10B981;
  --color-accent: #F59E0B;
}
```

---

## 📁 **Codebase Walkthrough**

### **Directory Structure Deep Dive**

#### **`src/app/` - Next.js 14 App Router**
```
app/
├── layout.tsx                   # Root layout with providers
├── page.tsx                     # Homepage with hero and features
├── globals.css                  # Global styles and Tailwind imports
├── dashboard/
│   └── page.tsx                 # Parent/Provider dashboard
├── discovery/                   # Educational discovery journeys
│   ├── page.tsx                 # Discovery hub with system cards
│   ├── brain/page.tsx           # Nervous system journey
│   ├── heart/page.tsx           # Cardiovascular system journey
│   ├── lungs/page.tsx           # Respiratory system journey
│   ├── digestive/page.tsx       # Digestive system journey
│   ├── muscles-bones/page.tsx   # Musculoskeletal system journey
│   └── immune/page.tsx          # Immune system journey
├── behavioral/
│   └── page.tsx                 # SKIDS Clinic Chatter assessment
├── care-plans/
│   └── page.tsx                 # Three-tier care plan comparison
├── provider/
│   └── page.tsx                 # Provider dashboard and tools
└── api/                         # API endpoints
    ├── payment/
    │   ├── create-order/route.ts
    │   └── verify/route.ts
    └── health/route.ts
```

#### **`src/components/` - Reusable Components**
```
components/
├── layout/
│   └── Navigation.tsx           # Main navigation with role-based menus
├── discovery/
│   └── WonderPreview.tsx        # Discovery journey preview cards
├── behavioral/
│   └── [Assessment components]  # Behavioral assessment interfaces
├── care-plans/
│   └── [Plan components]        # Care plan comparison and selection
├── provider/
│   ├── CampaignTemplates.tsx    # Email campaign templates
│   └── [Provider tools]         # Provider dashboard components
├── dashboard/
│   ├── HealthMetricsCard.tsx    # Health metrics visualization
│   ├── HealthTrendsChart.tsx    # Chart components for trends
│   ├── RecentTestsCard.tsx      # Recent test results display
│   └── UpcomingAppointments.tsx # Appointment scheduling
├── payment/
│   └── RazorpayCheckout.tsx     # Payment processing interface
├── chat/
│   └── DrSkidsChat.tsx          # AI chat interface
├── milestones/
│   └── DevelopmentalMilestones.tsx # Milestone tracking
└── providers/
    └── AuthProvider.tsx         # Authentication context provider
```

### **Key Component Patterns**

#### **1. Page Components (Server Components)**
```typescript
// app/discovery/page.tsx
import { WonderPreview } from '@/components/discovery/WonderPreview'

export default function DiscoveryPage() {
  const systems = [
    {
      id: 'cardiovascular',
      title: 'Heart & Circulation',
      description: 'Discover how your heart pumps blood...',
      color: 'bg-red-100 text-red-800',
      icon: '❤️'
    },
    // ... more systems
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Discover Your Amazing Body
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systems.map((system) => (
            <WonderPreview key={system.id} system={system} />
          ))}
        </div>
      </div>
    </div>
  )
}
```

#### **2. Interactive Components (Client Components)**
```typescript
// components/discovery/WonderPreview.tsx
'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface WonderPreviewProps {
  system: {
    id: string
    title: string
    description: string
    color: string
    icon: string
  }
}

export function WonderPreview({ system }: WonderPreviewProps) {
  const router = useRouter()

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`p-6 rounded-xl cursor-pointer ${system.color}`}
      onClick={() => router.push(`/discovery/${system.id}`)}
    >
      <div className="text-4xl mb-4">{system.icon}</div>
      <h3 className="text-xl font-semibold mb-2">{system.title}</h3>
      <p className="text-sm opacity-80">{system.description}</p>
    </motion.div>
  )
}
```

#### **3. Context Providers**
```typescript
// components/providers/AuthProvider.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface AuthContextType {
  user: User | null
  role: 'parent' | 'provider' | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  switchRole: (role: 'parent' | 'provider') => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<'parent' | 'provider' | null>(null)

  // Mock authentication for development
  const login = async (email: string, password: string) => {
    // Mock login logic
    setUser({ id: '1', email, name: 'Demo User' })
    setRole('parent')
  }

  const logout = () => {
    setUser(null)
    setRole(null)
  }

  const switchRole = (newRole: 'parent' | 'provider') => {
    setRole(newRole)
  }

  return (
    <AuthContext.Provider value={{ user, role, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

---

## 🛠️ **Development Best Practices**

### **Code Organization Standards**

#### **File Naming Conventions**
```
Components: PascalCase (UserProfile.tsx)
Pages: lowercase (dashboard/page.tsx)
Utilities: camelCase (formatDate.ts)
Constants: UPPER_SNAKE_CASE (API_ENDPOINTS.ts)
Types: PascalCase with .types.ts suffix (User.types.ts)
```

#### **Import Organization**
```typescript
// 1. React and Next.js imports
import React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/navigation'

// 2. Third-party library imports
import { motion } from 'framer-motion'
import { Heart, Brain, Lungs } from 'lucide-react'

// 3. Internal imports (absolute paths)
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

// 4. Type imports (separate from value imports)
import type { User, HealthMetric } from '@/types'
```

#### **Component Structure Template**
```typescript
'use client' // Only if client component

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Types
interface ComponentProps {
  title: string
  data: DataType[]
  onAction?: (id: string) => void
}

// Component
export function ComponentName({ title, data, onAction }: ComponentProps) {
  // State
  const [isLoading, setIsLoading] = useState(false)
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [])
  
  // Handlers
  const handleClick = (id: string) => {
    onAction?.(id)
  }
  
  // Render
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="component-styles"
    >
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {/* Component content */}
    </motion.div>
  )
}
```

### **TypeScript Best Practices**

#### **Type Definitions**
```typescript
// types/index.ts
export interface User {
  id: string
  email: string
  name: string
  role: 'parent' | 'provider'
  createdAt: Date
  updatedAt: Date
}

export interface Child {
  id: string
  parentId: string
  name: string
  dateOfBirth: Date
  gender: 'male' | 'female' | 'other'
  healthMetrics: HealthMetric[]
}

export interface HealthMetric {
  id: string
  childId: string
  type: 'height' | 'weight' | 'temperature' | 'blood_pressure'
  value: number
  unit: string
  recordedAt: Date
}

// Use discriminated unions for complex types
export type AssessmentResult = 
  | { type: 'behavioral'; score: number; recommendations: string[] }
  | { type: 'cognitive'; level: 'below' | 'at' | 'above'; areas: string[] }
  | { type: 'physical'; measurements: Record<string, number> }
```

#### **Custom Hooks Pattern**
```typescript
// hooks/useHealthMetrics.ts
import { useState, useEffect } from 'react'
import type { HealthMetric } from '@/types'

export function useHealthMetrics(childId: string) {
  const [metrics, setMetrics] = useState<HealthMetric[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoading(true)
        // In development, use mock data
        const mockMetrics: HealthMetric[] = [
          // Mock data
        ]
        setMetrics(mockMetrics)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
  }, [childId])

  const addMetric = (metric: Omit<HealthMetric, 'id'>) => {
    const newMetric = { ...metric, id: Date.now().toString() }
    setMetrics(prev => [...prev, newMetric])
  }

  return { metrics, isLoading, error, addMetric }
}
```

### **Styling Guidelines**

#### **Tailwind CSS Best Practices**
```typescript
// Use consistent spacing scale
const spacing = {
  xs: 'p-2',      // 8px
  sm: 'p-4',      // 16px
  md: 'p-6',      // 24px
  lg: 'p-8',      // 32px
  xl: 'p-12',     // 48px
}

// Use semantic color names
const colors = {
  primary: 'bg-blue-600 text-white',
  secondary: 'bg-gray-100 text-gray-900',
  success: 'bg-green-600 text-white',
  warning: 'bg-yellow-500 text-white',
  danger: 'bg-red-600 text-white',
}

// Component with consistent styling
export function Button({ variant = 'primary', size = 'md', children, ...props }) {
  const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2'
  const variantClasses = colors[variant]
  const sizeClasses = spacing[size]
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses} ${sizeClasses}`}
      {...props}
    >
      {children}
    </button>
  )
}
```

#### **Animation Guidelines**
```typescript
// Use consistent animation variants
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Apply animations consistently
<motion.div variants={staggerContainer} initial="initial" animate="animate">
  {items.map((item, index) => (
    <motion.div key={item.id} variants={fadeInUp}>
      {/* Item content */}
    </motion.div>
  ))}
</motion.div>
```

---

## 🧪 **Testing Procedures**

### **Testing Strategy**

#### **Testing Pyramid**
```
E2E Tests (10%)
├── Critical user journeys
├── Payment flows
└── Authentication flows

Integration Tests (20%)
├── Component interactions
├── API endpoint testing
└── Database operations

Unit Tests (70%)
├── Individual components
├── Utility functions
└── Custom hooks
```

#### **Unit Testing with Jest & React Testing Library**
```typescript
// __tests__/components/WonderPreview.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { WonderPreview } from '@/components/discovery/WonderPreview'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

const mockPush = jest.fn()
;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })

const mockSystem = {
  id: 'cardiovascular',
  title: 'Heart & Circulation',
  description: 'Test description',
  color: 'bg-red-100 text-red-800',
  icon: '❤️'
}

describe('WonderPreview', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders system information correctly', () => {
    render(<WonderPreview system={mockSystem} />)
    
    expect(screen.getByText('Heart & Circulation')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
    expect(screen.getByText('❤️')).toBeInTheDocument()
  })

  it('navigates to system page when clicked', () => {
    render(<WonderPreview system={mockSystem} />)
    
    const card = screen.getByRole('button')
    fireEvent.click(card)
    
    expect(mockPush).toHaveBeenCalledWith('/discovery/cardiovascular')
  })
})
```

#### **Integration Testing**
```typescript
// __tests__/pages/discovery.test.tsx
import { render, screen } from '@testing-library/react'
import DiscoveryPage from '@/app/discovery/page'

describe('Discovery Page', () => {
  it('renders all body systems', () => {
    render(<DiscoveryPage />)
    
    expect(screen.getByText('Heart & Circulation')).toBeInTheDocument()
    expect(screen.getByText('Lungs & Breathing')).toBeInTheDocument()
    expect(screen.getByText('Brain & Nerves')).toBeInTheDocument()
    expect(screen.getByText('Digestion & Nutrition')).toBeInTheDocument()
    expect(screen.getByText('Bones & Muscles')).toBeInTheDocument()
    expect(screen.getByText('Immune Defense')).toBeInTheDocument()
  })
})
```

### **Quality Assurance Checklist**

#### **Pre-Commit Checklist**
- [ ] All TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] Prettier formatting applied
- [ ] Unit tests passing
- [ ] Component renders correctly on mobile
- [ ] Accessibility requirements met (WCAG 2.1)
- [ ] Performance impact assessed

#### **Pre-PR Checklist**
- [ ] Feature works end-to-end
- [ ] Integration tests passing
- [ ] Cross-browser compatibility verified
- [ ] Documentation updated
- [ ] Code review self-assessment completed

---

## 🚀 **Deployment Process**

### **Development Workflow**

#### **Local Development**
```bash
# Daily workflow
git checkout development
git pull origin development
git checkout -b feature/your-feature-name

# Make changes
npm run dev  # Start development server
npm run type-check  # Check TypeScript
npm run lint  # Check code quality
npm run test  # Run tests

# Commit changes
git add .
git commit -m "feat: implement feature description"
git push origin feature/your-feature-name
```

#### **Code Review Process**
1. **Create Pull Request** with clear description
2. **Automated Checks** must pass (CI/CD pipeline)
3. **Peer Review** by at least one team member
4. **Testing** in development environment
5. **Approval** and merge to development branch

#### **Deployment Pipeline**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Staging
on:
  push:
    branches: [internal-deployment-v1]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 📚 **Learning Resources**

### **Required Reading**
1. [Next.js 14 Documentation](https://nextjs.org/docs)
2. [React 18 Features](https://react.dev/blog/2022/03/29/react-v18)
3. [TypeScript Handbook](https://www.typescriptlang.org/docs/)
4. [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### **Recommended Tutorials**
1. **Next.js App Router**: Understanding server and client components
2. **Framer Motion**: Animation best practices
3. **React Testing Library**: Component testing strategies
4. **PWA Development**: Service workers and offline functionality

### **Team Resources**
- **Slack Channel**: #skids-development
- **Documentation**: Confluence/Notion workspace
- **Design System**: Figma design files
- **API Documentation**: Swagger/OpenAPI specs

---

**🎓 DEVELOPER TRAINING COMPLETE - READY TO CONTRIBUTE TO SKIDS ADVANCED PLATFORM**
