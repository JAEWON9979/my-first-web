# Project Rules for my-first-web (Antigravity)

## Project Overview
- **Name**: my-first-web
- **Type**: Personal Blog & Portfolio with Supabase
- **Framework**: Next.js 16.2.1 (App Router ONLY)
- **Auth**: Supabase (Email/Password only, no social login)
- **Status**: Ch8 Database complete, Ch9 Authentication complete, Ch10 CRUD complete, Ch11 RLS complete, Ch12 UX prep

## Fixed Stack Versions (Teaching Material Basis)
- **Next.js**: 16.2.1 (App Router mandatory)
- **React**: 19.2.4
- **Tailwind CSS**: v4
- **@supabase/supabase-js**: 2.47.12
- **@supabase/ssr**: 0.5.2
- **shadcn/ui**: button, card, input, dialog, textarea, label

> Note: Actual `package.json` may be newer. Always check `package.json` for actual versions while documentation follows teaching material.

## Mandatory Patterns

### Architecture
- **Routing**: Next.js 16.2.1 App Router only (NO pages router, NO next/router)
- **Structure**: App-wide `max-w-4xl mx-auto` content width
- **Auth Logic**: Centralized in `lib/auth.ts`
- **Protected Routes**: Implemented via `middleware.ts`
- **State Management**: AuthProvider for global login state

### Supabase
- **Client**: `lib/supabase/client.ts` using `createBrowserClient` from `@supabase/ssr`
- **Auth Methods**: signInWithPassword, signUp, signOut ONLY
- **Forbidden**: auth.signIn() (outdated), service_role key on client
- **Environment**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Ch11 RLS
- **Execution**: Add via Supabase CLI migration only, not SQL Editor
- **Target**: `posts` table
- **Policy Basis**: `user_id = auth.uid()`
- **Security Rule**: UI visibility is not security; RLS is the actual enforcement layer

### Ch12 UX Prep
- **Focus**: Add loading, empty, error, auth/session expired, permission denied(RLS), and validation states
- **Constraint**: Preserve existing CRUD behavior, file structure, and current Tailwind styling as much as possible
- **UI Rule**: Do not force a full shadcn/ui migration; enhance only the affected surfaces
- **Scope**: `/posts`, `/posts/[id]`, `/posts/new`, `/login`, `/signup`
- **Messaging**: Keep user-facing messages and developer logs separate

### Component Rules
- **Default**: Server Components
- **Client Components** (`"use client"`): Only for state, events, browser APIs
- **UI Library**: shadcn/ui components (button, card, input, dialog, textarea, label)
- **Styling**: Tailwind CSS v4 with design tokens (NOT blue-500, NOT red-400 etc)
- **Design Tokens**: Primary #8B6B4E, Background #FBF8F3, Text #3A2E26

### Code Quality
- **Data Fetching**: Separate from page components (lib/ or hooks/)
- **Navigation**: Always `next/navigation` (NOT `next/router`)
- **Dynamic Routes**: Always `await params` in App Router
- **Color Usage**: Use CSS variables and shadcn/ui tokens, NOT Tailwind palette directly

## Key Files & Responsibilities

| File | Responsibility | Status |
| --- | --- | --- |
| `lib/supabase/client.ts` | Browser Supabase client initialization | ✅ Ch8 |
| `lib/auth.ts` | Login/signup/logout functions | 🔄 Ch9 |
| `app/layout.tsx` | Global layout + AuthProvider | 🔄 Ch9 |
| `app/login/page.tsx` | Email/password login form | 🔄 Ch9 |
| `app/signup/page.tsx` | Email/password signup form | 🔄 Ch9 |
| `middleware.ts` | Protected routes enforcement | 🔄 Ch9 |
| `app/posts/page.tsx` | List posts from Supabase | ✅ Ch8 |
| `app/posts/new/page.tsx` | Create post (Supabase insert) | ✅ Ch8 |
| `/posts/[id]/page.tsx` | Post detail | ✅ Ch8 |

## Protected Routes (Ch9)
- `/posts/new` — Login required
- `/posts/[id]/edit` — Login required (author only)
- `/mypage` — Login required (user only)

## RLS Targets (Ch11)
- `posts` SELECT
- `posts` INSERT
- `posts` UPDATE
- `posts` DELETE

## Absolute Prohibitions
- ❌ Do NOT use pages/ router
- ❌ Do NOT use next/router import
- ❌ Do NOT use auth.signIn() (old API)
- ❌ Do NOT add service_role key to client
- ❌ Do NOT add social login (email/password only)
- ❌ Do NOT use direct Tailwind colors (bg-blue-500, text-red-400)
- ❌ Do NOT create unnecessary "use client" directives
- ❌ Do NOT mix fetch logic into page components

## Document Source of Truth
- `.github/copilot-instructions.md` — Copilot coding rules
- `ARCHITECTURE.md` — System design & data model
- `context.md` — Current project state & decisions
- `todo.md` — Progress checklist by chapter
- `AGENTS.md` — Shared rules for multiple AI tools
- `CLAUDE.md` — Claude-specific rules
- This file (`.agent/rules/project.md`) — Antigravity/multi-agent rules

Any deviation requires explicit justification with user consent.
