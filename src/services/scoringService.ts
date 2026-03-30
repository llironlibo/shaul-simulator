
import { PersonalityProfile, PersonalityTrait, ScoringResults, ProfileFlag, ProfileFlagType } from '../types';
import {
  TRAIT_WEIGHTS,
  BIG_FIVE_TRAITS,
  KEY_POSITIVE_TRAITS,
  NUM_KEY_POSITIVE_TRAITS_AT_HIGH_SCORE_FOR_FLAG
} from '../constants';
import { PoolConfig } from './configService';

const calculateWeightedDeviation = (
  profile: PersonalityProfile,
  idealProfile: PersonalityProfile,
  weights: Record<PersonalityTrait, number>
): number => {
  let totalDeviation = 0;
  for (const trait of BIG_FIVE_TRAITS) {
    const userScore = profile[trait] || 0;
    const idealScore = idealProfile[trait] || 0;
    const weight = weights[trait] || 0;
    totalDeviation += weight * Math.abs(userScore - idealScore);
  }
  return totalDeviation;
};

const checkProfilePatterns = (
  profile: PersonalityProfile,
  config: PoolConfig
): ProfileFlag[] => {
  const flags: ProfileFlag[] = [];
  const scores = BIG_FIVE_TRAITS.map(trait => profile[trait]);

  const mean = scores.reduce((acc, score) => acc + score, 0) / scores.length;
  const variance = scores.reduce((acc, score) => acc + Math.pow(score - mean, 2), 0) / scores.length;
  const standardDeviation = Math.sqrt(variance);

  if (standardDeviation < config.sdUniformityThreshold) {
    flags.push({
      type: ProfileFlagType.HighlyUniform,
      message: "הפרופיל שלך מציג דפוס אחיד למדי. במבחן שאו\"ל האמיתי, בוחנים מצפים לראות הבדלים בין תכונות — למשל, מצפוניות גבוהה יותר ממוחצנות. נסה להיות ספציפי יותר בבחירותיך ולשקף מה באמת מאפיין אותך.",
      severity: 'info',
    });
  }

  if (standardDeviation > config.sdPolarizationThreshold) {
    flags.push({
      type: ProfileFlagType.HighlyPolarized,
      message: "הפרופיל שלך מראה פערים גדולים בין התכונות. ברפואת שיניים, נדרש איזון — דיוק (מצפוניות) לצד אמפתיה (נועם הליכות) ויציבות רגשית. בדוק אם יש תכונה שהזנחת או שהגזמת בה.",
      severity: 'info',
    });
  }

  let highPositiveTraitsCount = 0;
  for (const trait of KEY_POSITIVE_TRAITS) {
    if (profile[trait] >= config.highPositiveTraitScoreThreshold) {
      highPositiveTraitsCount++;
    }
  }

  if (highPositiveTraitsCount >= NUM_KEY_POSITIVE_TRAITS_AT_HIGH_SCORE_FOR_FLAG) {
    flags.push({
      type: ProfileFlagType.PotentiallyExaggeratedPositive,
      message: "הפרופיל שלך מציג ציונים גבוהים מאוד בתכונות מפתח. במבחן שאו\"ל, הבוחנים מאומנים לזהות \"ניהול רושם\" — מועמד שנראה מושלם מדי נתפס כלא אותנטי. תרגל מתן תשובות כנות שמשלבות גם מודעות לאתגרים שלך.",
      severity: 'warning',
    });
  }

  return flags;
};

export const calculateScoringResults = (
  userProfile: PersonalityProfile,
  config: PoolConfig
): ScoringResults => {
  const userDeviation = calculateWeightedDeviation(userProfile, config.idealDentistProfile, TRAIT_WEIGHTS);

  const MAX_DEVIATION_PROFILE: PersonalityProfile = {
    [PersonalityTrait.Conscientiousness]: 0,
    [PersonalityTrait.Agreeableness]: 0,
    [PersonalityTrait.EmotionalStability]: 0,
    [PersonalityTrait.Extraversion]: 0,
    [PersonalityTrait.Openness]: 0,
  };

  for (const trait of BIG_FIVE_TRAITS) {
    if (config.idealDentistProfile[trait] >= config.maxPossibleTraitScore / 2) {
      MAX_DEVIATION_PROFILE[trait] = 0;
    } else {
      MAX_DEVIATION_PROFILE[trait] = config.maxPossibleTraitScore;
    }
  }
  const maxPossibleDeviation = calculateWeightedDeviation(MAX_DEVIATION_PROFILE, config.idealDentistProfile, TRAIT_WEIGHTS);

  let rawFitScore: number;

  if (maxPossibleDeviation <= 0.001) {
    rawFitScore = (userDeviation <= 0.001) ? 250 : 150;
  } else {
    rawFitScore = 250 - ( (userDeviation / maxPossibleDeviation) * 100 );
  }

  const fitScore = Math.max(150, Math.min(250, Math.round(rawFitScore)));
  const profileFlags = checkProfilePatterns(userProfile, config);

  return {
    fitScore,
    profileFlags,
  };
};
