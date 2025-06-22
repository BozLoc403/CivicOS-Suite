# CivicOS Suite

A comprehensive civic engagement platform for Canadian democracy, featuring real-time government data, AI-powered analysis, and interactive citizen tools.

## Features

- **Real-time Government Data**: Live feeds from Canadian government APIs
- **AI-Powered Analysis**: News analysis, propaganda detection, and civic intelligence
- **Interactive Tools**: Voting widgets, petitions, and representative finder
- **Identity Verification**: Multi-factor authentication with Canadian government integration
- **Comprehensive News**: Aggregated news from multiple Canadian sources
- **Legal System Integration**: Access to Canadian legal databases and updates
- **Political Calendar**: Track political events and elections
- **Donation System**: Secure payment processing with Stripe

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with Canadian government integration
- **AI Services**: OpenAI, Anthropic Claude, Hugging Face
- **Payment Processing**: Stripe
- **Real-time**: WebSocket connections
- **Deployment**: Hostinger-ready configuration

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Required API keys (see Environment Variables section)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CivicOsSuite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database_name

# Authentication
SESSION_SECRET=your-session-secret-here
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

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations

## Deployment

### Hostinger Deployment

This application is configured for easy deployment on Hostinger. See the [Hostinger Deployment Guide](hostinger-deployment.md) for detailed instructions.

### Quick Deployment Steps

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Upload to Hostinger**
   - Upload `dist/`, `package.json`, `package-lock.json`, and `.env` files
   - Configure Node.js in Hostinger control panel
   - Set startup file to `dist/index.js`

3. **Set up database**
   - Create PostgreSQL database on Hostinger
   - Run `npm run db:push` in Hostinger terminal

4. **Start the application**
   - Restart Node.js application in Hostinger control panel

## Project Structure

```
CivicOsSuite/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Utility functions
│   └── index.html
├── server/                # Backend Express.js application
│   ├── routes/           # API routes
│   ├── storage/          # File storage utilities
│   └── utils/            # Server utilities
├── shared/               # Shared TypeScript schemas
├── dist/                 # Production build output
└── attached_assets/      # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/status` - Authentication status

### Civic Data
- `GET /api/civic/news` - Latest news
- `GET /api/civic/politicians` - Politician data
- `GET /api/civic/bills` - Legislative bills
- `GET /api/civic/elections` - Election data

### AI Services
- `POST /api/ai/analyze` - News analysis
- `POST /api/ai/chat` - Civic AI chat
- `GET /api/ai/trends` - Trend analysis

### User Features
- `POST /api/donations` - Process donations
- `GET /api/user/profile` - User profile
- `POST /api/user/verification` - Identity verification

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Security

- All API keys are stored as environment variables
- HTTPS is enforced in production
- Input validation and sanitization
- Rate limiting on API endpoints
- Secure session management

## Support

For deployment issues, see the [Hostinger Deployment Guide](hostinger-deployment.md).

For technical support, please check the logs and ensure all environment variables are properly configured.

## License

MIT License - see LICENSE file for details.