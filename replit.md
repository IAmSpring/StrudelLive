# Strudel Live Coding Studio

## Overview

This is a full-stack web application for live coding music using the Strudel pattern language. The app provides a complete development environment for creating, editing, and sharing musical patterns with real-time collaboration features and an integrated AI assistant.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend, backend, and data layers:

- **Frontend**: React with TypeScript using Vite for development and builds
- **Backend**: Express.js with TypeScript running on Node.js
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Real-time**: WebSocket connections for live collaboration
- **AI Integration**: OpenAI GPT-4o for intelligent code assistance

## Key Components

### Frontend Architecture
- **React SPA**: Single-page application with wouter for routing
- **UI Framework**: Shadcn/ui components with Radix UI primitives and Tailwind CSS
- **State Management**: TanStack Query for server state, React hooks for local state
- **Code Editor**: Monaco Editor with custom Strudel syntax highlighting
- **Audio Engine**: Web Audio API integration with Strudel core (placeholder implementation)

### Backend Architecture  
- **Express Server**: RESTful API with middleware for logging and error handling
- **WebSocket Server**: Real-time communication for collaborative editing
- **Database Layer**: Drizzle ORM with connection pooling via Neon serverless
- **Storage Service**: Abstracted storage interface for database operations
- **AI Service**: OpenAI integration for code assistance and pattern generation

### Database Schema
- **Users**: Authentication and user management
- **Projects**: Strudel code projects with metadata (BPM, public/private, etc.)
- **Project Snapshots**: Version control for project code with messages
- **Samples**: Audio sample management with categories and metadata
- **Chat Messages**: AI assistant conversation history

## Data Flow

1. **User Interaction**: User interacts with React components (editor, controls, sidebar)
2. **State Updates**: Local state changes trigger UI updates and API calls
3. **API Layer**: Express routes handle CRUD operations and business logic
4. **Database**: Drizzle ORM executes type-safe queries against PostgreSQL
5. **Real-time Sync**: WebSocket broadcasts code changes to connected users
6. **AI Integration**: OpenAI API provides intelligent code suggestions and assistance

## External Dependencies

### Core Libraries
- **React Ecosystem**: React 18, TypeScript, Vite, TanStack Query
- **UI Components**: Radix UI primitives, Tailwind CSS, Lucide icons
- **Backend**: Express, WebSocket (ws), Drizzle ORM
- **Database**: Neon PostgreSQL serverless with connection pooling
- **AI**: OpenAI GPT-4o API for code assistance

### Audio Dependencies
- **Web Audio API**: Browser-native audio processing
- **Strudel Core**: Pattern language implementation (to be integrated)
- **Monaco Editor**: Code editor with syntax highlighting

### Development Tools
- **TypeScript**: Type safety across the entire stack
- **ESBuild**: Fast production builds
- **Drizzle Kit**: Database migrations and schema management
- **PostCSS**: CSS processing with Tailwind

## Deployment Strategy

### Development Environment
- **Replit Integration**: Configured for Replit development environment
- **Hot Reload**: Vite HMR for frontend, tsx watch for backend
- **Database**: Neon PostgreSQL with automatic connection handling
- **WebSocket**: Development-friendly WebSocket setup

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Static Serving**: Express serves frontend assets in production
- **Database**: PostgreSQL connection via environment variables

### Replit Configuration
- **Modules**: Node.js 20, Web, PostgreSQL 16
- **Ports**: Port 5000 mapped to external port 80
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`

## Changelog

Changelog:
- June 21, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.