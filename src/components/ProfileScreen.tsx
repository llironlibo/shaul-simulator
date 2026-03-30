
import React from 'react';
import { PersonalityProfile, TraitExplanations, ScoringResults, ProfileFlag } from '../types';
import TraitRadarChart from './TraitRadarChart';
import ExplanationCard from './ExplanationCard';
import Button from './Button';
import { BIG_FIVE_TRAITS } from '../constants';
import LoadingSpinner from './LoadingSpinner';

interface ProfileScreenProps {
  profile: PersonalityProfile | null;
  explanations: TraitExplanations | null;
  scoringResults: ScoringResults | null;
  maxTraitScore: number;
  idealDentistProfile: PersonalityProfile;
  onRetake: () => void;
  isLoadingExplanations: boolean;
  onNavigateToGuidedReflection: () => void;
  averageProfileForDisplay: PersonalityProfile;
  apiKeyAvailable: boolean;
}

const ProfileFlagDisplay: React.FC<{ flag: ProfileFlag }> = ({ flag }) => {
  const styles = flag.severity === 'warning'
    ? "bg-amber-50 border-amber-300 text-amber-800"
    : "bg-sky-50 border-sky-300 text-sky-800";

  const label = flag.type === "HIGHLY_UNIFORM_PROFILE" ? "דפוס אחיד"
    : flag.type === "HIGHLY_POLARIZED_PROFILE" ? "דפוס מקוטב"
    : "דגש חיובי חזק";

  return (
    <div className={`p-4 rounded-xl border ${styles} mb-3`}>
      <p className="font-semibold text-sm">{label}</p>
      <p className="text-sm mt-1 opacity-90">{flag.message}</p>
    </div>
  );
};

const getScoreInterpretation = (fitScore: number): { label: string; color: string; description: string } => {
  if (fitScore >= 230) return {
    label: "התאמה גבוהה מאוד",
    color: "text-emerald-600",
    description: "הפרופיל שלך קרוב מאוד לפרופיל האידיאלי של רופא/ת שיניים. התכונות שהפגנת — במיוחד מצפוניות ונועם הליכות — מתאימות למה שהבוחנים מחפשים.",
  };
  if (fitScore >= 210) return {
    label: "התאמה טובה",
    color: "text-brand-600",
    description: "הפרופיל שלך מציג התאמה טובה. יש מרווח קטן לשיפור — עיין בתובנות למטה כדי להבין אילו תכונות כדאי לחזק.",
  };
  if (fitScore >= 190) return {
    label: "התאמה בינונית",
    color: "text-amber-600",
    description: "יש פער בין הפרופיל שלך לבין הפרופיל האידיאלי. זה לא אומר שאתה לא מתאים — אלא שיש נקודות ספציפיות לעבוד עליהן. עיין בהמלצות למטה.",
  };
  return {
    label: "יש מקום לשיפור",
    color: "text-rose-600",
    description: "הפרופיל הנוכחי רחוק יחסית מהפרופיל האידיאלי. השתמש בסימולטור כדי להבין מה הבוחנים מחפשים, ותרגל מתן תשובות אותנטיות שמדגישות את החוזקות שלך.",
  };
};


const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  explanations,
  scoringResults,
  maxTraitScore,
  idealDentistProfile,
  onRetake,
  isLoadingExplanations,
  onNavigateToGuidedReflection,
  averageProfileForDisplay,
  apiKeyAvailable
}) => {
  if (!profile || !scoringResults) {
    return <LoadingSpinner message="מכין את הפרופיל שלך..." />;
  }

  const { fitScore, profileFlags } = scoringResults;
  const interpretation = getScoreInterpretation(fitScore);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Fit Score */}
      {fitScore !== null && (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <p className="text-sm font-medium text-slate-500 mb-1">ציון התאמה משוער</p>
          <p className="text-6xl font-bold text-brand-600 mb-2">{fitScore}</p>
          <p className="text-xs text-slate-400 mb-3">בסולם 150-250</p>
          <p className={`text-lg font-semibold ${interpretation.color} mb-2`}>{interpretation.label}</p>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            {interpretation.description}
          </p>
        </div>
      )}

      {/* Radar Chart — user vs ideal vs average */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <TraitRadarChart
          profile={profile}
          maxTraitScore={maxTraitScore}
          idealProfile={idealDentistProfile}
          comparisonProfile={averageProfileForDisplay}
          comparisonProfileName="ממוצע הנבחנים"
        />
      </div>

      {/* Profile Flags */}
      {profileFlags && profileFlags.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-700">הערות על דפוס המענה</h3>
          {profileFlags.map((flag, index) => (
            <ProfileFlagDisplay key={index} flag={flag} />
          ))}
        </div>
      )}

      {/* AI Explanations */}
      <div>
        <h3 className="text-xl font-semibold text-slate-800 mb-5">תובנות על הפרופיל שלך</h3>
        {isLoadingExplanations && !explanations && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {BIG_FIVE_TRAITS.map(trait => (<ExplanationCard key={trait} trait={trait} isLoading={true} />))}
          </div>
        )}
        {explanations && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {BIG_FIVE_TRAITS.map(trait => (
              <ExplanationCard
                key={trait}
                trait={trait}
                content={explanations?.[trait]}
                isLoading={isLoadingExplanations && !explanations?.[trait]}
              />
            ))}
          </div>
        )}
        {!apiKeyAvailable && !isLoadingExplanations && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-sm text-center">
            הסברים מותאמים אישית באמצעות AI אינם זמינים כעת.
          </div>
        )}
      </div>

      {/* Self-reflection */}
      <div className="bg-brand-50 rounded-2xl p-6 sm:p-8">
        <h3 className="text-lg font-semibold text-brand-800 mb-3">תחקיר ולמידה</h3>
        <ul className="space-y-2 text-sm text-brand-700 list-disc list-inside">
          <li>האם הפרופיל תואם את איך שאתה תופס את עצמך?</li>
          <li>באילו שאלות התקשית? מדוע?</li>
          <li>אילו תכונות הפתיעו אותך ברמתן?</li>
          <li>כיצד התכונות שלך יכולות לסייע בקריירה רפואית?</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 pb-8">
        <Button onClick={onRetake} size="lg" variant="primary" className="flex-1">
          סימולציה חדשה
        </Button>
        <Button onClick={onNavigateToGuidedReflection} size="lg" variant="secondary" className="flex-1">
          תובנות לפעולה
        </Button>
      </div>
    </div>
  );
};

export default ProfileScreen;
