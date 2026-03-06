
import { PersonalityProfile, PersonalityTrait, ScoringResults, ProfileFlag, ProfileFlagType } from '../types';
import { 
  IDEAL_DENTIST_PROFILE, 
  // AVERAGE_APPLICANT_PROFILE, // No longer directly used in fitScore calculation
  TRAIT_WEIGHTS, 
  BIG_FIVE_TRAITS,
  MAX_POSSIBLE_TRAIT_SCORE,
  SD_UNIFORMITY_THRESHOLD,
  SD_POLARIZATION_THRESHOLD,
  KEY_POSITIVE_TRAITS,
  HIGH_POSITIVE_TRAIT_SCORE_THRESHOLD,
  NUM_KEY_POSITIVE_TRAITS_AT_HIGH_SCORE_FOR_FLAG
} from '../constants';

/**
 * Calculates a weighted deviation of a given profile from an ideal profile.
 * @param profile The profile to calculate deviation for.
 * @param idealProfile The ideal profile to compare against.
 * @param weights The weights for each trait.
 * @returns The total weighted deviation.
 */
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

/**
 * Analyzes the user's profile for specific patterns.
 * @param profile The user's personality profile.
 * @returns An array of ProfileFlag objects.
 */
const checkProfilePatterns = (profile: PersonalityProfile): ProfileFlag[] => {
  const flags: ProfileFlag[] = [];
  const scores = BIG_FIVE_TRAITS.map(trait => profile[trait]);

  // Calculate Standard Deviation of scores
  const mean = scores.reduce((acc, score) => acc + score, 0) / scores.length;
  const variance = scores.reduce((acc, score) => acc + Math.pow(score - mean, 2), 0) / scores.length;
  const standardDeviation = Math.sqrt(variance);

  // Check for Highly Uniform Profile
  if (standardDeviation < SD_UNIFORMITY_THRESHOLD) {
    flags.push({
      type: ProfileFlagType.HighlyUniform,
      message: "הפרופיל שלך מציג דפוס עקבי ואחיד למדי בין התכונות השונות. זה יכול להצביע על איזון, אך כדאי לשקול אם כל ההיבטים באישיותך באו לידי ביטוי בצורה מלאה.",
      severity: 'info',
    });
  }

  // Check for Highly Polarized Profile
  if (standardDeviation > SD_POLARIZATION_THRESHOLD) {
    flags.push({
      type: ProfileFlagType.HighlyPolarized,
      message: "הפרופיל שלך מראה הבדלים משמעותיים בין רמות התכונות השונות. זה יכול לשקף חוזקות מוגדרות היטב, אך כדאי לשקול כיצד האיזון בין התכונות משפיע על התפקוד הכולל בהקשרים מגוונים.",
      severity: 'info',
    });
  }

  // Check for Potentially Exaggerated Positive Traits
  let highPositiveTraitsCount = 0;
  for (const trait of KEY_POSITIVE_TRAITS) {
    if (profile[trait] >= HIGH_POSITIVE_TRAIT_SCORE_THRESHOLD) {
      highPositiveTraitsCount++;
    }
  }

  if (highPositiveTraitsCount >= NUM_KEY_POSITIVE_TRAITS_AT_HIGH_SCORE_FOR_FLAG) {
    flags.push({
      type: ProfileFlagType.PotentiallyExaggeratedPositive,
      message: "הפרופיל שלך מציג רמות גבוהות מאוד במספר תכונות הנחשבות רצויות במיוחד. בעוד שתכונות אלו חיוביות, במבחן אמיתי חשוב לוודא שהתשובות משקפות אותך באופן אותנטי ומלא, כולל תחומים בהם אתה פחות 'מושלם' אך עדיין יעיל.",
      severity: 'warning',
    });
  }
  
  return flags;
};


/**
 * Calculates the candidate's fit score and analyzes profile patterns.
 * The fit score ranges from 150 to 250.
 *
 * @param userProfile The personality profile of the user.
 * @returns A ScoringResults object containing the fit score and profile flags.
 */
export const calculateScoringResults = (userProfile: PersonalityProfile): ScoringResults => {
  const userDeviation = calculateWeightedDeviation(userProfile, IDEAL_DENTIST_PROFILE, TRAIT_WEIGHTS);

  // Construct a hypothetical profile that is maximally different from the ideal
  const MAX_DEVIATION_PROFILE: PersonalityProfile = {
    [PersonalityTrait.Conscientiousness]: 0,
    [PersonalityTrait.Agreeableness]: 0,
    [PersonalityTrait.EmotionalStability]: 0,
    [PersonalityTrait.Extraversion]: 0,
    [PersonalityTrait.Openness]: 0,
  };

  for (const trait of BIG_FIVE_TRAITS) {
    if (IDEAL_DENTIST_PROFILE[trait] >= MAX_POSSIBLE_TRAIT_SCORE / 2) {
      MAX_DEVIATION_PROFILE[trait] = 0;
    } else {
      MAX_DEVIATION_PROFILE[trait] = MAX_POSSIBLE_TRAIT_SCORE;
    }
  }
  const maxPossibleDeviation = calculateWeightedDeviation(MAX_DEVIATION_PROFILE, IDEAL_DENTIST_PROFILE, TRAIT_WEIGHTS);

  let rawFitScore: number;

  if (maxPossibleDeviation <= 0.001) { // Avoid division by zero; implies ideal is the only profile or all deviations are zero
    rawFitScore = (userDeviation <= 0.001) ? 250 : 150; // If max deviation is 0, user must also have 0 dev for 250
  } else {
    rawFitScore = 250 - ( (userDeviation / maxPossibleDeviation) * 100 );
  }
  
  const fitScore = Math.max(150, Math.min(250, Math.round(rawFitScore)));
  const profileFlags = checkProfilePatterns(userProfile);

  return {
    fitScore,
    profileFlags,
  };
};
