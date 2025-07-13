# 📂 Repository Structure

## 🎯 Project Overview
**SkillAgent MVP** - An AI-powered learning platform that provides personalized skill development resources, roadmap generation, and interactive AI chat assistance.

## 🏗️ Technology Stack
- **Frontend**: React 19.1.0 + Vite 7.0.3
- **UI Framework**: Material-UI (MUI) 7.2.0
- **Routing**: React Router DOM 6.30.1
- **AI Integration**: OpenAI, Google Generative AI, LangChain
- **Backend**: Express.js 5.1.0
- **Authentication**: GitHub OAuth
- **Styling**: Emotion (CSS-in-JS)
- **Development**: ESLint, Vite

## 📁 Directory Structure

```
skillagent-mvp/
├── 📄 Configuration Files
│   ├── package.json                 # Project dependencies and scripts
│   ├── package-lock.json            # Locked dependency versions
│   ├── vite.config.js               # Vite build configuration
│   ├── eslint.config.js             # ESLint configuration
│   ├── .gitignore                   # Git ignore patterns
│   └── index.html                   # Main HTML entry point
│
├── 🔧 Development & Build
│   ├── node_modules/                # Installed dependencies
│   ├── public/                      # Static assets
│   │   └── vite.svg                 # Vite logo
│   └── last_run.log                 # Application logs
│
├── 🐍 Python Components
│   └── student_agent.py             # LangChain agent for student assistance
│
├── 🔐 Authentication
│   ├── github-oauth-proxy.cjs       # GitHub OAuth proxy (CommonJS)
│   └── github-oauth-proxy.js        # GitHub OAuth proxy (ES6)
│
└── 📦 Source Code (src/)
    ├── 🎨 Styling
    │   ├── App.css                  # Main application styles
    │   └── index.css                # Global styles and CSS variables
    │
    ├── 🖼️ Assets
    │   └── react.svg                # React logo
    │
    ├── 🧩 Components
    │   ├── AIChat.jsx               # AI chat interface component
    │   ├── GitHubCallback.jsx       # GitHub OAuth callback handler
    │   ├── GitHubLogin.jsx          # GitHub login component
    │   └── ResourceDashboard.jsx    # Resource management dashboard
    │
    ├── 📄 Pages
    │   ├── Dashboard.jsx            # Main dashboard page
    │   ├── Onboarding.jsx           # User onboarding flow
    │   └── Profile.jsx              # User profile page
    │
    ├── 🛠️ Utilities
    │   ├── aiAgent.js               # AI agent implementation
    │   ├── openaiAgent.js           # OpenAI integration
    │   ├── resourceScraper.js       # Web scraping for learning resources
    │   └── roadmapGenerator.js      # Learning roadmap generation
    │
    ├── App.jsx                      # Main application component
    └── main.jsx                     # Application entry point
```

## 🚀 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (http://localhost:5173) |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint for code quality |
| `npm run preview` | Preview production build locally |

## 🔧 Key Dependencies

### Frontend Dependencies
- **React 19.1.0** - UI library
- **React Router DOM 6.30.1** - Client-side routing
- **Material-UI 7.2.0** - Component library
- **Emotion** - CSS-in-JS styling

### AI & Backend Dependencies
- **OpenAI 4.104.0** - OpenAI API integration
- **Google Generative AI 0.24.1** - Google AI services
- **LangChain 0.3.29** - AI framework
- **Express 5.1.0** - Backend server
- **Axios 1.10.0** - HTTP client

### Development Dependencies
- **Vite 7.0.3** - Build tool and dev server
- **ESLint 9.30.1** - Code linting
- **TypeScript types** - Type definitions

## 🎯 Core Features

### 1. **AI-Powered Learning Assistant**
- Interactive chat interface (`AIChat.jsx`)
- Personalized learning recommendations
- Real-time AI responses

### 2. **Resource Management**
- Learning resource dashboard (`ResourceDashboard.jsx`)
- Web scraping for educational content (`resourceScraper.js`)
- Resource categorization and filtering

### 3. **Personalized Roadmaps**
- Dynamic roadmap generation (`roadmapGenerator.js`)
- Skill-based learning paths
- Progress tracking

### 4. **Authentication System**
- GitHub OAuth integration
- User profile management
- Secure authentication flow

### 5. **User Experience**
- Modern Material-UI interface
- Responsive design
- Intuitive navigation

## 🔄 Data Flow

```
User Input → React Components → Utility Functions → AI Services → Response
     ↓
GitHub OAuth → User Authentication → Profile Management
     ↓
Resource Scraping → Content Processing → Dashboard Display
     ↓
Roadmap Generation → AI Analysis → Personalized Learning Paths
```

## 🛡️ Security Features

- GitHub OAuth for secure authentication
- Environment variable management for API keys
- CORS configuration for API requests
- Input validation and sanitization

## 📱 Responsive Design

- Mobile-first approach
- Material-UI responsive components
- Flexible layout system
- Touch-friendly interface

## 🔍 Development Guidelines

1. **Component Structure**: Use functional components with hooks
2. **Styling**: Prefer Material-UI components over custom CSS
3. **State Management**: Use React hooks for local state
4. **API Integration**: Centralize API calls in utility functions
5. **Error Handling**: Implement proper error boundaries and user feedback

## 🚀 Deployment

The project is configured for:
- **Development**: Vite dev server with hot reload
- **Production**: Optimized build with Vite
- **Static Hosting**: Can be deployed to Vercel, Netlify, or similar platforms

## 📝 Notes

- The project includes both JavaScript and Python components
- AI services require valid API keys (OpenAI, Google AI)
- GitHub OAuth requires proper OAuth app configuration
- Development server runs on port 5173 by default 