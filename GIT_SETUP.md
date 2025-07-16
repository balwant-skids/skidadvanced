# SKIDS Advanced - Git Repository Setup Instructions

## 📋 **Repository Access & Setup**

### **Repository Information**
- **Project Name**: SKIDS Advanced - Child Health Platform
- **Current Branch**: `internal-deployment-v1`
- **Repository Type**: Local development repository (ready for remote setup)
- **Primary Language**: TypeScript/Next.js

### **Initial Repository Setup**

#### **1. Clone/Access Repository**
```bash
# If setting up from existing local repository
cd /path/to/skids-advanced

# Verify current branch
git branch
# Should show: * internal-deployment-v1

# If starting fresh, initialize repository
git init
git add .
git commit -m "Initial commit: SKIDS Advanced platform"
git checkout -b internal-deployment-v1
```

#### **2. Remote Repository Setup** (When ready)
```bash
# Add remote origin (replace with actual repository URL)
git remote add origin https://github.com/your-org/skids-advanced.git

# Push internal deployment branch
git push -u origin internal-deployment-v1

# Set up main branch
git checkout -b main
git push -u origin main

# Return to development branch
git checkout internal-deployment-v1
```

---

## 🌳 **BRANCH MANAGEMENT STRATEGY**

### **Branch Structure**
```
main
├── internal-deployment-v1 (current)
├── development
├── feature/parent-dashboard-enhancement
├── feature/database-integration
├── feature/clerk-authentication
├── feature/razorpay-payments
└── production
```

### **Branch Purposes**
- **`main`**: Stable production-ready code
- **`internal-deployment-v1`**: Current internal testing deployment
- **`development`**: Active development integration branch
- **`feature/*`**: Individual feature development branches
- **`production`**: Live production deployment branch

### **Branch Workflow**
```bash
# Create new feature branch
git checkout development
git pull origin development
git checkout -b feature/your-feature-name

# Work on feature
git add .
git commit -m "feat: implement feature description"

# Push feature branch
git push -u origin feature/your-feature-name

# Create pull request to development
# After review and approval, merge to development

# For releases, merge development to main
git checkout main
git merge development
git push origin main
```

---

## 📁 **REPOSITORY STRUCTURE OVERVIEW**

```
skids-advanced/
├── .env.example                 # Environment variables template
├── .env.local                   # Local environment (git ignored)
├── .gitignore                   # Git ignore rules
├── next.config.js               # Next.js configuration
├── package.json                 # Dependencies and scripts
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── vercel.json                  # Vercel deployment configuration
├── public/                      # Static assets
│   ├── manifest.json            # PWA manifest
│   ├── sw.js                    # Service worker
│   └── icons/                   # PWA icons and images
├── src/                         # Source code
│   ├── app/                     # Next.js 14 app directory
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Homepage
│   │   ├── dashboard/           # Parent/Provider dashboard
│   │   ├── discovery/           # Discovery journeys
│   │   ├── behavioral/          # Behavioral assessments
│   │   ├── care-plans/          # Care plans system
│   │   ├── provider/            # Provider dashboard
│   │   ├── sign-in/             # Authentication pages
│   │   ├── sign-up/             # Authentication pages
│   │   └── api/                 # API routes
│   ├── components/              # Reusable components
│   │   ├── layout/              # Layout components
│   │   ├── discovery/           # Discovery journey components
│   │   ├── behavioral/          # Assessment components
│   │   ├── care-plans/          # Care plan components
│   │   ├── provider/            # Provider components
│   │   ├── providers/           # Context providers
│   │   └── ui/                  # UI components
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility libraries
│   └── styles/                  # Global styles
├── docs/                        # Documentation
│   ├── ARCHITECTURE.md          # Architecture overview
│   ├── DATABASE_SCHEMA.sql      # Database schema
│   ├── IMPLEMENTATION_TIMELINE.md # Development timeline
│   ├── PRODUCTION_SETUP.md      # Production setup guide
│   └── TESTING_GUIDELINES.md    # Testing procedures
└── deployment/                  # Deployment configurations
    ├── DEPLOYMENT_SUMMARY.md    # Deployment overview
    ├── DEPLOYMENT_CHECKLIST.md  # Deployment checklist
    └── INTERNAL_DEPLOYMENT_STATUS.md # Current status
```

---

## 🔧 **GIT CONFIGURATION**

### **Required Git Configuration**
```bash
# Set user information
git config user.name "Your Name"
git config user.email "your.email@company.com"

# Set default branch name
git config init.defaultBranch main

# Enable helpful settings
git config pull.rebase false
git config core.autocrlf input  # For cross-platform compatibility
git config core.editor "code --wait"  # Use VS Code as editor
```

### **Recommended Git Aliases**
```bash
# Add useful aliases
git config alias.st status
git config alias.co checkout
git config alias.br branch
git config alias.ci commit
git config alias.unstage 'reset HEAD --'
git config alias.last 'log -1 HEAD'
git config alias.visual '!gitk'
git config alias.tree 'log --graph --pretty=format:"%h %s" --abbrev-commit'
```

---

## 🔐 **ACCESS PERMISSIONS & SECURITY**

### **Repository Access Levels**
- **Admin**: Full repository access, can manage settings and permissions
- **Maintainer**: Can merge pull requests, manage releases
- **Developer**: Can create branches, submit pull requests
- **Reviewer**: Can review and approve pull requests

### **Branch Protection Rules** (When setting up remote)
```yaml
# Recommended branch protection for main and development
Protected Branches:
  - main:
      - Require pull request reviews (2 reviewers)
      - Require status checks to pass
      - Require branches to be up to date
      - Restrict pushes to admins only
  - development:
      - Require pull request reviews (1 reviewer)
      - Require status checks to pass
      - Allow force pushes by admins
```

### **Commit Message Standards**
```bash
# Use conventional commit format
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks

# Examples:
git commit -m "feat: implement parent dashboard PWA features"
git commit -m "fix: resolve mobile navigation issue"
git commit -m "docs: update API documentation"
```

---

## 📦 **DEPENDENCY MANAGEMENT**

### **Package Manager**
- **Primary**: npm (package-lock.json committed)
- **Alternative**: yarn (if team prefers)
- **Node Version**: 18+ required

### **Dependency Categories**
```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "typescript": "5.x",
    "tailwindcss": "3.x",
    "framer-motion": "10.x",
    "@clerk/nextjs": "4.x",
    "razorpay": "2.x"
  },
  "devDependencies": {
    "@types/node": "20.x",
    "@types/react": "18.x",
    "eslint": "8.x",
    "prettier": "3.x"
  }
}
```

---

## 🚀 **DEVELOPMENT WORKFLOW**

### **Daily Development Process**
```bash
# 1. Start of day - sync with latest changes
git checkout development
git pull origin development

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Make changes and commit regularly
git add .
git commit -m "feat: implement specific functionality"

# 4. Push feature branch
git push -u origin feature/your-feature-name

# 5. Create pull request when ready
# Use GitHub/GitLab interface to create PR

# 6. After approval, merge and cleanup
git checkout development
git pull origin development
git branch -d feature/your-feature-name
```

### **Code Review Process**
1. **Self Review**: Review your own changes before creating PR
2. **Automated Checks**: Ensure all CI/CD checks pass
3. **Peer Review**: At least one team member reviews code
4. **Testing**: Verify changes work in development environment
5. **Merge**: Squash and merge to keep clean history

---

## 🔍 **TROUBLESHOOTING**

### **Common Git Issues**

#### **Issue**: Merge conflicts
```bash
# Solution: Resolve conflicts manually
git status  # See conflicted files
# Edit files to resolve conflicts
git add .
git commit -m "resolve: merge conflicts"
```

#### **Issue**: Accidentally committed to wrong branch
```bash
# Solution: Move commits to correct branch
git log --oneline -n 5  # Find commit hash
git checkout correct-branch
git cherry-pick <commit-hash>
git checkout wrong-branch
git reset --hard HEAD~1  # Remove commit from wrong branch
```

#### **Issue**: Need to undo last commit
```bash
# Solution: Reset last commit (keep changes)
git reset --soft HEAD~1

# Or reset and discard changes
git reset --hard HEAD~1
```

### **Repository Health Checks**
```bash
# Check repository status
git status
git log --oneline -10
git branch -a

# Verify remote connections
git remote -v

# Check for uncommitted changes
git diff
git diff --staged
```

---

## 📞 **SUPPORT & RESOURCES**

### **Git Resources**
- **Git Documentation**: https://git-scm.com/doc
- **GitHub Guides**: https://guides.github.com/
- **Conventional Commits**: https://conventionalcommits.org/

### **Team Contacts**
- **Repository Admin**: [Contact for access and permissions]
- **Technical Lead**: [Contact for branching strategy and workflow]
- **DevOps Lead**: [Contact for CI/CD and deployment issues]

---

**🔧 GIT REPOSITORY SETUP COMPLETE - READY FOR DEVELOPMENT TEAM ACCESS**
