
import questionsData from '../data/questions.json';
import { PersonalityTrait, Statement, ItemPair, PersonalityProfile } from '../types';

// Map English trait keys (used in JSON) to PersonalityTrait enum values (Hebrew)
const TRAIT_KEY_MAP: Record<string, PersonalityTrait> = {
  Conscientiousness: PersonalityTrait.Conscientiousness,
  Agreeableness: PersonalityTrait.Agreeableness,
  EmotionalStability: PersonalityTrait.EmotionalStability,
  Extraversion: PersonalityTrait.Extraversion,
  Openness: PersonalityTrait.Openness,
};

// Resolve raw JSON statements to typed Statement objects
const statementsById = new Map<string, Statement>();
export const allStatements: Statement[] = questionsData.statements.map(s => {
  const stmt: Statement = {
    id: s.id,
    text: s.text,
    trait: TRAIT_KEY_MAP[s.trait],
  };
  statementsById.set(s.id, stmt);
  return stmt;
});

// Resolve raw JSON pairs to typed ItemPair objects
export const allPairs: ItemPair[] = questionsData.pairs.map(p => {
  const stmtA = statementsById.get(p.statementA);
  const stmtB = statementsById.get(p.statementB);
  if (!stmtA || !stmtB) {
    throw new Error(`Invalid pair ${p.id}: statement ${p.statementA} or ${p.statementB} not found`);
  }
  return { id: p.id, statementA: stmtA, statementB: stmtB };
});

// Count how many times each trait appears across all pairs
function computeTraitCounts(): Record<PersonalityTrait, number> {
  const counts: Record<PersonalityTrait, number> = {
    [PersonalityTrait.Conscientiousness]: 0,
    [PersonalityTrait.Agreeableness]: 0,
    [PersonalityTrait.EmotionalStability]: 0,
    [PersonalityTrait.Extraversion]: 0,
    [PersonalityTrait.Openness]: 0,
  };
  for (const pair of allPairs) {
    counts[pair.statementA.trait]++;
    counts[pair.statementB.trait]++;
  }
  return counts;
}

export const traitCounts = computeTraitCounts();

// Max possible score per trait = number of pairs containing that trait
export const maxPossibleTraitScore = Math.max(...Object.values(traitCounts));

// Ideal dentist profile proportions (from original: C:8/12, A:8/12, ES:6/12, E:4/12, O:4/12)
const IDEAL_PROPORTIONS: Record<PersonalityTrait, number> = {
  [PersonalityTrait.Conscientiousness]: 2 / 3,
  [PersonalityTrait.Agreeableness]: 2 / 3,
  [PersonalityTrait.EmotionalStability]: 1 / 2,
  [PersonalityTrait.Extraversion]: 1 / 3,
  [PersonalityTrait.Openness]: 1 / 3,
};

export const idealDentistProfile: PersonalityProfile = {
  [PersonalityTrait.Conscientiousness]: Math.round(IDEAL_PROPORTIONS[PersonalityTrait.Conscientiousness] * traitCounts[PersonalityTrait.Conscientiousness]),
  [PersonalityTrait.Agreeableness]: Math.round(IDEAL_PROPORTIONS[PersonalityTrait.Agreeableness] * traitCounts[PersonalityTrait.Agreeableness]),
  [PersonalityTrait.EmotionalStability]: Math.round(IDEAL_PROPORTIONS[PersonalityTrait.EmotionalStability] * traitCounts[PersonalityTrait.EmotionalStability]),
  [PersonalityTrait.Extraversion]: Math.round(IDEAL_PROPORTIONS[PersonalityTrait.Extraversion] * traitCounts[PersonalityTrait.Extraversion]),
  [PersonalityTrait.Openness]: Math.round(IDEAL_PROPORTIONS[PersonalityTrait.Openness] * traitCounts[PersonalityTrait.Openness]),
};

// Average applicant: 50% of max for each trait
export const averageApplicantProfile: PersonalityProfile = {
  [PersonalityTrait.Conscientiousness]: Math.round(traitCounts[PersonalityTrait.Conscientiousness] * 0.5),
  [PersonalityTrait.Agreeableness]: Math.round(traitCounts[PersonalityTrait.Agreeableness] * 0.5),
  [PersonalityTrait.EmotionalStability]: Math.round(traitCounts[PersonalityTrait.EmotionalStability] * 0.5),
  [PersonalityTrait.Extraversion]: Math.round(traitCounts[PersonalityTrait.Extraversion] * 0.5),
  [PersonalityTrait.Openness]: Math.round(traitCounts[PersonalityTrait.Openness] * 0.5),
};

// Thresholds that auto-scale with pair count
const SCALE_FACTOR = maxPossibleTraitScore / 12;
export const sdUniformityThreshold = 1.5 * SCALE_FACTOR;
export const sdPolarizationThreshold = 2.5 * SCALE_FACTOR;
// ~83% of max — scores at or above this are flagged as potentially exaggerated
const HIGH_SCORE_PROPORTION = 10 / 12;
export const highPositiveTraitScoreThreshold = Math.round(HIGH_SCORE_PROPORTION * maxPossibleTraitScore);
