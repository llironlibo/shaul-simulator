
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
  onRetake: () => void;
  isLoadingExplanations: boolean;
  onNavigateToGuidedReflection: () => void;
  averageProfileForDisplay: PersonalityProfile;
  apiKeyAvailable: boolean; // New prop
}

const ProfileFlagDisplay: React.FC<{ flag: ProfileFlag }> = ({ flag }) => {
  const baseClasses = "p-4 rounded-md border-l-4 mb-3";
  const severityClasses = {
    info: "bg-sky-50 border-sky-400 text-sky-700",
    warning: "bg-yellow-50 border-yellow-400 text-yellow-700",
  };

  return (
    <div className={`${baseClasses} ${severityClasses[flag.severity]}`}>
      <p className="font-semibold">{flag.type === "HIGHLY_UNIFORM_PROFILE" ? "דפוס מענה אחיד" : flag.type === "HIGHLY_POLARIZED_PROFILE" ? "דפוס מענה מקוטב" : "דפוס מענה עם דגש חיובי חזק"}</p>
      <p className="text-sm">{flag.message}</p>
    </div>
  );
};


const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
  profile, 
  explanations, 
  scoringResults, 
  onRetake, 
  isLoadingExplanations, 
  onNavigateToGuidedReflection,
  averageProfileForDisplay,
  apiKeyAvailable 
}) => {
  if (!profile || !scoringResults) {
    return <LoadingSpinner message="מעבד נתונים ומכין את הפרופיל שלך..." />;
  }

  const { fitScore, profileFlags } = scoringResults;

  return (
    <div className="container mx-auto p-4 sm:p-8 space-y-12">
      <TraitRadarChart profile={profile} comparisonProfile={averageProfileForDisplay} comparisonProfileName="ממוצע הנבחנים" />

      {fitScore !== null && (
        <div className="mt-10 p-6 bg-white rounded-xl shadow-xl text-center">
          <h3 className="text-2xl font-semibold text-sky-700 mb-2">ציון התאמה משוער (150-250)</h3>
          <p className="text-5xl font-bold text-sky-600 mb-3">{fitScore}</p>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            ציון זה משקף את מידת ההתאמה של פרופיל האישיות שלך, כפי שעלה בסימולציה, לפרופיל אידיאלי משוער לרופא/ת שיניים. 
            הציון מנורמל ביחס לסטיית מקסימום אפשרית מהפרופיל האידיאלי. להשוואה, תוכל לראות בתרשים העכביש את פרופיל "ממוצע הנבחנים" (מבוסס על משתמשי הסימולטור או פרופיל מוערך).
            זכור, זהו כלי להערכה עצמית ולמידה, ולא מדד מוחלט להצלחה.
          </p>
        </div>
      )}

      {profileFlags && profileFlags.length > 0 && (
        <div className="mt-8 p-6 bg-white rounded-xl shadow-xl">
          <h3 className="text-xl font-semibold text-slate-700 mb-4">הערות על דפוס המענה שלך:</h3>
          {profileFlags.map((flag, index) => (
            <ProfileFlagDisplay key={index} flag={flag} />
          ))}
          <p className="text-xs text-slate-500 mt-2">
            הערות אלו נועדו לעודד רפלקציה עצמית על האופן בו אתה מגיב לשאלון. אין בהן כדי לשפוט את הפרופיל שלך, אלא להציע נקודות למחשבה.
          </p>
        </div>
      )}

      <div className="mt-12">
        <h3 className="text-3xl font-semibold text-slate-800 mb-8 text-center">תובנות על הפרופיל שלך</h3>
        {isLoadingExplanations && !explanations && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BIG_FIVE_TRAITS.map(trait => ( <ExplanationCard key={trait} trait={trait} isLoading={true} />))}
           </div>
        )}
        {explanations && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
         { !apiKeyAvailable && !isLoadingExplanations && (
             <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 text-center">
                 <p>הסברים מותאמים אישית באמצעות AI אינם זמינים כעת. ודא שמפתח ה-API מוגדר כראוי אם ברצונך להשתמש בתכונה זו.</p>
             </div>
         )}
      </div>
      
      <div className="mt-12 p-8 bg-sky-50 rounded-xl shadow-lg">
        <h3 className="text-2xl font-semibold text-sky-800 mb-4">שלב 3: תחקיר ולמידה</h3>
        <p className="text-slate-700 mb-6">
          הפרופיל, ציון ההתאמה וההערות על דפוס המענה שהתקבלו משמשים כנקודת פתיחה לתחקיר עצמי. שאל את עצמך:
        </p>
        <ul className="list-disc list-inside space-y-3 text-slate-700 mb-8 pl-4">
          <li>האם הפרופיל והציון תואמים את איך שאני תופס את עצמי ואת התאמתי?</li>
          <li>כיצד ההערות על דפוס המענה שלי (אם הוצגו) מתקשרות לבחירות שעשיתי?</li>
          <li>באילו שאלות התקשיתי במיוחד? מדוע?</li>
          <li>האם יש תכונות שהפתיעו אותי ברמתן (גבוהה או נמוכה) וכיצד הן עשויות להשפיע על ציון ההתאמה?</li>
          <li>כיצד התכונות הבולטות שלי יכולות לסייע לי במקצוע הרפואה? ובאילו תחומים אצטרך לשים לב ולהתפתח, גם לאור ציון ההתאמה ודפוסי המענה?</li>
        </ul>
        <p className="text-slate-600">
          תרגול חוזר יעזור לך לחדד את המודעות העצמית שלך ולבצע בחירות שקולות יותר, המייצגות אותך באופן האותנטי והמחמיא ביותר לדרישות המקצוע.
        </p>
      </div>

      <div className="text-center mt-12 mb-8 space-y-4 sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
        <Button onClick={onRetake} size="lg" variant="primary">
          התחל סימולציה חדשה
        </Button>
        <Button onClick={onNavigateToGuidedReflection} size="lg" variant="secondary" className="bg-teal-500 hover:bg-teal-600 text-white mr-4">
          המשך: תובנות לפעולה
        </Button>
      </div>
    </div>
  );
};

export default ProfileScreen;
