# 📁 Project Structure - PNDW JOGJA MIS

## 🏗️ Architecture Overview

Project ini telah direstrukturisasi untuk memisahkan **Frontend** dan **Backend** components dengan lebih jelas:

```
pndwjogja-mis/
├── 🎨 frontend/          # Frontend (UI/Client)
├── ⚙️ backend/           # Backend (Server/Database)
├── 📝 package.json       # Root dependencies
├── 📄 README.md          # Project documentation
└── 🔧 Configuration files
```

---

## 🎨 Frontend Structure

**Location:** `./frontend/`

**Contains:** Semua yang berkaitan dengan User Interface dan Client-side

```
frontend/
├── app/                  # Next.js App Router
│   ├── (dashboard)/      # Dashboard routes group
│   │   ├── page.tsx      # Dashboard homepage
│   │   ├── analytics/    # Analytics page
│   │   ├── ai-recommendations/ # AI features
│   │   ├── complaints/   # Complaint management
│   │   ├── user-management/ # User admin
│   │   ├── it-support/   # IT support tools
│   │   └── settings/     # System settings
│   ├── login/            # Login page
│   ├── unauthorized/     # Access denied page
│   └── layout.tsx        # Root layout
├── components/           # Reusable React components
│   ├── ui/              # Base UI components (shadcn/ui)
│   ├── shared/          # Shared components (Header, Sidebar)
│   ├── dashboard/       # Dashboard-specific components
│   └── premium/         # Premium UI components
├── public/              # Static assets
├── middleware.ts        # Next.js middleware (auth)
├── next.config.ts       # Next.js configuration
├── tailwind.config.ts   # Tailwind CSS config
└── tsconfig.json        # TypeScript config
```

**Technologies:**
- Next.js 15 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Framer Motion (animations)

---

## ⚙️ Backend Structure  

**Location:** `./backend/`

**Contains:** Server utilities, database scripts, dan API configurations

```
backend/
├── lib/                 # Backend utilities
│   ├── auth/           # Authentication logic
│   ├── supabase/       # Database clients
│   │   ├── admin.ts    # Admin client
│   │   ├── client.ts   # Client-side client
│   │   └── server.ts   # Server-side client
│   ├── ai/             # AI integrations (Gemini)
│   ├── types/          # TypeScript type definitions
│   └── utils.ts        # Utility functions
├── scripts/            # Database and utility scripts
│   ├── check-admin.ts  # Admin verification
│   ├── debug-users.ts  # User debugging
│   ├── generate-dummy-data.ts # Test data
│   └── list-users.ts   # User listing
├── supabase/           # Database configuration
│   └── config.toml     # Supabase config
├── vercel.json         # Deployment configuration
├── package.json        # Backend dependencies
└── tsconfig.json       # TypeScript config
```

**Technologies:**
- Supabase (PostgreSQL + Auth)
- Google Gemini AI
- Node.js utilities
- TypeScript

---

## 🚀 Development Commands

### Frontend Development:
```bash
# Install frontend dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Scripts:
```bash
# Navigate to backend
cd backend

# Install backend dependencies  
npm install

# Run database scripts
npm run check-admin
npm run generate-dummy
npm run list-users

# Database operations
npm run db:migrate
npm run db:generate-types
```

---

## 🔗 Path Updates Required

**⚠️ Important:** Setelah restructuring, beberapa import paths perlu diupdate:

### Old imports (tidak berlaku lagi):
```typescript
import { createClient } from '@/lib/supabase/client'
import { createAdminSupabaseClient } from '@/lib/supabase/admin'
```

### New imports (perlu diupdate):
```typescript
import { createClient } from '../../../backend/lib/supabase/client'
import { createAdminSupabaseClient } from '../../../backend/lib/supabase/admin'
```

**atau** setup alias di `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/backend/*": ["../backend/*"],
      "@/lib/*": ["../backend/lib/*"]
    }
  }
}
```

---

## 📦 Dependencies Overview

### Root Dependencies:
- Next.js framework dependencies
- UI libraries (React, Tailwind)
- Development tools

### Backend Dependencies:
- Supabase SDK
- Google Gemini AI
- Node.js utilities
- TypeScript tools

---

## 🎯 Benefits of This Structure:

✅ **Clear Separation:** Frontend dan backend terpisah jelas
✅ **Scalability:** Mudah dikembangkan secara independen  
✅ **Team Collaboration:** Tim frontend/backend bisa bekerja terpisah
✅ **Deployment Flexibility:** Bisa deploy frontend/backend terpisah
✅ **Maintainability:** Easier to maintain dan debug
✅ **Monorepo Ready:** Siap untuk monorepo architecture

---

*Generated: July 2024 - PNDW JOGJA Development Team* 