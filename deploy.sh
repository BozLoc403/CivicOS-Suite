#!/bin/bash

# CivicOS Suite - Deployment Script for Hostinger
# This script prepares your application for deployment

echo "🚀 Starting CivicOS Suite deployment preparation..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from template..."
    if [ -f "env.example" ]; then
        cp env.example .env
        echo "✅ Created .env file from template. Please edit it with your configuration."
    else
        echo "❌ env.example not found. Please create a .env file manually."
        exit 1
    fi
fi

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

# Check if dist directory was created
if [ ! -d "dist" ]; then
    echo "❌ Build output directory 'dist' not found"
    exit 1
fi

# Create deployment package
echo "📦 Creating deployment package..."
DEPLOY_DIR="civicos-deployment-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$DEPLOY_DIR"

# Copy necessary files
cp -r dist "$DEPLOY_DIR/"
cp package.json "$DEPLOY_DIR/"
cp package-lock.json "$DEPLOY_DIR/"
cp .env "$DEPLOY_DIR/"

# Create deployment instructions
cat > "$DEPLOY_DIR/DEPLOYMENT_INSTRUCTIONS.txt" << EOF
CivicOS Suite - Hostinger Deployment Instructions

1. Upload all files in this directory to your Hostinger hosting
2. In Hostinger control panel:
   - Go to "Advanced" → "Node.js"
   - Enable Node.js for your domain
   - Set Node.js version to 18 or higher
   - Set startup file to: dist/index.js
   - Click "Restart" to start your application

3. Set up your database:
   - Create PostgreSQL database in Hostinger control panel
   - Update DATABASE_URL in your .env file
   - Run database migrations in Hostinger terminal:
     npm run db:push

4. Configure your domain:
   - Enable SSL certificate
   - Update BASE_URL in .env to use https://

5. Verify deployment:
   - Visit your domain to ensure the application is running
   - Check logs in Node.js section for any errors

For detailed instructions, see: hostinger-deployment.md
EOF

# Create a zip file for easy upload
echo "📦 Creating deployment archive..."
zip -r "$DEPLOY_DIR.zip" "$DEPLOY_DIR"

echo "✅ Deployment preparation complete!"
echo ""
echo "📁 Files ready for upload:"
echo "   - $DEPLOY_DIR/ (directory)"
echo "   - $DEPLOY_DIR.zip (archive)"
echo ""
echo "📋 Next steps:"
echo "   1. Upload the files to Hostinger"
echo "   2. Follow the instructions in DEPLOYMENT_INSTRUCTIONS.txt"
echo "   3. Configure your environment variables"
echo "   4. Set up your database"
echo ""
echo "📖 For detailed instructions, see: hostinger-deployment.md" 