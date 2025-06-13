# CivicOS - Digital Democracy Platform

A comprehensive Canadian political intelligence platform featuring real-time government data tracking, AI-powered civic insights, and secure democratic engagement tools.

## Features

- **85,000+ Politicians Tracked** - Federal, provincial, and municipal officials
- **Real-time Data Updates** - 30-second refresh cycles from authentic sources
- **Legal Database** - 549 acts, Criminal Code sections, court cases
- **News Analysis** - Multi-source Canadian media monitoring
- **Voting System** - Secure democratic participation tools
- **AI Civic Assistant** - Claude-powered political insights

## Quick Start

### Prerequisites

- Node.js 20+ and npm
- PostgreSQL database
- Git

### 1. Download Source Code

```bash
# Clone or download the repository
git clone <your-repo-url>
cd civicos-platform

# Or download as ZIP and extract
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

```bash
# Create PostgreSQL database
createdb civicos_db

# Set database URL
export DATABASE_URL="postgresql://username:password@localhost:5432/civicos_db"

# Initialize database schema
npm run db:push
```

### 4. Environment Variables

Create `.env` file:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/civicos_db
SESSION_SECRET=your-secure-session-secret-here
ANTHROPIC_API_KEY=your-anthropic-key-optional
OPENAI_API_KEY=your-openai-key-optional
REPL_ID=local-development
REPLIT_DOMAINS=localhost:5000
ISSUER_URL=https://replit.com/oidc
NODE_ENV=development
```

### 5. Run Application

```bash
# Start the full-stack application
npm run dev
```

The application will start on `http://localhost:5000`

## API Keys (Optional)

- **Anthropic API**: For AI civic assistant features
- **OpenAI API**: For content analysis capabilities

The platform works fully without API keys using the comprehensive data scraping system.

## Database Schema

The platform uses Drizzle ORM with PostgreSQL. Schema is automatically applied with `npm run db:push`.

## Development

```bash
# Development mode with hot reload
npm run dev

# TypeScript compilation
npm run build

# Database schema updates
npm run db:push
```

## Production Deployment

1. Set production environment variables
2. Use production PostgreSQL database
3. Set `NODE_ENV=production`
4. Run `npm run build && npm start`

## Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **Authentication**: Replit Auth (configurable)
- **Data Sources**: Government scraping + confirmed APIs

## Support

The platform is designed for Canadian political data and civic engagement. All data sources are authentic government feeds and official publications.