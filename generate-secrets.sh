#!/bin/bash

# 🔐 Secret Generator for Buro Staal Dashboard
# Generates random secrets for .env configuration

echo "🔐 Generating secrets for .env configuration..."
echo ""
echo "Copy these values to your .env file:"
echo ""
echo "# ============================================"
echo "# GENERATED SECRETS - $(date)"
echo "# ============================================"
echo ""

# Check if openssl is available
if command -v openssl &> /dev/null; then
    echo "COOKIE_SECRET=$(openssl rand -base64 32)"
    echo "JWT_SECRET=$(openssl rand -base64 32)"
    echo ""
    echo "# Optional additional secrets:"
    echo "# ADMIN_SECRET=$(openssl rand -base64 32)"
elif command -v node &> /dev/null; then
    echo "COOKIE_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")"
    echo "JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")"
    echo ""
    echo "# Optional additional secrets:"
    echo "# ADMIN_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")"
else
    echo "❌ Error: Neither openssl nor node.js found!"
    echo "Please install one of them to generate secrets."
    echo ""
    echo "Alternatives:"
    echo "1. Install openssl: brew install openssl (Mac) or apt-get install openssl (Linux)"
    echo "2. Use online generator: https://www.random.org/strings/"
    echo "3. Use Node.js: node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\""
    exit 1
fi

echo ""
echo "✅ Secrets generated successfully!"
echo ""
echo "Next steps:"
echo "1. Copy the COOKIE_SECRET and JWT_SECRET values above"
echo "2. Paste them into your .env file"
echo "3. Follow AUTH0_QUICKSTART.md for Auth0 setup"
echo "4. Run: npm run dev"
echo ""
