
import { PersonalityTrait, AccessCode } from './types';

export const BIG_FIVE_TRAITS: PersonalityTrait[] = [
  PersonalityTrait.Conscientiousness,
  PersonalityTrait.Agreeableness,
  PersonalityTrait.EmotionalStability,
  PersonalityTrait.Extraversion,
  PersonalityTrait.Openness,
];

export const TRAIT_COLORS_TAILWIND: Record<PersonalityTrait, string> = {
  [PersonalityTrait.Conscientiousness]: "bg-indigo-600",
  [PersonalityTrait.Agreeableness]: "bg-emerald-600",
  [PersonalityTrait.EmotionalStability]: "bg-violet-600",
  [PersonalityTrait.Extraversion]: "bg-amber-500",
  [PersonalityTrait.Openness]: "bg-rose-500",
};

export const TRAIT_COLORS_HEX: Record<PersonalityTrait, string> = {
  [PersonalityTrait.Conscientiousness]: "#4f46e5",
  [PersonalityTrait.Agreeableness]: "#059669",
  [PersonalityTrait.EmotionalStability]: "#7c3aed",
  [PersonalityTrait.Extraversion]: "#f59e0b",
  [PersonalityTrait.Openness]: "#f43f5e",
};

export const API_KEY_ERROR_MESSAGE = "מפתח ה-API של Gemini אינו מוגדר או שגוי. האפליקציה לא תוכל לספק הסברים מותאמים אישית באמצעות AI. ניתן להמשיך להשתמש בסימולטור ולקבל פרופיל אישיות בסיסי. אנא ודא שהמשתנה process.env.API_KEY מוגדר כהלכה בסביבת הפיתוח/ההרצה.";

export const TRAIT_WEIGHTS: Record<PersonalityTrait, number> = {
  [PersonalityTrait.Conscientiousness]: 0.30,
  [PersonalityTrait.Agreeableness]: 0.25,
  [PersonalityTrait.EmotionalStability]: 0.25,
  [PersonalityTrait.Extraversion]: 0.10,
  [PersonalityTrait.Openness]: 0.10,
};

export const KEY_POSITIVE_TRAITS: PersonalityTrait[] = [
  PersonalityTrait.Conscientiousness,
  PersonalityTrait.Agreeableness,
  PersonalityTrait.EmotionalStability,
];
export const NUM_KEY_POSITIVE_TRAITS_AT_HIGH_SCORE_FOR_FLAG = 2;

// --- Data Aggregation Constants ---
export const MIN_RUNS_FOR_DYNAMIC_AVERAGE = 5;

// --- Authentication System Constants ---
export const USERS_STORAGE_KEY = 'shaulSimUsers';
export const ACCESS_CODES_STORAGE_KEY = 'shaulSimAccessCodes';
export const CURRENT_USER_EMAIL_STORAGE_KEY = 'shaulSimCurrentUserEmail';

export const INITIAL_ACCESS_CODES: AccessCode[] = [
  { code: 'SHAUL-ADMIN-001', isUsed: false, usedByEmail: null, usedAt: null },
  { code: 'SHAUL-DEMO-002', isUsed: false, usedByEmail: null, usedAt: null },
  { code: 'SHAUL-USER-A1B2', isUsed: false, usedByEmail: null, usedAt: null },
  { code: 'SHAUL-USER-C3D4', isUsed: false, usedByEmail: null, usedAt: null },
  { code: 'SHAUL-USER-E5F6', isUsed: false, usedByEmail: null, usedAt: null },
  { code: 'SHAUL-PILOT-G7H8', isUsed: false, usedByEmail: null, usedAt: null },
  { code: 'SHAUL-PILOT-I9J0', isUsed: false, usedByEmail: null, usedAt: null },
  { code: 'SHAUL-TEST-K1L2', isUsed: false, usedByEmail: null, usedAt: null },
  { code: 'SHAUL-TEST-M3N4', isUsed: false, usedByEmail: null, usedAt: null },
  { code: 'SHAUL-EXTRA-P5Q6', isUsed: false, usedByEmail: null, usedAt: null },
];
