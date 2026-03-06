
import { PersonalityProfile, PersonalityTrait, AccessCode } from './types';

export const BIG_FIVE_TRAITS: PersonalityTrait[] = [
  PersonalityTrait.Conscientiousness,
  PersonalityTrait.Agreeableness,
  PersonalityTrait.EmotionalStability,
  PersonalityTrait.Extraversion,
  PersonalityTrait.Openness,
];

export const TRAIT_COLORS_TAILWIND: Record<PersonalityTrait, string> = {
  [PersonalityTrait.Conscientiousness]: "bg-blue-500",
  [PersonalityTrait.Agreeableness]: "bg-green-500",
  [PersonalityTrait.EmotionalStability]: "bg-purple-500",
  [PersonalityTrait.Extraversion]: "bg-yellow-500",
  [PersonalityTrait.Openness]: "bg-pink-500",
};

export const TRAIT_COLORS_HEX: Record<PersonalityTrait, string> = {
  [PersonalityTrait.Conscientiousness]: "#3B82F6", // Tailwind blue-500
  [PersonalityTrait.Agreeableness]: "#22C55E",    // Tailwind green-500
  [PersonalityTrait.EmotionalStability]: "#A855F7", // Tailwind purple-500
  [PersonalityTrait.Extraversion]: "#EAB308",   // Tailwind yellow-500
  [PersonalityTrait.Openness]: "#EC4899",         // Tailwind pink-500
};

export const API_KEY_ERROR_MESSAGE = "מפתח ה-API של Gemini אינו מוגדר או שגוי. האפליקציה לא תוכל לספק הסברים מותאמים אישית באמצעות AI. ניתן להמשיך להשתמש בסימולטור ולקבל פרופיל אישיות בסיסי. אנא ודא שהמשתנה process.env.API_KEY מוגדר כהלכה בסביבת הפיתוח/ההרצה.";

// --- Scoring Constants ---
export const IDEAL_DENTIST_PROFILE: PersonalityProfile = {
  [PersonalityTrait.Conscientiousness]: 8,
  [PersonalityTrait.Agreeableness]: 8,
  [PersonalityTrait.EmotionalStability]: 6,
  [PersonalityTrait.Extraversion]: 4,
  [PersonalityTrait.Openness]: 4,
};
export const AVERAGE_APPLICANT_PROFILE: PersonalityProfile = {
  [PersonalityTrait.Conscientiousness]: 6,
  [PersonalityTrait.Agreeableness]: 6,
  [PersonalityTrait.EmotionalStability]: 6,
  [PersonalityTrait.Extraversion]: 6,
  [PersonalityTrait.Openness]: 6,
};
export const TRAIT_WEIGHTS: Record<PersonalityTrait, number> = {
  [PersonalityTrait.Conscientiousness]: 0.30,
  [PersonalityTrait.Agreeableness]: 0.25,
  [PersonalityTrait.EmotionalStability]: 0.25,
  [PersonalityTrait.Extraversion]: 0.10,
  [PersonalityTrait.Openness]: 0.10,
};
export const MAX_POSSIBLE_TRAIT_SCORE = 12;

// --- Profile Pattern Detection Constants ---
export const SD_UNIFORMITY_THRESHOLD = 1.5;
export const SD_POLARIZATION_THRESHOLD = 2.5;
export const KEY_POSITIVE_TRAITS: PersonalityTrait[] = [
  PersonalityTrait.Conscientiousness,
  PersonalityTrait.Agreeableness,
  PersonalityTrait.EmotionalStability,
];
export const HIGH_POSITIVE_TRAIT_SCORE_THRESHOLD = 10;
export const NUM_KEY_POSITIVE_TRAITS_AT_HIGH_SCORE_FOR_FLAG = 2;

// --- Data Aggregation Constants ---
export const MIN_RUNS_FOR_DYNAMIC_AVERAGE = 5;

// --- Authentication System Constants ---
export const USERS_STORAGE_KEY = 'shaulSimUsers';
export const ACCESS_CODES_STORAGE_KEY = 'shaulSimAccessCodes';
export const CURRENT_USER_EMAIL_STORAGE_KEY = 'shaulSimCurrentUserEmail';

export const INITIAL_ACCESS_CODES: AccessCode[] = [
  { code: 'SHAUL-ADMIN-001', isUsed: false, usedByEmail: null, usedAt: null }, // For admin/testing
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
