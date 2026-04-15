# dubbleYOU — Product Spec
> Last updated: 2025

---

## 1. The Idea

**Body doubling** is an ADHD productivity strategy where having another person present — even silently — makes it easier to start and sustain focused work. dubbleYOU turns this inward: you body double with a persona representing a version of yourself you're actively building.

You create multiple "selves" — App Builder, Avid Reader, Gym Person — and when it's time to work, you select that self and let them sit with you. As you log focus sessions, that persona evolves: it levels up, looks more developed, and accumulates a history you can actually see. The big idea: **growth is invisible in real life. dubbleYOU makes it visible.**

The Pokémon reference is intentional. Your personas are like creatures you're raising. The more time you invest, the more they evolve. You're not just building habits — you're building characters.

---

## 2. App Identity

| | |
|---|---|
| **Name** | dubbleYOU |
| **Tagline** | focus with who you're becoming |
| **Platform** | React web app first, Expo (iOS) port in Phase 2 |
| **Tone** | Playful, warm, quietly encouraging — like a cozy RPG, not a productivity grind |
| **Reference** | Pokémon meets a focus app. Collect and evolve your selves. |

---

## 3. Target User

Priyanka. And people like her:
- ADHD brain that benefits from body doubling
- Multiple areas of life they want to grow in simultaneously
- Finds standard timers (Pomodoro etc.) cold and motivationally empty
- Responds well to visible progress and light gamification
- Wants to feel good about showing up, not just tracked

---

## 4. V1 Scope (Keep It Tight)

V1 ships with exactly these features. Nothing else.

### In Scope
- Create, view, and delete personas
- Focus timer with body doubling presence
- Persona leveling (XP = focus minutes, level up every 30 min)
- Session note on timer end (optional, one line)
- Persistent local storage (no account, no backend)

### Out of Scope (V2+)
- Badges / achievement system
- Session history view
- Streaks
- Evolution log / persona journal
- Notifications / reminders
- Onboarding flow
- Stats / analytics
- Social / sharing
- Sounds / ambient audio
- Accounts / sync

> **Why so tight?** The core loop — pick a self, focus with them, watch them grow — is complete with just the timer and leveling. Everything else is additive. Ship the soul of the app first.

---

## 5. Navigation Map

```
dubbleYOU
│
├── Home Screen  ("Your Party")
│     ├── Persona cards (grid)
│     ├── [+] FAB  →  Create Persona Sheet (modal overlay)
│     └── Tap card  →  Persona Detail Screen
│
├── Persona Detail Screen
│     ├── Character card (full header)
│     ├── Level + XP bar
│     ├── Recent sessions (last 5, minimal)
│     └── [Focus Now]  →  Timer Screen
│
└── Timer Screen  (full screen modal)
      ├── Persona presence (ambient, quiet)
      ├── Running clock
      ├── Pause / End controls
      └── [End]  →  End Flow (note input)  →  back to Home
```

---

## 6. Screen Specs

---

### 6.1 Home Screen — "Your Party"

**Purpose:** See all your personas at a glance. Start focusing or create a new one.

**Layout:**
- Header: app name "dubbleYOU" + tagline in small text beneath
- Persona grid: 2 columns, scrollable
- FAB (+) fixed bottom-right to create new persona

**Persona card (in grid) shows:**
- Persona emoji (large)
- Persona name
- Level badge (e.g. "LVL 4")
- Goal/focus area (1 line, muted)
- XP progress bar (thin, accent color)
- [Focus Now] button — primary, accent color
- [View] button — secondary, ghost style

**Empty state (no personas yet):**
- Centered illustration / emoji
- Headline: "who do you want to become?"
- Subtext: "create your first self to begin"
- Tap anywhere (or FAB) to create

**When there's 1 persona:**
- Single card takes full width, not half

---

### 6.2 Create Persona Sheet

**Trigger:** FAB on home screen
**Presentation:** Bottom sheet modal (slides up), darkened backdrop

**Fields:**
1. **Name** — text input, max 24 chars, e.g. "App Builder"
2. **Goal** — text input, max 60 chars, e.g. "Ship side projects", optional
3. **Emoji** — picker row (18 options)
4. **Color / Type** — 6 color themes (see design system), displayed as dots

**Live preview** at top of sheet: shows the persona card as it will appear, updates in real time as user types/picks.

**Validation:** Name required. Save button disabled until name is entered.

**Save behavior:** Sheet dismisses, persona appears in grid with a fade-in entrance animation.

---

### 6.3 Persona Detail Screen

**Purpose:** See this persona's full character card. Launch a session.

**Layout (scrollable):**

1. **Header card** — full-width, persona's color theme as background tint
   - Large emoji
   - Name (display font, large)
   - Goal (muted, smaller)
   - Total focus time (e.g. "4h 20m total")
   - Session count (e.g. "12 sessions")

2. **Level block**
   - "Level 7" in large monospace
   - XP progress bar
   - "18 more minutes to Level 8" in small muted text

3. **Recent Sessions** (last 5 only in V1)
   - Each row: date + duration + note (if any)
   - If no sessions yet: "no sessions yet — start your first"

4. **Actions**
   - [Focus Now] — full-width primary button in accent color
   - [Delete Persona] — small destructive text link at bottom, requires a tap-to-confirm step

**Back navigation:** Back arrow top-left to Home

---

### 6.4 Timer Screen

**Purpose:** The body doubling experience. Quiet, present, unhurried.

**Feeling:** Like someone is sitting across from you at a library table. Not a boss battle. Not a meditation app. Just... presence.

**Full screen. No distractions.**

**Layout (centered, vertically distributed):**

1. **Persona presence** — top third
   - Large emoji in a soft glowing ring (persona's accent color, low opacity)
   - Persona name beneath
   - Rotating hint text — soft, italic, changes every 10 seconds
     - "[Name] is sitting with you."
     - "You're building [Name] right now."
     - "Stay. [Name] is here."
     - "This time counts."
     - "You showed up."

2. **Timer** — center
   - Large monospace clock: MM:SS (becomes H:MM:SS after 60 min)
   - Color: persona accent when running, muted gray when paused

3. **Controls** — bottom
   - [Pause / Resume] — outline button
   - [End Session] — solid accent button

**Background:** In light mode — warm off-white base (`bg`) with a very faint radial bloom of the persona's accent color at the center. In dark mode — deep dark base with a slightly stronger bloom. Either way: ambient, not flashy. The color is felt more than seen.

**Keep awake:** Screen never sleeps during a session (`expo-keep-awake`).

**Haptics:**
- Light impact on Pause / Resume
- Medium impact on End Session tap
- Success notification feedback on save

**End session flow (inline, replaces controls):**
- Optional note input (one line, placeholder: "what did you work on?")
- [Save Session] — saves and navigates back to Home
- [Keep Going] — dismisses end card, resumes timer
- Sessions under 30 seconds: shows "too short to save" and only offers [Keep Going] or [Discard]

**Android back button:** Intercepted — triggers end flow instead of navigating away.

---

## 7. Leveling System

The only progression mechanic in V1.

| Rule | Value |
|---|---|
| XP unit | 1 minute of focus = 1 XP |
| Level threshold | 30 XP per level |
| Level cap | 99 |
| Starting level | Level 1, 0 XP |

**Level display:**
- On persona card: "LVL 4" badge top-right
- On detail screen: "Level 4" large + XP bar + "18 min to Level 5"

**No level-up fanfare in V1.** The bar fills and rolls over silently. (V2 can add a celebration moment.)

**XP is per-persona.** Your App Builder and Avid Reader level independently.

---

## 8. Visual Design System

### Philosophy
Playful but not childish. Gamified but not noisy. Warm, light base by default — feels like a sunny notebook, not a dark cockpit. Each persona pops with its own vivid color world against that light base. Dark mode available for nighttime sessions, preserving the same warmth.

### Theming

- **Default:** Light mode
- **Option:** Dark mode (user-toggled, persisted to storage)
- **Toggle location:** Gear icon (⚙) in the top-right of the Home screen header — opens a small action sheet with a Light / Dark / System choice. No separate settings screen.
- **Storage key:** `dby_v1_theme` — stores `'light' | 'dark' | 'system'`
- **Implementation:** `ThemeContext` wraps the app alongside `AppContext`. Exposes `theme` (the active palette object) and `setColorScheme()`. When set to `'system'`, reads from the `prefers-color-scheme` media query. Preference persisted to localStorage under `dby_v1_theme`.

### Color Palette

All tokens come in two variants. The active variant is selected by `ThemeContext` and passed through the app — no component ever reads the color scheme directly.

**App base tokens:**

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg` | `#faf8f4` | `#0d0c09` | Screen backgrounds |
| `surface` | `#ffffff` | `#181510` | Cards, sheets |
| `surface2` | `#f3f0ea` | `#201c14` | Inputs, inner surfaces |
| `border` | `#e6dfd2` | `#2a2418` | All borders |
| `textPrimary` | `#1c1812` | `#e8dfc8` | Headings, key text |
| `textSecondary` | `#6b5e4e` | `#7a6e5e` | Supporting text |
| `textMuted` | `#9c8c78` | `#5c5040` | Labels, placeholders |
| `textFaint` | `#c8bfb0` | `#3a3028` | Disabled, very subtle |

**Persona color themes (6 types):**

Accent colors are the same in both modes — they're vivid enough to work on light and dark surfaces. Only the card background tint changes.

Each type also determines the persona's **studio** in the V2 timer visualization (see roadmap). The color choice during persona creation is doing double duty — it sets the visual theme *and* the world your persona inhabits.

| ID | Name | Accent | Light card bg | Dark card bg | Feel | Studio |
|---|---|---|---|---|---|---|
| `amber` | Amber | `#d4901c` | `#fef8ed` | `#22180a` | Creative, artistic | Warm artist's loft — easel, sketchbooks, golden afternoon light |
| `forest` | Forest | `#4a9458` | `#f0f8f2` | `#0b1e0e` | Grounded, growth | Nature cabin desk — plants, a journal, soft green light through trees |
| `ocean` | Ocean | `#3878c0` | `#eef5fd` | `#081620` | Deep, analytical | Clean minimal study — single lamp, dense bookshelves, blue-grey light |
| `plum` | Plum | `#8048c0` | `#f4f0fc` | `#140c28` | Mystical, intuitive | Moody reading nook — stacked books, candles, deep shadows |
| `rust` | Rust | `#c04a22` | `#fdf0eb` | `#220c06` | Bold, energetic | Garage / maker space — weights, a whiteboard, exposed brick |
| `jade` | Jade | `#28988a` | `#edf8f6` | `#061e16` | Balanced, calm | Zen workspace — a tea set, open window, calm and spare |

Each persona's accent color drives: card border tint, level badge, XP bar, timer clock color, timer ambient glow, and primary buttons on that persona's screens.

### Typography

| Role | iOS font | Android font | Notes |
|---|---|---|---|
| Display (headings, names) | Georgia | serif | Warm, feels handcrafted |
| Body / UI | System | System | Clean and readable |
| Monospace (timer, stats) | Courier New | monospace | Bold weight for timer |
| Labels (uppercase) | System | System | 10–11px, letter-spaced |

### Spacing & Shape

| Token | Value |
|---|---|
| Screen horizontal padding | 20 |
| Card border radius | 10–14 |
| Input/button border radius | 8 |
| Bottom sheet border radius | 22 (top corners only) |
| Grid gap | 14 |
| Section gap | 16–24 |

### Key Animations

| Moment | Animation |
|---|---|
| Persona card created | Fade in + 6px slide up, 300ms |
| Bottom sheet open | Spring: tension 65, friction 11 |
| Timer glow | Opacity 0.4 → 0.85, loop, 1200ms each way |
| Avatar ring | Scale 1.0 → 1.04, same loop as glow |
| Hint text rotation | Opacity fade out/in, 400ms |
| XP bar on load | Width 0 → actual%, 600ms ease-out |

---

## 9. Data Model

```typescript
interface Persona {
  id: string;        // uid() — random alphanumeric
  name: string;      // max 24 chars, required
  goal: string;      // max 60 chars, optional
  emoji: string;     // single emoji character
  color: string;     // ColorTheme id: 'amber' | 'forest' | 'ocean' | 'plum' | 'rust' | 'jade'
  createdAt: string; // ISO 8601
}

interface Session {
  id: string;        // uid()
  personaId: string; // → Persona.id
  duration: number;  // minutes as float (e.g. 24.5)
  note: string;      // max 120 chars, optional
  date: string;      // ISO 8601
}
```

**Storage keys:** `dby_v1_personas`, `dby_v1_sessions`, `dby_v1_theme`

**Derived values (computed, never stored):**
- Total XP: `sessions.filter(s => s.personaId === id).reduce((t, s) => t + s.duration, 0)`
- Level: `Math.min(99, Math.floor(totalXP / 30) + 1)`
- XP in current level: `totalXP % 30`
- Minutes to next level: `Math.ceil(30 - (totalXP % 30))`

---

## 10. Component Inventory

| Component | Purpose |
|---|---|
| `PersonaCard` | Grid card on home screen |
| `CreatePersonaSheet` | Bottom sheet modal for new persona |
| `LevelBlock` | Level number + XP bar + "X min to next level" |
| `SessionRow` | Single row in recent sessions list |
| `TimerDisplay` | The large monospace clock |
| `PersonaPresence` | Avatar ring + name + rotating hint text |
| `EndSessionCard` | Inline end-flow card with note input + buttons |
| `AppContext` | Global data: personas, sessions, CRUD actions |
| `ThemeContext` | Active palette object, colorScheme pref, setColorScheme() |
| `useTheme()` | Hook — returns the current `theme` palette; all components use this, never hardcoded colors |

---

## 11. File Structure

```
dubbleYOU/
├── src/
│   ├── pages/
│   │   ├── Home.tsx              # Home screen — persona grid
│   │   ├── Timer.tsx             # Timer screen — full screen focus mode
│   │   └── PersonaDetail.tsx     # Persona detail screen
│   ├── components/
│   │   ├── PersonaCard.tsx
│   │   ├── CreatePersonaSheet.tsx
│   │   ├── LevelBlock.tsx
│   │   ├── SessionRow.tsx
│   │   ├── TimerDisplay.tsx
│   │   ├── PersonaPresence.tsx
│   │   └── EndSessionCard.tsx
│   ├── constants/
│   │   ├── theme.ts              # LIGHT, DARK palettes, COLORS[], getColor()
│   │   └── data.ts               # EMOJIS[], HINTS[]
│   ├── context/
│   │   ├── AppContext.tsx         # personas, sessions, addPersona, addSession, deletePersona
│   │   └── ThemeContext.tsx       # active palette, colorScheme pref, setColorScheme()
│   ├── lib/
│   │   ├── storage.ts             # localStorage helpers (load, save)
│   │   └── utils.ts               # fmtTime, fmtMins, getLevel, getXP, uid, etc.
│   ├── types/
│   │   └── index.ts               # Persona, Session, ColorTheme, NewPersonaData
│   ├── App.tsx                    # Router setup, context providers
│   └── main.tsx                   # Vite entry point
├── public/
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 12. Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite |
| Language | TypeScript (strict mode) |
| Routing | React Router v6 |
| State management | React Context (AppContext + ThemeContext) |
| Storage | localStorage (browser-native, no install needed) |
| Styling | CSS Modules |
| Keep Awake | `navigator.wakeLock` API (browser-native) |
| Haptics | n/a (web — skipped for now) |
| Theme | ThemeContext + `prefers-color-scheme` media query for system default |

> **Expo port (Phase 2):** Once the app is built and stable, porting to Expo is mostly mechanical — `div` → `View`, `p` → `Text`, CSS Modules → StyleSheet, localStorage → AsyncStorage, wakeLock → `expo-keep-awake`. The logic and structure stay identical.

---

## 13. Setup Commands

```bash
# 1. Scaffold new project
npm create vite@latest dubbleYOU -- --template react-ts

# 2. Enter project
cd dubbleYOU

# 3. Install dependencies
npm install

# 4. Install React Router
npm install react-router-dom

# 5. Start dev server
npm run dev
```

---

## 14. V2+ Roadmap (Parking Lot)

Not V1. Captured here so they don't create scope creep.

- **Badge system** — unlock achievements (First Spark, 10 Hours, 20 Sessions, etc.)
- **Level-up celebration** — screen moment when a persona levels up
- **Streaks** — consecutive days with at least one session per persona
- **Evolution log** — timestamped journal entries about how a persona has grown
- **Session history** — full scrollable history with notes per persona
- **Weekly summary** — side-by-side comparison across all personas
- **Notifications** — daily nudge: "Time to focus with [Name]?"
- **Ambient sounds** — lo-fi, rain, white noise during timer
- **Persona evolution stages** — visual card upgrades at level milestones (Lv 10, 25, 50)
- **Onboarding** — first-launch walkthrough explaining body doubling
- **Studio timer visualization** — replace the abstract glow timer with an animated studio scene. Each session, your persona's studio fills with life as you focus: objects appear, light shifts, the space feels more lived-in. Studios are tied to the persona's color type (6 studios total), so the type choice during persona creation determines the world they inhabit. Studios also evolve across sessions — early on the desk is bare, after 10 hours it looks genuinely worked in.
  - Amber → Warm artist's loft (easel, sketchbooks, golden light)
  - Forest → Nature cabin desk (plants, journal, green light through trees)
  - Ocean → Clean minimal study (single lamp, bookshelves, blue-grey light)
  - Plum → Moody reading nook (stacked books, candles, deep shadows)
  - Rust → Garage / maker space (weights, whiteboard, exposed brick)
  - Jade → Zen workspace (tea set, open window, calm and spare)
- **Expo port (Phase 2)** — port the finished React app to Expo for iOS distribution. Mostly mechanical: swap HTML elements for RN components, CSS for StyleSheet, localStorage for AsyncStorage, wakeLock for expo-keep-awake.
- **Home screen widget** — current persona's level at a glance

---

## 15. Open Questions

Resolve these before building the relevant section.

- [ ] **App icon design** — what does it look like? A mirrored W/U? Abstract?
- [ ] **Splash screen** — dark bg + app name only? Or more?
- [ ] **Single-persona home layout** — full-width card or centered narrow?
- [ ] **Hint rotation style** — cross-fade (opacity) or slide-up?
- [ ] **Deleting a persona** — also deletes all its sessions. Intentional? Warn the user?
- [ ] **Timer end: where does it navigate?** — Home screen (current plan) or Persona Detail?