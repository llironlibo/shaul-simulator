
import learningData from '../data/learning-pool.json';
import simulationData from '../data/simulation-pool.json';
import { PersonalityTrait, Statement, ItemPair, PersonalityProfile, SimulationMode } from '../types';

// Map English trait keys (used in JSON) to PersonalityTrait enum values (Hebrew)
const TRAIT_KEY_MAP: Record<string, PersonalityTrait> = {
  Conscientiousness: PersonalityTrait.Conscientiousness,
  Agreeableness: PersonalityTrait.Agreeableness,
  EmotionalStability: PersonalityTrait.EmotionalStability,
  Extraversion: PersonalityTrait.Extraversion,
  Openness: PersonalityTrait.Openness,
};

export interface PoolConfig {
  allStatements: Statement[];
  allPairs: ItemPair[];
  maxPossibleTraitScore: number;
  idealDentistProfile: PersonalityProfile;
  averageApplicantProfile: PersonalityProfile;
  sdUniformityThreshold: number;
  sdPolarizationThreshold: number;
  highPositiveTraitScoreThreshold: number;
}

// Ideal dentist profile proportions (from original: C:8/12, A:8/12, ES:6/12, E:4/12, O:4/12)
const IDEAL_PROPORTIONS: Record<PersonalityTrait, number> = {
  [PersonalityTrait.Conscientiousness]: 2 / 3,
  [PersonalityTrait.Agreeableness]: 2 / 3,
  [PersonalityTrait.EmotionalStability]: 1 / 2,
  [PersonalityTrait.Extraversion]: 1 / 3,
  [PersonalityTrait.Openness]: 1 / 3,
};

// ~83% of max -- scores at or above this are flagged as potentially exaggerated
const HIGH_SCORE_PROPORTION = 10 / 12;

function resolvePool(rawData: typeof learningData): { statements: Statement[]; pairs: ItemPair[] } {
  const statementsById = new Map<string, Statement>();
  const statements: Statement[] = rawData.statements.map(s => {
    const stmt: Statement = {
      id: s.id,
      text: s.text,
      trait: TRAIT_KEY_MAP[s.trait],
    };
    statementsById.set(s.id, stmt);
    return stmt;
  });

  const pairs: ItemPair[] = rawData.pairs.map(p => {
    const stmtA = statementsById.get(p.statementA);
    const stmtB = statementsById.get(p.statementB);
    if (!stmtA || !stmtB) {
      throw new Error(`Invalid pair ${p.id}: statement ${p.statementA} or ${p.statementB} not found`);
    }
    return { id: p.id, statementA: stmtA, statementB: stmtB };
  });

  return { statements, pairs };
}

function buildPoolConfig(rawData: typeof learningData): PoolConfig {
  const { statements, pairs } = resolvePool(rawData);

  // Count how many times each trait appears across all pairs
  const traitCounts: Record<PersonalityTrait, number> = {
    [PersonalityTrait.Conscientiousness]: 0,
    [PersonalityTrait.Agreeableness]: 0,
    [PersonalityTrait.EmotionalStability]: 0,
    [PersonalityTrait.Extraversion]: 0,
    [PersonalityTrait.Openness]: 0,
  };
  for (const pair of pairs) {
    traitCounts[pair.statementA.trait]++;
    traitCounts[pair.statementB.trait]++;
  }

  const maxPossibleTraitScore = Math.max(...Object.values(traitCounts));

  const idealDentistProfile: PersonalityProfile = {
    [PersonalityTrait.Conscientiousness]: Math.round(IDEAL_PROPORTIONS[PersonalityTrait.Conscientiousness] * traitCounts[PersonalityTrait.Conscientiousness]),
    [PersonalityTrait.Agreeableness]: Math.round(IDEAL_PROPORTIONS[PersonalityTrait.Agreeableness] * traitCounts[PersonalityTrait.Agreeableness]),
    [PersonalityTrait.EmotionalStability]: Math.round(IDEAL_PROPORTIONS[PersonalityTrait.EmotionalStability] * traitCounts[PersonalityTrait.EmotionalStability]),
    [PersonalityTrait.Extraversion]: Math.round(IDEAL_PROPORTIONS[PersonalityTrait.Extraversion] * traitCounts[PersonalityTrait.Extraversion]),
    [PersonalityTrait.Openness]: Math.round(IDEAL_PROPORTIONS[PersonalityTrait.Openness] * traitCounts[PersonalityTrait.Openness]),
  };

  const averageApplicantProfile: PersonalityProfile = {
    [PersonalityTrait.Conscientiousness]: Math.round(traitCounts[PersonalityTrait.Conscientiousness] * 0.5),
    [PersonalityTrait.Agreeableness]: Math.round(traitCounts[PersonalityTrait.Agreeableness] * 0.5),
    [PersonalityTrait.EmotionalStability]: Math.round(traitCounts[PersonalityTrait.EmotionalStability] * 0.5),
    [PersonalityTrait.Extraversion]: Math.round(traitCounts[PersonalityTrait.Extraversion] * 0.5),
    [PersonalityTrait.Openness]: Math.round(traitCounts[PersonalityTrait.Openness] * 0.5),
  };

  const SCALE_FACTOR = maxPossibleTraitScore / 12;

  return {
    allStatements: statements,
    allPairs: pairs,
    maxPossibleTraitScore,
    idealDentistProfile,
    averageApplicantProfile,
    sdUniformityThreshold: 1.5 * SCALE_FACTOR,
    sdPolarizationThreshold: 2.5 * SCALE_FACTOR,
    highPositiveTraitScoreThreshold: Math.round(HIGH_SCORE_PROPORTION * maxPossibleTraitScore),
  };
}

// Pre-compute both pool configs at import time (both JSONs are bundled by Vite)
const poolConfigs: Record<SimulationMode, PoolConfig> = {
  [SimulationMode.Learning]: buildPoolConfig(learningData),
  [SimulationMode.Simulation]: buildPoolConfig(simulationData),
};

export function getPoolConfig(mode: SimulationMode): PoolConfig {
  return poolConfigs[mode];
}
