# CLAUDE.md

## Project

Sha'ul Simulator -- a personality test prep tool for dental school admission candidates. Simulates the Sha'ul (Big Five) personality assessment used in Israeli dental school admissions. Hebrew RTL app with localStorage auth and optional Gemini AI feedback.

Part of Liron's dental prep ecosystem alongside easy-access-page (landing) and dat-spatial-lab (spatial reasoning).

## Commands

```bash
npm run dev          # Dev server (Vite)
npm run build        # tsc && vite build (type-checks then bundles)
npm run preview      # Preview production build
npx tsc --noEmit     # Type-check only (no lint/test scripts configured)
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

Auth -> Welcome -> Simulation (intro -> 90 pairs) -> LoadingResults -> Results -> GuidedReflection
                -> Educational (Big Five explainer)
                -> Admin (view runs, manage access codes)

### Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main orchestrator, stage management, auth handlers |
| `src/types.ts` | All TypeScript types and enums |
| `src/constants.ts` | Re-exports auto-scaled scoring config + static constants |
| `src/data/questions.json` | **Single source of truth** for all statements and pairs |
| `src/services/configService.ts` | Loads questions.json, computes scoring constants dynamically |
| `src/services/personalityTestData.ts` | Thin wrapper — loads pairs from configService, Fisher-Yates shuffle |
| `src/services/scoringService.ts` | Weighted deviation scoring (150-250 scale) |
| `src/services/geminiService.ts` | Gemini API for personalized trait explanations |
| `src/services/storageService.ts` | localStorage for simulation runs |
| `src/services/authService.ts` | localStorage auth with access codes |

### Content Pipeline (Google Sheet → JSON)

All test content lives in `src/data/questions.json`. To edit content:

```
Liron edits Google Sheet (Statements + Pairs tabs)
    ↓
Download as .xlsx or export each sheet as CSV
    ↓
python scripts/export_sheet_to_json.py --xlsx sheet.xlsx --output src/data/questions.json
  OR
python scripts/export_sheet_to_json.py --statements s.csv --pairs p.csv --output src/data/questions.json
    ↓
App auto-reads new content (npm run dev)
Scoring auto-scales to new pair count
```

To export current JSON back to CSV for Google Sheet import:
```bash
python scripts/export_sheet_to_json.py --export-csv scripts/ --output src/data/questions.json
```

Google Sheet structure:
- **Sheet "Statements"**: columns `id`, `text_he`, `trait`, `notes`
- **Sheet "Pairs"**: columns `id`, `statement_a`, `statement_b`, `notes`
- Valid traits: `Conscientiousness`, `Agreeableness`, `EmotionalStability`, `Extraversion`, `Openness`

### Auto-Scaling Scoring

`configService.ts` computes all scoring constants from `questions.json` at load time:
- `MAX_POSSIBLE_TRAIT_SCORE` = trait appearances in pairs (currently 36)
- `IDEAL_DENTIST_PROFILE` = proportional to max (C:67%, A:67%, ES:50%, E:33%, O:33%)
- Pattern detection thresholds scale proportionally
- **No code changes needed** when adding/removing pairs in the Google Sheet

### Auth System

- localStorage-based, no backend
- Access codes hardcoded in `constants.ts` (INITIAL_ACCESS_CODES)
- Passwords "obfuscated" with btoa (NOT secure -- client-side only)
- Registration requires unused access code

### AI Explanations

- Gemini 2.0 Flash (stable) via `@google/genai`
- API key from `.env.local` -> `GEMINI_API_KEY` (injected via vite.config.ts define)
- Prompt tuned for dental interview context with concrete exercises
- Score range in prompt is dynamic (uses MAX_POSSIBLE_TRAIT_SCORE)
- Falls back to static messages if API key missing

### Scoring

- Big Five traits: Conscientiousness, Agreeableness, Emotional Stability, Extraversion, Openness
- Weighted deviation from ideal dentist profile (curvilinear — too high is also penalized)
- Trait weights: C:30%, A:25%, ES:25%, E:10%, O:10%
- Fit score: 150-250
- Pattern detection: uniform, polarized, exaggerated positive (dental-specific messages)

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/export_sheet_to_json.py` | Google Sheet CSV/xlsx → questions.json (with validation) |
| `scripts/expand_content.py` | Reference: how 120 new statements (s61-s180) were generated |

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
4. Deployment: not yet deployed to Lovable. Currently localhost-only with localStorage auth.
5. No ESLint or test framework configured. Linting and testing are not available.
6. **Content changes go through the Google Sheet → export script → questions.json pipeline. Never hardcode statements or pairs in TypeScript.**

## Pending Work

- Deploy to Lovable (requires GitHub repo at llironlibo/shaul-simulator)
- Supabase auth to replace localStorage auth
- Backend for persistent data storage
- Email verification flow
- Liron's Hebrew review of the 120 new statements (s61-s180)
