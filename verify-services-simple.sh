#!/bin/bash

# SKIDS Advanced - Simple Service Verification Script
# This script verifies all production services are properly configured

echo "🔍 SKIDS Advanced - Service Verification"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for checks
PASSED=0
FAILED=0
WARNINGS=0

echo "1️⃣  Checking Turso Database"
echo "----------------------------"
if command -v turso &> /dev/null; then
    echo -e "${GREEN}✓ Turso CLI installed${NC}"
    PASSED=$((PASSED + 1))
    
    if turso db show skidsadvanced-satishskid &> /dev/null; then
        echo -e "${GREEN}✓ Database accessible${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗ Cannot access database${NC}"
        echo "  Run: turso auth login"
        FAILED=$((FAILED + 1))
    fi
else
    echo -e "${YELLOW}⚠ Turso CLI not installed${NC}"
    echo "  Install: curl -sSfL https://get.tur.so/install.sh | bash"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

echo "2️⃣  Checking Environment File"
echo "------------------------------"
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓ .env.local exists${NC}"
    PASSED=$((PASSED + 1))
    
    # Check for required variables
    if grep -q "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" .env.local; then
        echo -e "${GREEN}✓ Clerk keys configured${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗ Clerk keys missing${NC}"
        FAILED=$((FAILED + 1))
    fi
    
    if grep -q "NEXT_PUBLIC_FIREBASE_PROJECT_ID" .env.local; then
        echo -e "${GREEN}✓ Firebase configured${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗ Firebase configuration missing${NC}"
        FAILED=$((FAILED + 1))
    fi
    
    if grep -q "CLOUDFLARE_R2_ENDPOINT" .env.local; then
        echo -e "${GREEN}✓ R2 configured${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗ R2 configuration missing${NC}"
        FAILED=$((FAILED + 1))
    fi
else
    echo -e "${RED}✗ .env.local not found${NC}"
    FAILED=$((FAILED + 1))
fi
echo ""

echo "3️⃣  Checking Build Files"
echo "-------------------------"
if [ -f "package.json" ]; then
    echo -e "${GREEN}✓ package.json exists${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗ package.json missing${NC}"
    FAILED=$((FAILED + 1))
fi

if [ -f "next.config.js" ]; then
    echo -e "${GREEN}✓ next.config.js exists${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗ next.config.js missing${NC}"
    FAILED=$((FAILED + 1))
fi

if [ -f "wrangler.toml" ]; then
    echo -e "${GREEN}✓ wrangler.toml exists${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}⚠ wrangler.toml missing${NC}"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

echo "4️⃣  Checking Node.js Environment"
echo "---------------------------------"
NODE_VERSION=$(node --version)
echo "  Node version: $NODE_VERSION"

if [[ "$NODE_VERSION" =~ ^v(18|20|21|22) ]]; then
    echo -e "${GREEN}✓ Node version compatible${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}⚠ Node version may not be compatible (recommend 18+)${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "  npm version: $NPM_VERSION"
    echo -e "${GREEN}✓ npm installed${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗ npm not found${NC}"
    FAILED=$((FAILED + 1))
fi
echo ""

echo "5️⃣  Checking Dependencies"
echo "--------------------------"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ node_modules exists${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}⚠ node_modules missing (run: npm install)${NC}"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

echo "========================================"
echo "📊 Verification Summary"
echo "========================================"
echo -e "${GREEN}✓ Passed: $PASSED${NC}"
echo -e "${YELLOW}⚠ Warnings: $WARNINGS${NC}"
echo -e "${RED}✗ Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ Ready for deployment!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Review STEP_BY_STEP_DEPLOYMENT.md"
    echo "2. Run: npm run build (to test build locally)"
    echo "3. Set environment variables in Cloudflare Pages"
    echo "4. Deploy: git push origin main"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Please fix the failed checks before deploying${NC}"
    echo ""
    echo "See STEP_BY_STEP_DEPLOYMENT.md for detailed instructions."
    echo ""
    exit 1
fi
