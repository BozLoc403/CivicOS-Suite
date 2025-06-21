# CivicOS Launch Checklist

## Pre-Launch Verification Steps

Run these commands in your terminal to verify everything is ready:

### 1. Check Node.js Version
```bash
node --version
```
Should show v18+ or v20+

### 2. Check if all dependencies are installed
```bash
npm list --depth=0
```
Should show all packages without errors

### 3. Install dependencies if needed
```bash
npm install
```

### 4. Check environment variables
```bash
echo $DATABASE_URL
echo $STRIPE_SECRET_KEY
echo $VITE_STRIPE_PUBLIC_KEY
```
All should return values (not empty)

### 5. Test database connection
```bash
npm run db:push
```
Should complete without errors

### 6. Build the application
```bash
npm run build
```
Should complete successfully

### 7. Start the application
```bash
npm run dev
```
Should start both frontend and backend servers

### 8. Verify functionality
- Open browser to localhost:5000
- Check if login works
- Test the floating chat button (desktop)
- Test donation system
- Verify dashboard loads with data

## Production Deployment Checklist

### Environment Variables Required:
- ✅ DATABASE_URL (PostgreSQL connection)
- ✅ STRIPE_SECRET_KEY (Stripe payments)
- ✅ VITE_STRIPE_PUBLIC_KEY (Stripe frontend)
- ✅ SESSION_SECRET (automatically provided by Replit)

### Key Features to Test:
- ✅ User authentication and sessions
- ✅ Dashboard with political data
- ✅ Floating chat button with donation prompts
- ✅ Stripe payment processing
- ✅ Mobile responsive design
- ✅ Real-time data updates

### Performance Checks:
- ✅ Page load times under 3 seconds
- ✅ Database queries optimized
- ✅ Error handling in place
- ✅ HTTPS ready for production

## Troubleshooting Common Issues

### If `npm install` fails:
```bash
rm -rf node_modules package-lock.json
npm install
```

### If database connection fails:
```bash
# Check if DATABASE_URL is set correctly
echo $DATABASE_URL
# Push schema changes
npm run db:push
```

### If build fails:
```bash
# Clear cache and rebuild
rm -rf dist
npm run build
```

## Launch Command
Once all checks pass:
```bash
npm run dev
```

Your CivicOS platform should be running on http://localhost:5000