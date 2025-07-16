# CreateFi - DeFi Trading Platform

## Overview

CreateFi is a comprehensive decentralized finance (DeFi) trading platform built with React, TypeScript, and Express.js. The application provides a modern interface for cryptocurrency trading, including token swapping, limit orders, portfolio management, and integration with the 1inch API for optimal trade execution.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Radix UI components with shadcn/ui design system
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and build processes

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Integration**: 1inch API for token data, quotes, and swap transactions
- **Session Management**: Connect-pg-simple for PostgreSQL session storage

### Database Schema
The application uses four main tables:
- `users`: User wallet addresses and metadata
- `swap_transactions`: Historical swap transaction records
- `limit_orders`: Active and historical limit orders
- `portfolio_snapshots`: Portfolio value snapshots over time

## Key Components

### Trading Interface
- **Swap Interface**: Token-to-token swapping with real-time quotes
- **Token Selector**: Modal-based token selection with search functionality
- **Order Book**: Limit order management and tracking
- **Portfolio Overview**: Real-time portfolio value and token balances

### Wallet Integration
- **Wallet Connect**: MetaMask integration for wallet connection
- **Network Selector**: Multi-chain support (Ethereum, Polygon, BSC, Arbitrum, Optimism, Avalanche)
- **Transaction Management**: Transaction signing and status tracking

### Data Management
- **Real-time Quotes**: 10-second refresh intervals for price data
- **Market Data**: Token prices and 24-hour change tracking
- **Gas Tracker**: Real-time gas price monitoring
- **Transaction History**: Complete transaction audit trail

### UI/UX Features
- **Theme System**: Light/dark mode with persistent preferences
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts
- **Loading States**: Skeleton loaders and loading indicators
- **Error Handling**: Toast notifications for user feedback

## Data Flow

### Trading Flow
1. User connects wallet and selects network
2. User selects source and destination tokens
3. Application fetches real-time quote from 1inch API
4. User reviews and confirms swap transaction
5. Transaction is signed and submitted to blockchain
6. Transaction status is tracked and stored in database

### Portfolio Management
1. Application fetches token balances from blockchain
2. Portfolio snapshots are created and stored
3. Real-time portfolio value is calculated
4. Historical data is used for trend analysis

### Order Management
1. Limit orders are created with target prices
2. Orders are monitored for execution conditions
3. Status updates are tracked in database
4. Users can cancel or modify active orders

## External Dependencies

### Core Libraries
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: Type-safe database queries and migrations
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **axios**: HTTP client for API requests
- **wouter**: Lightweight client-side routing

### UI Libraries
- **@radix-ui/react-***: Comprehensive UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Type-safe component variants

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type checking and development experience
- **drizzle-kit**: Database migration management
- **eslint**: Code linting and formatting

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Neon Database with environment-based connection strings
- **API Integration**: Direct proxy to 1inch API endpoints

### Production Build
- **Frontend**: Static build output served from `/dist/public`
- **Backend**: Bundled Express server with ESM format
- **Database**: Production PostgreSQL with connection pooling
- **Environment**: Environment variables for API keys and database connections

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string
- `INCH_API_KEY`: 1inch API authentication key
- `NODE_ENV`: Environment mode (development/production)

The application is designed to be deployed on platforms like Replit, Heroku, or similar Node.js hosting services with PostgreSQL database support.