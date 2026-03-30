# CLAUDE.md

## Project

Sha'ul Simulator -- a personality test prep tool for dental school admission candidates. Simulates the Sha'ul (Big Five) personality assessment used in Israeli dental school admissions. Hebrew RTL app with localStorage auth (currently disabled) and optional Gemini AI feedback.

Part of Liron's dental prep ecosystem alongside easy-access-page (landing) and dat-spatial-lab (spatial reasoning).

## Commands

```bash
npm run dev          # Dev server (Vite)
npm run build        # tsc && vite build (type-checks then bundles)
npm run preview      # Preview production build
npx tsc --noEmit     # Type-check only (no lint/test scripts configured)
```

### Windows Local Dev

After `npm install`, also run `npm install @rollup/rollup-win32-x64-msvc` (npm optional deps bug).

## Architecture

Single-page React app with stage-based navigation (no router).

### Two Modes

| Mode | Purpose | Pairs per session | Pool draws from |
|------|---------|-------------------|-----------------|
| **Learning** | Practice, explore traits, improve answers | 30 | `learning-pool.json` (150 pairs) |
| **Simulation** | Full test replica matching real SHAUL | 120 | `simulation-pool.json` (300 pairs) |

Mode selection happens on the Welcome screen (two buttons). Each session draws a fresh random subset via Fisher-Yates shuffle. Both pool JSONs are loaded at startup (~300KB total). The two pools are **completely separate** — no shared statements or pairs.

### App Stages (current)

Welcome -> Simulation (intro -> pairs) -> LoadingResults -> Results -> GuidedReflection
        -> Educational (Big Five explainer)
        -> Admin (view runs, manage access codes)

Auth is disabled during development (DEV_USER auto-login in App.tsx).

### Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main orchestrator, stage management, mode selection |
| `src/types.ts` | All TypeScript types and enums (incl. `SimulationMode`) |
| `src/constants.ts` | Static constants only (traits, colors, weights, auth) |
| `src/data/learning-pool.json` | Learning mode pool (300 statements, 150 pairs) |
| `src/data/simulation-pool.json` | Simulation mode pool (600 statements, 300 pairs) |
| `src/services/configService.ts` | Loads both pools, exports `getPoolConfig(mode)` returning `PoolConfig` |
| `src/services/personalityTestData.ts` | `drawRandomPairs(mode)` — Fisher-Yates shuffle + slice |
| `src/services/scoringService.ts` | Weighted deviation scoring (150-250 scale), accepts `PoolConfig` |
| `src/services/geminiService.ts` | Gemini API for personalized trait explanations, accepts `maxTraitScore` |
| `src/services/storageService.ts` | localStorage for simulation runs |
| `src/services/authService.ts` | localStorage auth with access codes (disabled) |

### Content Pools & Pipeline

Pools are separate — learning (150 pairs, educational) and simulation (300 pairs, real SHAUL). Content pipeline: Google Sheet → `scripts/export_sheet_to_json.py` (accepts --xlsx or --statements/--pairs CSV) → pool JSON. Reverse export: `--export-csv scripts/`. Sheet columns: Statements (`id, text_he, trait, notes`), Pairs (`id, statement_a, statement_b, notes`). Valid traits: `Conscientiousness`, `Agreeableness`, `EmotionalStability`, `Extraversion`, `Openness`.

### Scoring & AI

- `configService.ts` pre-computes `PoolConfig` per mode — scoring auto-scales, no code changes needed when modifying pools
- Weighted deviation from ideal dentist profile (curvilinear). Weights: C:30%, A:25%, ES:25%, E:10%, O:10%. Score: 150-250
- Gemini 2.0 Flash via `@google/genai`, API key in `.env.local` (`GEMINI_API_KEY`). Falls back to static if missing

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/export_sheet_to_json.py` | Google Sheet CSV/xlsx → questions.json (bidirectional) |
| `scripts/assemble_pools.py` | Combines trait content files → learning-pool.json + simulation-pool.json |
| `scripts/expand_content.py` | Reference: how s61-s180 were generated |
| `scripts/shaul_content.xlsx` | Excel with Statements, Pairs, and Pairs Lookup sheets |
| `scripts/content/*.py` | Raw statement data per trait (LEARNING + SIMULATION lists) |

## Design

- Indigo brand palette (`brand-50` through `brand-900` in tailwind.config.ts)
- Rubik font (Hebrew)
- RTL throughout
- Trait colors: indigo, emerald, violet, amber, rose
- Radar chart: user profile (blue) + ideal profile (dashed green) + average (amber)

## Critical Rules

1. `.env.local` contains `GEMINI_API_KEY` -- never commit this file (gitignored via `*.local`)
2. Access codes are in `constants.ts` INITIAL_ACCESS_CODES -- only seeded on first load if localStorage is empty
3. The `@vitejs/plugin-react` (Babel) is used, NOT SWC -- SWC native bindings fail on this Windows machine
4. Deployment: not yet deployed to Lovable. Currently localhost-only.
5. No ESLint or test framework configured.
6. **Content changes go through the Google Sheet → export script pipeline. Never hardcode statements or pairs in TypeScript.**
7. **Learning and simulation pools must NEVER share statements or pairs.**

## Pending Work

- Deploy to Lovable (requires GitHub repo at llironlibo/shaul-simulator)
- Supabase auth to replace localStorage auth (currently disabled)
- Backend for persistent data storage
- Email verification flow
- Liron's Hebrew review of all generated statements (~840 new)
