# CLAUDE.md

## Project

Sha'ul Simulator -- a personality test prep tool for dental school admission candidates. Simulates the Sha'ul (Big Five) personality assessment used in Israeli dental school admissions. Hebrew RTL app with localStorage auth and optional Gemini AI feedback.

Part of Liron's dental prep ecosystem alongside easy-access-page (landing) and dat-spatial-lab (spatial reasoning).

## Commands

```bash
npm run dev          # Dev server (Vite)
npm run build        # tsc && vite build
npm run preview      # Preview production build
```

### Windows Local Dev

After `npm install`, you must also run:
```bash
npm install @rollup/rollup-win32-x64-msvc
```
This is needed due to a known npm bug with optional dependencies on Windows.

## Architecture

Single-page React app with stage-based navigation (no router).

### App Stages

Auth -> Welcome -> Simulation (intro -> 30 pairs) -> LoadingResults -> Results -> GuidedReflection
                -> Educational (Big Five explainer)
                -> Admin (view runs, manage access codes)

### Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main orchestrator, stage management, auth handlers |
| `src/types.ts` | All TypeScript types and enums |
| `src/constants.ts` | Scoring weights, ideal profiles, trait colors, access codes |
| `src/services/authService.ts` | localStorage auth with access codes |
| `src/services/personalityTestData.ts` | 60 Big Five statements, pair shuffling |
| `src/services/scoringService.ts` | Weighted deviation scoring (150-250 scale) |
| `src/services/geminiService.ts` | Gemini API for personalized trait explanations |
| `src/services/storageService.ts` | localStorage for simulation runs |

### Auth System

- localStorage-based, no backend
- Access codes hardcoded in `constants.ts` (INITIAL_ACCESS_CODES)
- Passwords "obfuscated" with btoa (NOT secure -- client-side only)
- Registration requires unused access code

### AI Explanations

- Gemini 2.0 Flash (stable) via `@google/genai`
- API key from `.env.local` -> `GEMINI_API_KEY` (injected via vite.config.ts define)
- Prompt tuned for dental interview context with concrete exercises
- Falls back to static messages if API key missing

### Scoring

- Big Five traits: Conscientiousness, Agreeableness, Emotional Stability, Extraversion, Openness
- Weighted deviation from ideal dentist profile
- Fit score: 150-250
- Pattern detection: uniform, polarized, exaggerated positive

## Design

- Indigo brand palette (`brand-50` through `brand-900` in tailwind.config.ts)
- Rubik font (Hebrew)
- RTL throughout
- Trait colors: indigo, emerald, violet, amber, rose

## Critical Rules

1. `.env.local` contains `GEMINI_API_KEY` -- never commit this file (gitignored via `*.local`)
2. Access codes are in `constants.ts` INITIAL_ACCESS_CODES -- only seeded on first load if localStorage is empty
3. The `@vitejs/plugin-react` (Babel) is used, NOT SWC -- SWC native bindings fail on this Windows machine
4. Deployment: not yet deployed to Lovable. Currently localhost-only.
