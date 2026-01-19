# Devnzo Website

> A modern, full-featured website built with React, TypeScript, and Vite

## 📊 Project Flow Diagram

```mermaid
graph TD
    A[User Visits devnzo.com] --> B{Route Handler}
    
    B --> C[Public Pages]
    B --> D[Admin Pages]
    B --> E[Resource Pages]
    
    C --> C1[Home Page]
    C --> C2[Products Page]
    C --> C3[About Page]
    C --> C4[Contact Page]
    C --> C5[Support Page]
    C --> C6[Partners Page]
    C --> C7[FAQ Page]
    C --> C8[Help Center]
    C --> C9[Free Tools]
    C --> C10[Privacy Policy]
    C --> C11[Terms of Service]
    
    D --> D1[Admin Dashboard]
    D --> D2[Content Manager]
    D --> D3[Analytics]
    D --> D4[User Management]
    D --> D5[Settings]
    
    E --> E1[Blog Posts]
    E --> E2[Documentation]
    E --> E3[Resources Library]
    
    C4 --> F[Contact Form]
    F --> G[Netlify Functions]
    G --> H[Email Service]
    
    D1 --> I[Firebase Auth]
    I --> J{Authenticated?}
    J -->|Yes| K[Admin Features]
    J -->|No| L[Login Page]
    
    style A fill:#4F46E5,stroke:#312E81,color:#fff
    style B fill:#7C3AED,stroke:#5B21B6,color:#fff
    style I fill:#EF4444,stroke:#B91C1C,color:#fff
    style G fill:#10B981,stroke:#047857,color:#fff
```

## 🏗️ Architecture Overview

```mermaid
graph LR
    A[React App] --> B[React Router]
    B --> C[Pages]
    C --> D[Components]
    D --> E[UI Components]
    D --> F[Feature Components]
    
    A --> G[State Management]
    G --> H[React Query]
    G --> I[Context API]
    
    A --> J[Services]
    J --> K[Firebase]
    J --> L[Netlify Functions]
    
    A --> M[Styling]
    M --> N[Tailwind CSS]
    M --> O[shadcn/ui]
    
    style A fill:#4F46E5,stroke:#312E81,color:#fff
    style K fill:#EF4444,stroke:#B91C1C,color:#fff
    style L fill:#10B981,stroke:#047857,color:#fff
    style N fill:#06B6D4,stroke:#0891B2,color:#fff
```

## 🔄 User Journey Flow

```mermaid
sequenceDiagram
    participant U as User
    participant W as Website
    participant R as Router
    participant C as Components
    participant API as Backend/API
    participant DB as Firebase
    
    U->>W: Visit devnzo.com
    W->>R: Load Application
    R->>C: Render Home Page
    C->>U: Display Content
    
    U->>W: Navigate to Products
    W->>R: Route Change
    R->>C: Render Products Page
    C->>U: Show Products
    
    U->>W: Submit Contact Form
    W->>API: POST /contact
    API->>U: Email Sent Confirmation
    
    U->>W: Access Admin Panel
    W->>DB: Check Authentication
    DB-->>W: Auth Status
    alt Authenticated
        W->>C: Render Admin Dashboard
        C->>U: Show Admin Features
    else Not Authenticated
        W->>C: Render Login Page
        C->>U: Request Login
    end
```

## 📁 Project Structure

```
devnzo-website/
├── src/
│   ├── components/          # Reusable UI components (73 components)
│   │   ├── ui/             # shadcn/ui components
│   │   └── features/       # Feature-specific components
│   ├── pages/              # Page components (29 pages)
│   │   ├── admin/          # Admin panel pages (11 pages)
│   │   ├── blog/           # Blog pages
│   │   ├── docs/           # Documentation pages
│   │   └── resources/      # Resource pages
│   ├── contexts/           # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Helper functions
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── netlify/
│   └── functions/          # Serverless functions
├── public/                 # Static assets
└── package.json            # Dependencies and scripts
```

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI library
- **TypeScript 5.8** - Type safety
- **Vite 5.4** - Build tool and dev server
- **React Router 6.30** - Client-side routing
- **Tailwind CSS 3.4** - Utility-first CSS
- **shadcn/ui** - Component library built on Radix UI

### State Management
- **TanStack Query 5.83** - Server state management
- **React Context API** - Global state

### Rich Text Editor
- **TipTap 3.14** - WYSIWYG editor
  - Image extension
  - Link extension
  - Starter kit

### Backend Services
- **Firebase 12.7** - Authentication & Database
- **Netlify Functions** - Serverless API endpoints

### UI Components & Libraries
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Recharts** - Data visualization
- **date-fns** - Date utilities

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/MuziDev495/devnzo-website.git

# Navigate to project directory
cd devnzo-website

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build for development
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🌐 Deployment

This project is configured for deployment on **Netlify**.

### Deploy Steps:
1. Push your code to GitHub
2. Connect your repository to Netlify
3. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Deploy!

### Environment Variables
Make sure to set up the following environment variables in your Netlify dashboard:
- Firebase configuration
- API keys
- Other sensitive credentials

## 📝 Features

### Public Features
- ✅ Responsive homepage with modern design
- ✅ Product showcase pages
- ✅ About and company information
- ✅ Contact form with email integration
- ✅ Support and help center
- ✅ FAQ section
- ✅ Blog and resources
- ✅ Privacy policy and terms of service

### Admin Features
- ✅ Secure authentication with Firebase
- ✅ Content management system
- ✅ Analytics dashboard
- ✅ User management
- ✅ Settings and configuration

### Technical Features
- ✅ Server-side rendering ready
- ✅ SEO optimized
- ✅ Mobile-first responsive design
- ✅ Dark mode support (next-themes)
- ✅ Form validation with Zod
- ✅ Toast notifications (Sonner)
- ✅ Accessible components (Radix UI)
- ✅ Type-safe development (TypeScript)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

## 📞 Contact

For questions or support, visit [devnzo.com](https://devnzo.com) or use the contact form on the website.

---

**Built with ❤️ by the Devnzo Team**
