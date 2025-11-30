#!/bin/bash

# SKIDS Advanced - Service Verification Script
# This script verifies all production services are properly configured

set -e

echo "🔍 SKIDS Advanced - Service Verification"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Load environment variables
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

# Function to check service
check_service() {
    local service_name=$1
    local check_command=$2
    
    echo -n "Checking $service_name... "
    if eval "$check_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ OK${NC}"
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        return 1
    fi
}

# Counter for failed checks
FAILED=0

echo "1️⃣  Verifying Turso Database"
echo "----------------------------"
if command -v turso &> /dev/null; then
    if turso db show skidsadvanced-satishskid &> /dev/null; then
        echo -e "${GREEN}✓ Turso database accessible${NC}"
        
        # Test query
        if turso db shell skidsadvanced-satishskid "SELECT 1;" &> /dev/null; then
            echo -e "${GREEN}✓ Database queries working${NC}"
        else
            echo -e "${RED}✗ Database queries failed${NC}"
            FAILED=$((FAILED + 1))
        fi
    else
        echo -e "${RED}✗ Cannot access database${NC}"
        FAILED=$((FAILED + 1))
    fi
else
    echo -e "${YELLOW}⚠ Turso CLI not installed${NC}"
    echo "  Install: curl -sSfL https://get.tur.so/install.sh | bash"
fi
echo ""

echo "2️⃣  Verifying Clerk Authentication"
echo "-----------------------------------"
if [ -n "$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" ] && [ -n "$CLERK_SECRET_KEY" ]; then
    echo -e "${GREEN}✓ Clerk keys configured${NC}"
    echo "  Publishable Key: ${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:0:20}..."
    echo "  Secret Key: ${CLERK_SECRET_KEY:0:20}..."
else
    echo -e "${RED}✗ Clerk keys missing${NC}"
    FAILED=$((FAILED + 1))
fi
echo ""

echo "3️⃣  Verifying Firebase Configuration"
echo "-------------------------------------"
if [ -n "$NEXT_PUBLIC_FIREBASE_PROJECT_ID" ] && [ -n "$FIREBASE_SERVICE_ACCOUNT_KEY" ]; then
    echo -e "${GREEN}✓ Firebase configured${NC}"
    echo "  Project ID: $NEXT_PUBLIC_FIREBASE_PROJECT_ID"
    
    # Validate service account JSON
    if echo "$FIREBASE_SERVICE_ACCOUNT_KEY" | jq . &> /dev/null; then
        echo -e "${GREEN}✓ Service account JSON valid${NC}"
    else
        echo -e "${RED}✗ Service account JSON invalid${NC}"
        FAILED=$((FAILED + 1))
    fi
else
    echo -e "${RED}✗ Firebase configuration missing${NC}"
    FAILED=$((FAILED + 1))
fi
echo ""

echo "4️⃣  Verifying Cloudflare R2 Storage"
echo "------------------------------------"
if [ -n "$CLOUDFLARE_R2_ENDPOINT" ] && [ -n "$CLOUDFLARE_R2_ACCESS_KEY_ID" ]; then
    echo -e "${GREEN}✓ R2 credentials configured${NC}"
    echo "  Endpoint: $CLOUDFLARE_R2_ENDPOINT"
    echo "  Bucket: $CLOUDFLARE_R2_BUCKET"
    
    # Test R2 access if AWS CLI is available
    if command -v aws &> /dev/null; then
        if aws s3 ls s3://$CLOUDFLARE_R2_BUCKET --endpoint-url $CLOUDFLARE_R2_ENDPOINT &> /dev/null; then
            echo -e "${GREEN}✓ R2 bucket accessible${NC}"
        else
            echo -e "${YELLOW}⚠ Cannot verify R2 access (check credentials)${NC}"
        fi
    else
        echo -e "${YELLOW}⚠ AWS CLI not installed (cannot test R2 access)${NC}"
        echo "  Install: brew install awscli"
    fi
else
    echo -e "${RED}✗ R2 configuration missing${NC}"
    FAILED=$((FAILED + 1))
fi
echo ""

echo "5️⃣  Verifying Build Configuration"
echo "----------------------------------"
if [ -f "package.json" ]; then
    echo -e "${GREEN}✓ package.json exists${NC}"
    
    if [ -f "next.config.js" ]; then
        echo -e "${GREEN}✓ next.config.js exists${NC}"
    else
        echo -e "${RED}✗ next.config.js missing${NC}"
        FAILED=$((FAILED + 1))
    fi
    
    if [ -f "wrangler.toml" ]; then
        echo -e "${GREEN}✓ wrangler.toml exists${NC}"
    else
        echo -e "${YELLOW}⚠ wrangler.toml missing${NC}"
    fi
else
    echo -e "${RED}✗ package.json missing${NC}"
    FAILED=$((FAILED + 1))
fi
echo ""

echo "6️⃣  Verifying Node.js Environment"
echo "----------------------------------"
NODE_VERSION=$(node --version)
echo "  Node version: $NODE_VERSION"

if [[ "$NODE_VERSION" =~ ^v(18|20|21) ]]; then
    echo -e "${GREEN}✓ Node version compatible${NC}"
else
    echo -e "${YELLOW}⚠ Node version may not be compatible (recommend 18+)${NC}"
fi

NPM_VERSION=$(npm --version)
echo "  npm version: $NPM_VERSION"
echo ""

echo "========================================"
echo "📊 Verification Summary"
echo "========================================"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    echo ""
    echo "You are ready to deploy to production."
    echo ""
    echo "Next steps:"
    echo "1. Review STEP_BY_STEP_DEPLOYMENT.md"
    echo "2. Set environment variables in Cloudflare Pages"
    echo "3. Deploy: git push origin main"
    exit 0
else
    echo -e "${RED}❌ $FAILED check(s) failed${NC}"
    echo ""
    echo "Please fix the issues above before deploying."
    echo "See STEP_BY_STEP_DEPLOYMENT.md for detailed instructions."
    exit 1
fi
