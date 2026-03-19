# EchadXR

Immersive 3D experiences of biblical scenes — built for individuals, churches, and seminaries.

EchadXR places users inside scripture through interactive WebXR environments. Walk through Gethsemane, sit in the Upper Room, stand at Calvary. Each scene is built with React Three Fiber and designed for solo reflection or live group sessions led by a pastor or teacher.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| 3D / XR | React Three Fiber + Drei + Three.js |
| Backend / Auth | Supabase (PostgreSQL + Row Level Security) |
| Routing | React Router v6 |
| Payments | Stripe (webhook Edge Function) |
| Hosting | Vercel (frontend) + Supabase (backend) |

---

## Scenes

| Scene | Slug | Access |
|---|---|---|
| Gethsemane | `gethsemane` | Free |
| Upper Room | `upper-room` | Paid |
| Calvary | `calvary` | Paid |
| Empty Tomb | `empty-tomb` | Paid |
| Ascension | `ascension` | Paid |

---

## Subscription Tiers

- **Free** — Gethsemane scene, no account required
- **Individual** — $14.99/yr, all scenes
- **Church** — All scenes, group session hosting
- **Seminary** — All scenes, group sessions, institutional access

---

## Features

- **Protected scenes** — Access controlled by subscription tier via Supabase RLS
- **Progress tracking** — Time spent per scene recorded automatically on unmount
- **Group sessions** — Leader creates a session with a 6-character code; participants join in real time
- **SubscriptionGate** — Rendered as an overlay on top of locked 3D scenes (scene still renders beneath)
- **Auth** — Email/password via Supabase; Google OAuth can be enabled in the Supabase dashboard

---

## Project Structure

```
src/
├── App.jsx                     # Route definitions
├── main.jsx
├── index.css
├── lib/
│   ├── supabase.js             # Supabase client
│   ├── auth.jsx                # AuthContext, AuthProvider, useAuth
│   └── api.js                  # canAccessScene, getUserProgress, upsertProgress,
│                               # getAllScenes, createGroupSession, joinGroupSession
├── components/
│   ├── Auth/
│   │   ├── LoginForm.jsx
│   │   ├── SignupForm.jsx
│   │   └── ProtectedRoute.jsx
│   ├── Scenes/
│   │   ├── SceneWrapper.jsx    # Canvas + lighting setup
│   │   ├── Gethsemane.jsx
│   │   └── UpperRoom.jsx
│   └── UI/
│       ├── SubscriptionGate.jsx
│       ├── SceneSelector.jsx
│       └── ProgressTracker.jsx
└── pages/
    ├── Home.jsx
    ├── Dashboard.jsx
    ├── Scene.jsx               # Loads scene by slug, checks access, tracks progress
    └── GroupSession.jsx
supabase/
├── config.toml
└── migrations/
    └── 001_initial_schema.sql  # Full schema + RLS policies + seeded scenes
```

---

## Routes

| Path | Access | Description |
|---|---|---|
| `/` | Public | Landing page |
| `/login` | Public | Email/password login |
| `/signup` | Public | Account creation |
| `/dashboard` | Auth required | Scene list + progress |
| `/scene/:slug` | Public (free scenes) / Auth + subscription (paid) | 3D scene viewer |
| `/session/:sessionId` | Auth required | Live group session |

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/lilsaintdenzel/EchadXR.git
cd EchadXR
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in your `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Apply database migrations

In your Supabase project, run the SQL in:

```
supabase/migrations/001_initial_schema.sql
```

This creates all tables, enables RLS, and seeds the 5 scenes.

### 4. Run locally

```bash
npm run dev
```

---

## Adding a New Scene

1. Create `src/components/Scenes/YourScene.jsx`
2. Register it in `src/pages/Scene.jsx`:

```js
const SCENE_COMPONENTS = {
  gethsemane: Gethsemane,
  'upper-room': UpperRoom,
  'your-slug': YourScene,  // add here
}
```

3. Insert the scene row into the `scenes` table in Supabase (set `is_free`, `order_index`, `scripture_ref`, etc.)

---

## Database Tables

`profiles` · `scenes` · `user_progress` · `subscriptions` · `group_sessions` · `session_participants`

Full schema with RLS policies: [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql)

---

## Deployment

- **Frontend:** Push to main — Vercel auto-deploys
- **Payments:** Stripe webhook handling requires a Supabase Edge Function (stub included in architecture)
- **Environment variables:** Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel project settings
