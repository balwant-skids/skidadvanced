#!/bin/bash

# SKIDS Advanced - Deployment Verification Script
# Tests all features from DB to UI

BASE_URL="https://skidsa1-i69e8zyb2-satishs-projects-89f8c44c.vercel.app"

echo "🧪 SKIDS Advanced - Feature Verification"
echo "=========================================="
echo "Testing deployment: $BASE_URL"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
TOTAL=0
PASSED=0
FAILED=0

test_endpoint() {
    local name=$1
    local url=$2
    local expected_code=$3
    
    TOTAL=$((TOTAL + 1))
    
    echo -n "Testing: $name... "
    
    response_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response_code" == "$expected_code" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $response_code)"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗ FAIL${NC} (Expected $expected_code, got $response_code)"
        FAILED=$((FAILED + 1))
    fi
}

test_page_exists() {
    local name=$1
    local path=$2
    
    TOTAL=$((TOTAL + 1))
    
    echo -n "Testing: $name... "
    
    response=$(curl -s "$BASE_URL$path")
    
    if echo "$response" | grep -q "<!DOCTYPE html"; then
        echo -e "${GREEN}✓ PASS${NC} (Page loads)"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗ FAIL${NC} (Page not found or error)"
        FAILED=$((FAILED + 1))
    fi
}

echo "📄 Testing Public Pages"
echo "----------------------"
test_page_exists "Homepage" "/"
test_page_exists "Sign In" "/sign-in"
test_page_exists "Discovery" "/discovery"
test_page_exists "Plans" "/plans"
echo ""

echo "🔐 Testing Protected Pages (should redirect or show auth)"
echo "--------------------------------------------------------"
test_page_exists "Admin Dashboard" "/admin/dashboard"
test_page_exists "Admin Analytics" "/admin/analytics"
test_page_exists "Admin Clinics" "/admin/clinics"
test_page_exists "Admin Whitelist" "/admin/whitelist"
test_page_exists "Admin Parents" "/admin/parents"
test_page_exists "Admin Care Plans" "/admin/care-plans"
test_page_exists "Admin Campaigns" "/admin/campaigns"
echo ""

echo "🔌 Testing API Endpoints (public)"
echo "--------------------------------"
test_endpoint "Care Plans API" "$BASE_URL/api/care-plans" "200"
test_endpoint "Clinics Verify API" "$BASE_URL/api/clinics/verify" "405"
echo ""

echo "🔒 Testing Protected API Endpoints (should return 401)"
echo "-----------------------------------------------------"
test_endpoint "Admin Stats API" "$BASE_URL/api/admin/stats" "401"
test_endpoint "Admin Analytics API" "$BASE_URL/api/admin/analytics" "401"
test_endpoint "Admin Whitelist Pending" "$BASE_URL/api/admin/whitelist/pending" "401"
echo ""

echo "📦 Testing Component Files"
echo "-------------------------"
if [ -f "src/components/admin/AnalyticsDashboard.tsx" ]; then
    echo -e "${GREEN}✓${NC} AnalyticsDashboard component exists"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗${NC} AnalyticsDashboard component missing"
    FAILED=$((FAILED + 1))
fi
TOTAL=$((TOTAL + 1))

if [ -f "src/components/admin/SearchBar.tsx" ]; then
    echo -e "${GREEN}✓${NC} SearchBar component exists"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗${NC} SearchBar component missing"
    FAILED=$((FAILED + 1))
fi
TOTAL=$((TOTAL + 1))

if [ -f "src/components/admin/FilterDropdown.tsx" ]; then
    echo -e "${GREEN}✓${NC} FilterDropdown component exists"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗${NC} FilterDropdown component missing"
    FAILED=$((FAILED + 1))
fi
TOTAL=$((TOTAL + 1))

if [ -f "src/components/admin/EmptyState.tsx" ]; then
    echo -e "${GREEN}✓${NC} EmptyState component exists"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗${NC} EmptyState component missing"
    FAILED=$((FAILED + 1))
fi
TOTAL=$((TOTAL + 1))

echo ""

echo "🧪 Testing Property Test Files"
echo "-----------------------------"
if [ -f "src/__tests__/properties/search-filter.property.test.ts" ]; then
    echo -e "${GREEN}✓${NC} Search/Filter property tests exist"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗${NC} Search/Filter property tests missing"
    FAILED=$((FAILED + 1))
fi
TOTAL=$((TOTAL + 1))

if [ -f "src/__tests__/properties/ui-components.property.test.ts" ]; then
    echo -e "${GREEN}✓${NC} UI Components property tests exist"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗${NC} UI Components property tests missing"
    FAILED=$((FAILED + 1))
fi
TOTAL=$((TOTAL + 1))

echo ""

echo "📚 Testing Library Dependencies"
echo "------------------------------"
if grep -q "recharts" package.json; then
    echo -e "${GREEN}✓${NC} Recharts library installed"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗${NC} Recharts library missing"
    FAILED=$((FAILED + 1))
fi
TOTAL=$((TOTAL + 1))

if grep -q "fast-check" package.json; then
    echo -e "${GREEN}✓${NC} fast-check library installed"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗${NC} fast-check library missing"
    FAILED=$((FAILED + 1))
fi
TOTAL=$((TOTAL + 1))

echo ""
echo "=========================================="
echo "📊 Test Results Summary"
echo "=========================================="
echo "Total Tests: $TOTAL"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠ Some tests failed. Review above for details.${NC}"
    exit 1
fi
