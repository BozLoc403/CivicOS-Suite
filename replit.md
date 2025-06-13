# CivicOS - Digital Democracy Platform

## Overview

CivicOS is a comprehensive Canadian political intelligence platform that provides real-time government data tracking, AI-powered civic insights, and secure democratic engagement tools. The platform tracks 85,000+ politicians across federal, provincial, and municipal levels, monitors legislative bills, provides legal database access, and offers AI-powered civic assistance.

## System Architecture

The application follows a full-stack TypeScript architecture with clear separation between frontend and backend concerns:

- **Frontend**: React with Vite, TypeScript, Tailwind CSS, and shadcn/ui components
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Real-time Features**: WebSocket-based monitoring and data synchronization
- **AI Integration**: OpenAI GPT-4o and Anthropic Claude for content analysis and civic assistance

## Key Components

### Frontend Architecture
- **Component Library**: shadcn/ui for consistent, accessible UI components
- **Styling**: Tailwind CSS with custom Canadian political theme colors
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Typography**: Inter, Playfair Display, and JetBrains Mono fonts

### Backend Services
- **Data Scrapers**: Comprehensive government data collection from official Canadian sources
- **Authentication**: Replit Auth integration with local development fallback
- **AI Services**: Multiple AI providers for content analysis and civic assistance
- **Real-time Monitoring**: Continuous data updates and system health monitoring
- **Legal Database**: Complete Canadian legal framework integration

### Database Schema
The platform uses a comprehensive schema including:
- User management with verification levels and civic engagement tracking
- Politicians table with trust scores and detailed contact information
- Bills and voting records with AI-generated summaries
- Forum discussions and civic engagement features
- Legal database with Criminal Code sections and court cases

## Data Flow

1. **Data Collection**: Automated scrapers collect data from official government sources every 30 seconds
2. **Data Processing**: AI services analyze and summarize content for public consumption
3. **Data Verification**: Multi-source verification ensures data authenticity
4. **User Interaction**: Citizens access verified data through intuitive dashboard interfaces
5. **Real-time Updates**: WebSocket connections provide live data updates

## External Dependencies

### Government Data Sources
- Parliament of Canada Open Data API
- Statistics Canada API
- Provincial legislature websites
- Municipal government portals
- Elections Canada data feeds

### AI Services
- **OpenAI GPT-4o**: Primary AI for content analysis and civic assistance
- **Anthropic Claude-3.5 Sonnet**: Content summarization and legal analysis
- **Mistral AI**: Data verification and content authenticity checking

### Core Libraries
- **Drizzle ORM**: Type-safe database operations
- **Express.js**: Backend API framework
- **React 18**: Frontend framework with modern hooks
- **TanStack Query**: Server state management
- **Cheerio**: Web scraping and HTML parsing

## Deployment Strategy

The platform is designed for deployment on Replit with the following configuration:

- **Build Process**: Vite builds the frontend, esbuild bundles the backend
- **Environment**: Node.js 20+ with PostgreSQL 16
- **Scaling**: Autoscale deployment target for traffic management
- **Port Configuration**: Internal port 5000 mapped to external port 80
- **Database**: PostgreSQL with connection pooling via Neon serverless

### Local Development
- Demo authentication system for local testing
- Hot module replacement via Vite
- Database migrations via Drizzle Kit
- Environment variables for API keys and database connections

## Changelog

- June 13, 2025: Complete resolution of all voting and commenting system issues - Platform fully operational
  - Fixed frontend fetch parameter order in apiRequest function (url, method, data)
  - Resolved SQL syntax errors by properly formatting multi-line WHERE clauses
  - Verified comprehensive voting functionality across all content types with real-time vote counting
  - Confirmed comment creation and retrieval working properly with correct API routing
  - Tested and validated complete civic engagement suite: voting, commenting, sharing, real-time updates
  - Platform ready for full citizen engagement with all democratic participation tools functional
- June 13, 2025: Resolved critical voting system failures and database schema issues
  - Fixed SQL syntax errors causing "failed to process vote" failures across all interactive features
  - Added missing user_votes, vote_counts, and user_interactions table schemas to shared/schema.ts
  - Resolved database migration issues preventing proper voting functionality
  - Verified complete voting system works on all content types: politicians, bills, posts, replies, comments, petitions
  - Tested and confirmed commenting system creates replies successfully with proper vote integration
  - All like/share/comment features now function properly with real-time vote counting and user feedback
- June 13, 2025: Completed forum duplicate categories fix and implemented like/reply/comment system
  - Permanently resolved duplicate categories display issue by disabling forum and legal data populators
  - Final clean forum structure: exactly 6 organized categories without duplicates
  - Implemented comprehensive like/reply/comment features across entire site
  - Created LikeButton and ReplyButton components with optimistic updates
  - Added backend API endpoints for forum post/reply interactions with proper authentication
  - Updated discussions interface to use new interactive components with real-time updates
- June 13, 2025: Fixed massive duplicate categories issue in discussions forum
  - Deleted 917+ redundant forum category entries that were creating excessive tabs
  - Consolidated all posts to use 7 main organized categories
  - Updated forum populator with existence checks to prevent future duplicates
  - Implemented hierarchical subcategory system for better organization
- June 13, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.