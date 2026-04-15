# dubbleYOU

A body-doubling focus app for ADHD brains. Create personas representing versions of yourself you're building — then focus alongside them as a timer runs. Personas gain XP from focus minutes and level up. Growth that's invisible in real life becomes visible here.


## What It Does

- **Create personas** — give them a name, goal, emoji, and color theme
- **Focus alongside them** — full-screen timer with your persona's presence
- **Level up** — 1 focus minute = 1 XP, 30 XP per level (cap: 99)
- **Session notes** — optional one-line note when you end a session
- **Persists locally** — no accounts, no backend, just `localStorage`

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + Vite |
| Language | TypeScript (strict) |
| Routing | React Router v7 |
| State | React Context |
| Storage | `localStorage` |
| Styling | CSS Modules |

## Installation & Usage

**Prerequisites:** Node.js 18+

```bash
# Clone the repo
git clone https://github.com/your-username/dubble-you.git
cd dubble-you

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app runs at `http://localhost:5173` by default.

**Using the app:**

1. **Create a persona** — tap the `+` on the home screen, pick a name, goal, emoji, and color
2. **Open your persona** — tap their card to see their character sheet and session history
3. **Start a focus session** — hit "Focus Now" to enter the full-screen timer
4. **End the session** — optionally add a note, then save; XP is added automatically
5. **Watch them level up** — the XP bar fills as you accumulate focus minutes

All data is stored locally in your browser — no account needed.

**Build for production:**

```bash
npm run build
```

## Project Structure

```
src/
├── pages/
│   ├── Home.tsx              # "Your Party" — persona grid
│   ├── PersonaDetail.tsx     # Character card + sessions + Focus Now
│   └── Timer.tsx             # Full-screen body doubling experience
├── components/
│   ├── PersonaCard.tsx
│   ├── CreatePersonaSheet.tsx
│   ├── LevelBlock.tsx
│   ├── SessionRow.tsx
│   ├── TimerDisplay.tsx
│   ├── PersonaPresence.tsx
│   └── EndSessionCard.tsx
├── constants/
│   ├── theme.ts              # Color palettes and tokens
│   └── data.ts               # Emoji options and timer hints
├── context/
│   ├── AppContext.tsx         # Personas + sessions state
│   └── ThemeContext.tsx       # Light/dark/system theme
├── lib/
│   ├── storage.ts             # localStorage helpers
│   └── utils.ts               # fmtTime, getLevel, getXP, uid, etc.
└── types/
    └── index.ts               # Persona, Session, ColorTheme types
```

## Leveling System

- **1 focus minute = 1 XP**
- **30 XP per level**
- Levels are per-persona — each one grows independently
- Level cap: 99

## Color Themes

| Theme | Feel |
|---|---|
| Amber | Creative, artistic |
| Forest | Grounded, growth |
| Ocean | Deep, analytical |
| Plum | Mystical, intuitive |
| Rust | Bold, energetic |
| Jade | Balanced, calm |

## V1 Scope

**In:** create/view/delete personas, focus timer, XP leveling, session notes, light/dark mode, localStorage persistence.

**Out (intentionally):** badges, streaks, session history view, notifications, onboarding, analytics, social/sharing, sounds, accounts/sync, level-up animations.
