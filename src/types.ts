
export enum PersonalityTrait {
  Conscientiousness = "מצפוניות",
  Agreeableness = "נועם הליכות",
  EmotionalStability = "יציבות רגשית",
  Extraversion = "מוחצנות",
  Openness = "פתיחות מחשבתית",
}

export interface Statement {
  id: string;
  text: string;
  trait: PersonalityTrait;
}

export interface ItemPair {
  id: string;
  statementA: Statement;
  statementB: Statement;
}

export interface UserChoice {
  pairId: string;
  chosenStatementId: string;
  chosenTrait: PersonalityTrait;
}

export interface PersonalityProfile {
  [PersonalityTrait.Conscientiousness]: number;
  [PersonalityTrait.Agreeableness]: number;
  [PersonalityTrait.EmotionalStability]: number;
  [PersonalityTrait.Extraversion]: number;
  [PersonalityTrait.Openness]: number;
}

export interface TraitExplanationContent {
  explanation: string;
  medicalRelevance: string;
  advice: string;
}

export interface TraitExplanations {
  [PersonalityTrait.Conscientiousness]?: TraitExplanationContent;
  [PersonalityTrait.Agreeableness]?: TraitExplanationContent;
  [PersonalityTrait.EmotionalStability]?: TraitExplanationContent;
  [PersonalityTrait.Extraversion]?: TraitExplanationContent;
  [PersonalityTrait.Openness]?: TraitExplanationContent;
}

export enum AppStage {
  Auth = "auth", // Handles login and registration
  Welcome = "welcome", // Shown after successful login/registration
  Simulation = "simulation",
  LoadingResults = "loading_results",
  Results = "results",
  Educational = "educational",
  GuidedReflection = "guided_reflection",
  Admin = "admin",
}

export enum ProfileFlagType {
  HighlyUniform = "HIGHLY_UNIFORM_PROFILE",
  HighlyPolarized = "HIGHLY_POLARIZED_PROFILE",
  PotentiallyExaggeratedPositive = "POTENTIALLY_EXAGGERATED_POSITIVE_TRAITS",
}

export interface ProfileFlag {
  type: ProfileFlagType;
  message: string;
  severity: 'info' | 'warning';
}

export interface ScoringResults {
  fitScore: number;
  profileFlags: ProfileFlag[];
}

export interface EducationalTraitInfo {
  trait: PersonalityTrait;
  title: string;
  generalDescription: string;
  medicalContext: string;
  selfReflectionQuestions: string[];
  icon?: string;
}

export type EducationalContent = Record<PersonalityTrait, EducationalTraitInfo>;

export interface StoredSimulationRun {
  id: string;
  timestamp: number;
  userProfile: PersonalityProfile;
  scoringResults: ScoringResults;
  // userChoices?: UserChoice[]; // We could also store userChoices if detailed reprocessing is ever needed
}

// --- Authentication System Types ---
export interface User {
  id: string; // email will serve as id
  name: string;
  email: string;
  phone: string;
  hashedPassword?: string; // Stored obfuscated, not truly hashed securely client-side
  registeredAt: number;
}

export interface AccessCode {
  code: string; // The unique code itself
  isUsed: boolean;
  usedByEmail: string | null;
  usedAt: number | null;
}
