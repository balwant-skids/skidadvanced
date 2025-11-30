#!/bin/bash

# Bundle Size Verification Script
# Validates that bundle size meets performance targets

set -e

echo "🔍 Bundle Size Verification"
echo "============================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Targets
TARGET_INITIAL_JS=200  # KB
TARGET_INITIAL_CSS=50   # KB
TARGET_TOTAL=250        # KB

# Build the application
echo "📦 Building application..."
npm run build

# Check if build succeeded
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful${NC}"
echo ""

# Analyze bundle sizes
echo "📊 Analyzing bundle sizes..."
echo ""

# Get initial JS bundle size
INITIAL_JS=$(find .next/static/chunks -name "*.js" -type f -exec du -k {} + | awk '{sum+=$1} END {print sum}')

# Get initial CSS bundle size  
INITIAL_CSS=$(find .next/static/css -name "*.css" -type f -exec du -k {} + 2>/dev/null | awk '{sum+=$1} END {print sum}')
if [ -z "$INITIAL_CSS" ]; then
    INITIAL_CSS=0
fi

# Calculate total
TOTAL=$((INITIAL_JS + INITIAL_CSS))

# Display results
echo "Results:"
echo "--------"
echo "Initial JS:  ${INITIAL_JS} KB (target: ${TARGET_INITIAL_JS} KB)"
echo "Initial CSS: ${INITIAL_CSS} KB (target: ${TARGET_INITIAL_CSS} KB)"
echo "Total:       ${TOTAL} KB (target: ${TARGET_TOTAL} KB)"
echo ""

# Check against targets
PASS=true

if [ $INITIAL_JS -gt $TARGET_INITIAL_JS ]; then
    echo -e "${RED}❌ Initial JS exceeds target by $((INITIAL_JS - TARGET_INITIAL_JS)) KB${NC}"
    PASS=false
else
    echo -e "${GREEN}✅ Initial JS within target${NC}"
fi

if [ $INITIAL_CSS -gt $TARGET_INITIAL_CSS ]; then
    echo -e "${YELLOW}⚠️  Initial CSS exceeds target by $((INITIAL_CSS - TARGET_INITIAL_CSS)) KB${NC}"
else
    echo -e "${GREEN}✅ Initial CSS within target${NC}"
fi

if [ $TOTAL -gt $TARGET_TOTAL ]; then
    echo -e "${RED}❌ Total bundle exceeds target by $((TOTAL - TARGET_TOTAL)) KB${NC}"
    PASS=false
else
    echo -e "${GREEN}✅ Total bundle within target${NC}"
fi

echo ""

# Check for code splitting
echo "🔀 Verifying code splitting..."
CHUNK_COUNT=$(find .next/static/chunks -name "*.js" -type f | wc -l)
echo "Found ${CHUNK_COUNT} JavaScript chunks"

if [ $CHUNK_COUNT -lt 10 ]; then
    echo -e "${YELLOW}⚠️  Low chunk count - code splitting may not be working${NC}"
else
    echo -e "${GREEN}✅ Code splitting appears to be working${NC}"
fi

echo ""

# Summary
if [ "$PASS" = true ]; then
    echo -e "${GREEN}✅ Bundle size verification PASSED${NC}"
    exit 0
else
    echo -e "${RED}❌ Bundle size verification FAILED${NC}"
    echo ""
    echo "Recommendations:"
    echo "1. Run 'npm run analyze' to identify large dependencies"
    echo "2. Ensure code splitting is configured correctly"
    echo "3. Check for duplicate dependencies"
    echo "4. Consider lazy loading heavy components"
    exit 1
fi
