#!/bin/bash

echo "╔════════════════════════════════════════════════╗"
echo "║     DATABASE DIAGNOSTIC TOOL                   ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check .env files
echo "📁 LOCAL ENVIRONMENT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check for env files
if [ -f .env.local ]; then
    ENV_FILE=".env.local"
elif [ -f prisma/.env ]; then
    ENV_FILE="prisma/.env"
elif [ -f .env ]; then
    ENV_FILE=".env"
else
    echo -e "${RED}❌ No environment file found${NC}"
    echo "   Create .env.local with DATABASE_URL"
    exit 1
fi

echo "Found: $ENV_FILE"

DB_URL=$(grep DATABASE_URL "$ENV_FILE" | cut -d '=' -f2 | tr -d '"')

if [ -n "$DB_URL" ]; then
    # Mask password
    MASKED_URL=$(echo $DB_URL | sed 's/:[^:@]*@/:****@/')
    echo -e "${GREEN}✅ DATABASE_URL found${NC}"
    echo "   $MASKED_URL"
    
    # Extract info
    if [[ $DB_URL == *"neon.tech"* ]]; then
        echo -e "   Provider: ${GREEN}Neon${NC}"
    elif [[ $DB_URL == *"vercel-storage.com"* ]]; then
        echo -e "   Provider: ${GREEN}Vercel Postgres${NC}"
    else
        echo -e "   Provider: ${YELLOW}Unknown${NC}"
    fi
    
    # Extract database name
    DB_NAME=$(echo $DB_URL | sed 's/.*\/\([^?]*\).*/\1/')
    echo "   Database: $DB_NAME"
    
    # Extract host
    HOST=$(echo $DB_URL | sed 's/.*@\([^\/]*\)\/.*/\1/')
    echo "   Host: $HOST"
else
    echo -e "${RED}❌ DATABASE_URL not found${NC}"
    exit 1
fi
echo ""

# Test connection
echo "🔌 CONNECTION TEST"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Try with Prisma
if npx prisma db execute --url="$DB_URL" --stdin <<< "SELECT 1" &> /dev/null; then
    echo -e "${GREEN}✅ Connection successful${NC}"
    
    # Get database info
    DB_INFO=$(npx prisma db execute --url="$DB_URL" --stdin <<< "SELECT current_database() as db, current_user as user" 2>/dev/null | grep -v "Prisma")
    echo "$DB_INFO"
else
    echo -e "${RED}❌ Connection failed${NC}"
    echo "   Check your credentials and network connection"
    echo "   Try: npx prisma studio"
fi
echo ""

# Vercel info
echo "☁️  VERCEL PRODUCTION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "To check Vercel database:"
echo "1. Visit: https://vercel.com/dashboard"
echo "2. Project → Settings → Environment Variables"
echo "3. Find DATABASE_URL in Production environment"
echo ""

# GitHub Secrets
echo "🔐 GITHUB SECRETS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "To check GitHub Secrets:"
echo "1. Visit: https://github.com/cubingkeralaorg/cubingkerala/settings/secrets/actions"
echo "2. Look for DATABASE_URL and POSTGRES_URL_TEST"
echo ""

# Prisma
echo "🔧 PRISMA"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Schema location: prisma/schema.prisma"
if [ -f prisma/schema.prisma ]; then
    SCHEMA_DB=$(grep "url.*env" prisma/schema.prisma | sed 's/.*env("\([^"]*\)").*/\1/')
    echo "Using environment variable: $SCHEMA_DB"
else
    echo "Schema file not found"
fi
echo ""
echo "To view data: npx prisma studio"
echo ""

# Quick commands
echo "📋 QUICK COMMANDS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "View data:        npx prisma studio"
echo "Show this help:   ./scripts/check-database.sh"
echo ""
SCRIPT_END
