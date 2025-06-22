# CivicOS Suite - Hostinger Deployment Guide

## Prerequisites

1. **Hostinger Account**: You'll need a Hostinger hosting plan that supports Node.js
2. **Domain**: A domain name for your application
3. **Database**: PostgreSQL database (Hostinger provides this)
4. **Environment Variables**: All required API keys and configuration

## Step 1: Prepare Your Application

### 1.1 Build the Application Locally
```bash
# Install dependencies
npm install

# Build the application
npm run build
```

### 1.2 Create Production Build
The build process will create:
- `dist/` directory with the compiled server
- `dist/public/` directory with the built client files

## Step 2: Set Up Database

### 2.1 Create PostgreSQL Database on Hostinger
1. Log into your Hostinger control panel
2. Go to "Databases" → "PostgreSQL"
3. Create a new PostgreSQL database
4. Note down the database credentials:
   - Database name
   - Username
   - Password
   - Host
   - Port

### 2.2 Update Environment Variables
Create a `.env` file with your database credentials:
```env
DATABASE_URL=postgresql://username:password@host:port/database_name
```

## Step 3: Configure Environment Variables

Create a `.env` file in your project root with all required variables:

```env
# Database Configuration
DATABASE_URL=postgresql://your-username:your-password@your-host:5432/your-database

# Authentication
SESSION_SECRET=your-super-secure-session-secret
REPL_ID=your-replit-id
REPLIT_DOMAINS=your-domain.com
ISSUER_URL=https://replit.com/oidc

# API Keys
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
HUGGINGFACE_API_KEY=your-huggingface-api-key

# Payment Processing
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# Application Configuration
NODE_ENV=production
PORT=5000
BASE_URL=https://your-domain.com

# Email Configuration
SENDGRID_API_KEY=your-sendgrid-api-key
```

## Step 4: Upload to Hostinger

### 4.1 Using File Manager
1. Log into Hostinger control panel
2. Go to "File Manager"
3. Navigate to your domain's public_html directory
4. Upload the following files and folders:
   - `dist/` (entire folder)
   - `package.json`
   - `package-lock.json`
   - `.env` (your environment file)

### 4.2 Using FTP/SFTP
1. Use an FTP client (FileZilla, WinSCP, etc.)
2. Connect to your Hostinger FTP server
3. Upload the files mentioned above

## Step 5: Configure Node.js on Hostinger

### 5.1 Enable Node.js
1. In Hostinger control panel, go to "Advanced" → "Node.js"
2. Enable Node.js for your domain
3. Set the Node.js version to 18 or higher
4. Set the startup file to: `dist/index.js`

### 5.2 Install Dependencies
1. In the Node.js section, click "Terminal"
2. Navigate to your project directory
3. Run: `npm install --production`

## Step 6: Database Migration

### 6.1 Run Database Migrations
In the Hostinger terminal:
```bash
# Generate migrations (if needed)
npm run db:generate

# Push schema to database
npm run db:push
```

## Step 7: Start the Application

### 7.1 Start the Server
In the Hostinger Node.js section:
1. Set the startup file to: `dist/index.js`
2. Click "Restart" to start your application

### 7.2 Verify Deployment
1. Visit your domain to ensure the application is running
2. Check the logs in the Node.js section for any errors

## Step 8: Domain Configuration

### 8.1 SSL Certificate
1. In Hostinger control panel, go to "SSL"
2. Enable SSL for your domain
3. Update your `BASE_URL` in `.env` to use `https://`

### 8.2 DNS Configuration
1. Ensure your domain points to your Hostinger hosting
2. Set up any subdomains if needed

## Troubleshooting

### Common Issues

1. **Port Issues**: Hostinger typically uses port 5000 for Node.js apps
2. **Database Connection**: Ensure your database credentials are correct
3. **Environment Variables**: Make sure all required variables are set
4. **Build Errors**: Check that all dependencies are installed

### Logs
- Check application logs in the Node.js section
- Check error logs in the File Manager

### Performance Optimization
1. Enable caching in your application
2. Use CDN for static assets
3. Optimize database queries
4. Enable compression

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **Database Security**: Use strong passwords and limit database access
3. **API Keys**: Keep all API keys secure and rotate them regularly
4. **HTTPS**: Always use HTTPS in production
5. **Session Security**: Use strong session secrets

## Maintenance

### Regular Tasks
1. Update dependencies regularly
2. Monitor application logs
3. Backup database regularly
4. Check for security updates

### Updates
1. Upload new build files
2. Restart the Node.js application
3. Run database migrations if needed
4. Test the application thoroughly

## Support

If you encounter issues:
1. Check Hostinger's Node.js documentation
2. Review application logs
3. Contact Hostinger support for hosting-specific issues
4. Check the application's error handling and logging 