# dubbleYOU — CLAUDE.md

## What This Is

A body-doubling focus app for ADHD brains. You create personas representing versions of yourself you're building (e.g. "App Builder", "Avid Reader"), then focus alongside them as a timer runs. Personas gain XP from focus minutes and level up. Growth that's invisible in real life becomes visible here.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + Vite |
| Language | TypeScript (strict) |
| Routing | React Router v7 |
| State | React Context (`AppContext` + `ThemeContext`) |
| Storage | `localStorage` (no backend, no accounts) |
| Styling | CSS Modules |
| Keep Awake | `navigator.wakeLock` API |

Dev server: `npm run dev`
Build: `npm run build` (runs `tsc -b` then Vite)

## File Structure

```
src/
├── pages/
│   ├── Home.tsx              # "Your Party" — persona grid
│   ├── PersonaDetail.tsx     # Character card + sessions + Focus Now
│   └── Timer.tsx             # Full-screen body doubling experience
├── components/
│   ├── PersonaCard.tsx       # Grid card (emoji, name, level, XP bar)
│   ├── CreatePersonaSheet.tsx # Bottom sheet modal for new persona
│   ├── LevelBlock.tsx        # Level + XP bar + "X min to next level"
│   ├── SessionRow.tsx        # Single row in recent sessions list
│   ├── TimerDisplay.tsx      # Large monospace clock (MM:SS / H:MM:SS)
│   ├── PersonaPresence.tsx   # Avatar ring + name + rotating hint text
│   └── EndSessionCard.tsx    # Inline end-flow: note input + save/keep going
├── constants/
│   ├── theme.ts              # LIGHT, DARK palettes; COLORS[] with all 6 types; getColor()
│   └── data.ts               # EMOJIS[] (18 options); HINTS[] for timer rotation
├── context/
│   ├── AppContext.tsx         # personas, sessions, addPersona, addSession, deletePersona
│   └── ThemeContext.tsx       # active palette, colorScheme pref ('light'|'dark'|'system'), setColorScheme()
├── lib/
│   ├── storage.ts             # localStorage helpers: load(), save()
│   └── utils.ts               # fmtTime, fmtMins, getLevel, getXP, uid, etc.
├── types/
│   └── index.ts               # Persona, Session, ColorTheme, NewPersonaData
├── App.tsx                    # Router setup, context providers
└── main.tsx                   # Vite entry
```

## Data Model

```typescript
interface Persona {
  id: string;        // uid() — random alphanumeric
  name: string;      // max 24 chars, required
  goal: string;      // max 60 chars, optional
  emoji: string;     // single emoji
  color: ColorTheme; // 'amber' | 'forest' | 'ocean' | 'plum' | 'rust' | 'jade'
  createdAt: string; // ISO 8601
}

interface Session {
  id: string;        // uid()
  personaId: string;
  duration: number;  // minutes as float (e.g. 24.5)
  note: string;      // max 120 chars, optional
  date: string;      // ISO 8601
}
```

**localStorage keys:** `dby_v1_personas`, `dby_v1_sessions`, `dby_v1_theme`

**Derived values — computed, never stored:**
```ts
totalXP       = sessions.filter(s => s.personaId === id).reduce((t, s) => t + s.duration, 0)
level         = Math.min(99, Math.floor(totalXP / 30) + 1)
xpInLevel     = totalXP % 30
minsToNext    = Math.ceil(30 - (totalXP % 30))
```

## Leveling System

- 1 focus minute = 1 XP
- 30 XP per level
- Level cap: 99, starting: Level 1 at 0 XP
- XP is per-persona (personas level independently)
- No level-up fanfare in V1 — bar fills silently

## Color Themes (6 types)

| ID | Accent | Feel |
|---|---|---|
| `amber` | `#d4901c` | Creative, artistic |
| `forest` | `#4a9458` | Grounded, growth |
| `ocean` | `#3878c0` | Deep, analytical |
| `plum` | `#8048c0` | Mystical, intuitive |
| `rust` | `#c04a22` | Bold, energetic |
| `jade` | `#28988a` | Balanced, calm |

Accent color drives: card border tint, level badge, XP bar, timer clock, timer glow, primary buttons.

## App Base Tokens

| Token | Light | Dark |
|---|---|---|
| `bg` | `#faf8f4` | `#0d0c09` |
| `surface` | `#ffffff` | `#181510` |
| `surface2` | `#f3f0ea` | `#201c14` |
| `border` | `#e6dfd2` | `#2a2418` |
| `textPrimary` | `#1c1812` | `#e8dfc8` |
| `textSecondary` | `#6b5e4e` | `#7a6e5e` |
| `textMuted` | `#9c8c78` | `#5c5040` |
| `textFaint` | `#c8bfb0` | `#3a3028` |

## Styling Rules

- All colors come from `useTheme()` — never hardcode colors in components
- CSS Modules for all component styles
- Typography: Georgia/serif for display (names, headings); system font for body/UI; Courier New/monospace for timer and stats
- Default is light mode; dark mode user-toggled via gear icon (⚙) on Home header, stored as `'light' | 'dark' | 'system'`

## Key Animations

| Moment | Spec |
|---|---|
| Persona card created | Fade in + 6px slide up, 300ms |
| Bottom sheet open | Spring: tension 65, friction 11 |
| Timer glow | Opacity 0.4 → 0.85, loop, 1200ms each way |
| Avatar ring | Scale 1.0 → 1.04, same loop |
| Hint text rotation | Opacity fade out/in, 400ms, every 10s |
| XP bar on load | Width 0 → actual%, 600ms ease-out |

## Timer Screen Details

- Full screen, no distractions
- Hint texts (rotate every 10s): "[Name] is sitting with you." / "You're building [Name] right now." / "Stay. [Name] is here." / "This time counts." / "You showed up."
- Background: faint radial bloom of persona accent color (felt, not flashy)
- `navigator.wakeLock` keeps screen alive during session
- End flow: optional note (one line) → Save Session → back to Home
- Sessions under 30 seconds: "too short to save" — only Keep Going or Discard
- After save, navigate back to Home (not Persona Detail)

## V1 Scope — What's In

- Create, view, delete personas
- Focus timer with body doubling presence
- Persona leveling (XP = focus minutes, level up every 30 min)
- Optional session note on end
- Persistent localStorage (no account, no backend)

## V1 Scope — What's Out

Do not add: badges, streaks, session history view, evolution log, notifications, onboarding flow, analytics, social/sharing, sounds, accounts/sync, level-up celebration animations, studio timer visualization.
