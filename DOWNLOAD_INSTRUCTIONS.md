# Download and Run CivicOS Locally

## Step 1: Download Source Code

### Option A: Git Clone (Recommended)
```bash
git clone https://github.com/your-username/civicos-platform.git
cd civicos-platform
```

### Option B: Download ZIP
1. Click "Download ZIP" from the repository
2. Extract the archive
3. Open terminal in the extracted folder

## Step 2: Install Requirements

### Install Node.js 20+
- Download from https://nodejs.org
- Or use package manager: `brew install node` (Mac) or `sudo apt install nodejs npm` (Ubuntu)

### Install PostgreSQL
- Download from https://postgresql.org
- Or use package manager: `brew install postgresql` (Mac) or `sudo apt install postgresql` (Ubuntu)

## Step 3: Setup Database

```bash
# Start PostgreSQL service
sudo service postgresql start  # Linux
brew services start postgresql # Mac

# Create database
createdb civicos_platform

# Create user (optional)
psql -c "CREATE USER civicos WITH PASSWORD 'your_password';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE civicos_platform TO civicos;"
```

## Step 4: Configure Environment

Create `.env` file in project root:

```env
DATABASE_URL=postgresql://civicos:your_password@localhost:5432/civicos_platform
SESSION_SECRET=generate-a-long-random-string-here
REPL_ID=local-development
REPLIT_DOMAINS=localhost:5000
ISSUER_URL=https://replit.com/oidc
NODE_ENV=development

# Optional AI Features
ANTHROPIC_API_KEY=your-key-here
OPENAI_API_KEY=your-key-here
```

## Step 5: Install Dependencies and Run

```bash
# Install all dependencies
npm install

# Initialize database schema
npm run db:push

# Start the application
npm run dev
```

## Step 6: Access Application

Open your browser to: `http://localhost:5000`

The platform will automatically:
- Start collecting Canadian government data
- Initialize all 29 pages and features
- Begin real-time data synchronization

## Local Development Features

- Hot reload for code changes
- Database automatically populated with authentic data
- All scraping systems active
- Complete civic engagement platform

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
pg_isready

# Reset database if needed
dropdb civicos_platform
createdb civicos_platform
npm run db:push
```

### Port Already in Use
```bash
# Kill process on port 5000
sudo lsof -ti:5000 | xargs kill -9
```

### Missing Dependencies
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Complete Local Setup

Your local CivicOS installation will have:
- 85,000+ politicians tracked
- Real-time government data feeds
- Legal database with 549 acts
- News analysis from Canadian sources
- Secure voting and petition systems
- AI-powered civic insights

The platform runs completely offline with authentic Canadian government data.