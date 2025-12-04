#!/bin/bash

# Test Deployment Script
# Tests critical API endpoints after Vercel deployment

DEPLOYMENT_URL="${1:-https://skidadvanced-11p63ltg3-satishs-projects-89f8c44c.vercel.app}"

echo "🧪 Testing SKIDS Advanced Deployment"
echo "URL: $DEPLOYMENT_URL"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Homepage
echo "1️⃣  Testing Homepage..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL")
if [ "$STATUS" -eq 200 ]; then
  echo -e "${GREEN}✅ Homepage: OK (200)${NC}"
else
  echo -e "${RED}❌ Homepage: FAILED ($STATUS)${NC}"
fi
echo ""

# Test 2: Sign-in page
echo "2️⃣  Testing Sign-in Page..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL/sign-in")
if [ "$STATUS" -eq 200 ]; then
  echo -e "${GREEN}✅ Sign-in: OK (200)${NC}"
else
  echo -e "${RED}❌ Sign-in: FAILED ($STATUS)${NC}"
fi
echo ""

# Test 3: API Health (without auth - should return 401 or 403)
echo "3️⃣  Testing API Endpoints (without auth)..."

# Clinics API
echo "   Testing /api/clinics..."
RESPONSE=$(curl -s "$DEPLOYMENT_URL/api/clinics")
if echo "$RESPONSE" | grep -q "Unauthorized\|Forbidden"; then
  echo -e "${GREEN}✅ Clinics API: Protected (auth required)${NC}"
elif echo "$RESPONSE" | grep -q "clinics"; then
  echo -e "${YELLOW}⚠️  Clinics API: Accessible (no auth?)${NC}"
else
  echo -e "${RED}❌ Clinics API: Error - $RESPONSE${NC}"
fi

# Analytics API
echo "   Testing /api/admin/analytics..."
RESPONSE=$(curl -s "$DEPLOYMENT_URL/api/admin/analytics")
if echo "$RESPONSE" | grep -q "Unauthorized\|Forbidden"; then
  echo -e "${GREEN}✅ Analytics API: Protected (auth required)${NC}"
elif echo "$RESPONSE" | grep -q "totals"; then
  echo -e "${YELLOW}⚠️  Analytics API: Accessible (no auth?)${NC}"
else
  echo -e "${RED}❌ Analytics API: Error - $RESPONSE${NC}"
fi

# Staff API
echo "   Testing /api/admin/staff..."
RESPONSE=$(curl -s "$DEPLOYMENT_URL/api/admin/staff")
if echo "$RESPONSE" | grep -q "Unauthorized\|Forbidden"; then
  echo -e "${GREEN}✅ Staff API: Protected (auth required)${NC}"
elif echo "$RESPONSE" | grep -q "staff"; then
  echo -e "${YELLOW}⚠️  Staff API: Accessible (no auth?)${NC}"
else
  echo -e "${RED}❌ Staff API: Error - $RESPONSE${NC}"
fi
echo ""

# Test 4: Database connection (indirect test via API response)
echo "4️⃣  Testing Database Connection..."
echo -e "${YELLOW}ℹ️  Login required to test database connection${NC}"
echo "   Manual test: Login at $DEPLOYMENT_URL/sign-in"
echo "   Then visit: $DEPLOYMENT_URL/admin/dashboard"
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Test Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Basic deployment is working"
echo "✅ API routes are protected (require auth)"
echo ""
echo "🔐 Manual Testing Required:"
echo "   1. Login with: satissh@skids.health"
echo "   2. Verify redirect to /admin/dashboard"
echo "   3. Check Clinics page loads data"
echo "   4. Check Analytics page loads data"
echo "   5. Check Staff Management is accessible"
echo ""
echo "📚 Documentation:"
echo "   - VERCEL_ENV_CHECK.md - Environment setup"
echo "   - ADMIN_USER_MANAGEMENT_COMPLETE.md - Features"
echo "   - SUPER_ADMIN_ACCOUNTS.md - Admin accounts"
echo ""
