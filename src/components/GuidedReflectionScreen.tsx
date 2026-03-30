
import React from 'react';
import { PersonalityProfile, ScoringResults, PersonalityTrait, ProfileFlagType } from '../types';
import Button from './Button';
import { BIG_FIVE_TRAITS } from '../constants';

interface GuidedReflectionScreenProps {
  profile: PersonalityProfile | null;
  scoringResults: ScoringResults | null;
  maxTraitScore: number;
  onBackToResults: () => void;
  onRetakeSimulation: () => void;
}

const GuidedReflectionScreen: React.FC<GuidedReflectionScreenProps> = ({
  profile,
  scoringResults,
  maxTraitScore,
  onBackToResults,
  onRetakeSimulation,
}) => {
  if (!profile || !scoringResults) {
    return (
      <div className="p-8 text-center text-slate-700">
        טוען נתוני פרופיל... אם הודעה זו נשארת, אנא חזור אחורה ונסה שנית.
      </div>
    );
  }

  const getProfileExtremes = (): {
    highestTraits: Array<{ trait: PersonalityTrait; score: number }>;
    lowestTraits: Array<{ trait: PersonalityTrait; score: number }>;
  } => {
    let highestTraits: Array<{ trait: PersonalityTrait; score: number }> = [];
    let lowestTraits: Array<{ trait: PersonalityTrait; score: number }> = [];
    let maxScore = -1;
    let minScore = maxTraitScore + 1;

    BIG_FIVE_TRAITS.forEach(trait => {
      const score = profile[trait];
      if (score > maxScore) {
        maxScore = score;
      }
      if (score < minScore) {
        minScore = score;
      }
    });

    if (maxScore === minScore) {
        highestTraits = BIG_FIVE_TRAITS.map(trait => ({ trait, score: profile[trait]}));
        lowestTraits = [...highestTraits];
    } else {
        highestTraits = BIG_FIVE_TRAITS.filter(trait => profile[trait] === maxScore).map(trait => ({ trait, score: profile[trait]}));
        lowestTraits = BIG_FIVE_TRAITS.filter(trait => profile[trait] === minScore).map(trait => ({ trait, score: profile[trait]}));
    }
    
    return { highestTraits, lowestTraits };
  };

  const { highestTraits, lowestTraits } = getProfileExtremes();
  const { profileFlags, fitScore } = scoringResults;

  const reflectionPrompts: string[] = [];

  if (highestTraits.length > 0) {
    const highestTraitText = highestTraits.map(ht => `${ht.trait} (ניקוד: ${ht.score}/${maxTraitScore})`).join(', ');
    reflectionPrompts.push(
      `התכונה (או התכונות) הבולטת ביותר שלך היא **${highestTraitText}**. 
      כיצד תוכל למנף חוזק זה באופן מיטבי במסגרת לימודי הרפואה ובאינטראקציות עם מטופלים ועמיתים? 
      באילו מצבים תכונה זו, ברמתה הנוכחית, עשויה להציב אתגר, וכיצד תתמודד איתו באופן פרודוקטיבי?`
    );
  }

  const distinctLowestTraits = lowestTraits.filter(lt => !highestTraits.find(ht => ht.trait === lt.trait));
  if (distinctLowestTraits.length > 0) {
    const lowestTraitText = distinctLowestTraits.map(lt => `${lt.trait} (ניקוד: ${lt.score}/${maxTraitScore})`).join(', ');
    reflectionPrompts.push(
      `התכונה (או התכונות) הפחות בולטת בפרופיל שלך היא **${lowestTraitText}**. 
      באילו מצבים מקצועיים או אקדמיים היבט זה עשוי לדרוש ממך מאמץ מודע יותר או פיתוח אסטרטגיות פיצוי? 
      אילו צעדים קונקרטיים תוכל לנקוט כדי לחזק או לאזן היבט זה בהתאם לדרישות המקצוע?`
    );
  }
  
  reflectionPrompts.push(
    `ציון ההתאמה המשוער שלך הוא **${fitScore}**. 
    בהתחשב בפרופיל התכונות שלך ${profileFlags.length > 0 ? "והערות על דפוס המענה שלך" : ""}, כיצד ציון זה מתיישב עם תפיסתך את עצמך ואת התאמתך למקצוע? 
    אילו היבטים בפרופיל תרצה לחזק או לשמר כדי לשפר את ההתאמה והביטחון העצמי שלך לקראת המבחן והקריירה?`
  );


  profileFlags.forEach(flag => {
    let baseMessage = `התקבלה הערה על דפוס המענה שלך: **"${flag.message.substring(0, flag.message.indexOf('.') + 1)}"**`;
    switch (flag.type) {
      case ProfileFlagType.PotentiallyExaggeratedPositive:
        reflectionPrompts.push(
          `${baseMessage} בעוד שתכונות חיוביות הן נכס, חשוב על האופן בו אתה מציג תמונה מאוזנת ואותנטית של עצמך, כולל תחומים בהם אתה עדיין מתפתח. 
          כיצד הערה זו גורמת לך לחשוב על אסטרטגיית המענה שלך במבחן האמיתי כדי להבטיח שיקוף כן של אישיותך?`
        );
        break;
      case ProfileFlagType.HighlyUniform:
        reflectionPrompts.push(
          `${baseMessage} דפוס אחיד יכול להצביע על איזון, אך גם על נטייה פוטנציאלית שלא לבטא באופן מלא את קשת אישיותך או את התאמתך הספציפית לתכונות מסוימות. 
          האם ישנם היבטים באישיותך שלא באו לידי ביטוי מספק בשאלון? כיצד תוכל להבליט טוב יותר את ייחודיותך?`
        );
        break;
      case ProfileFlagType.HighlyPolarized:
        reflectionPrompts.push(
          `${baseMessage} דפוס מקוטב מצביע על חוזקות וחולשות ברורות. 
          כיצד תוכל להשתמש בחוזקותיך כדי לתמוך בתחומים הפחות דומיננטיים, במיוחד בהקשר של עבודת צוות רפואית או התמודדות עם מגוון רחב של מצבים קליניים?`
        );
        break;
      default:
        reflectionPrompts.push(baseMessage + " אנא שקול כיצד דפוס זה משקף את גישתך למענה על השאלון.");
    }
  });

  const actionSuggestions = [
    "שקול לדון בפרופיל שלך ובתובנות אלו עם מנטור, יועץ קריירה או עמית מהימן שמכיר את דרישות המקצוע.",
    "כתוב יומן רפלקטיבי על שניים-שלושה מהמצבים המאתגרים ביותר שאתה צופה בלימודי הרפואה או בקריירה. כיצד פרופיל האישיות שלך עשוי להשפיע על תגובתך והתמודדותך?",
    `עיין שוב בתוכן החינוכי על חמש התכונות הגדולות. התמקד במיוחד בהסברים עבור התכונה הדומיננטית ביותר שלך (${highestTraits.map(ht=>ht.trait).join(', ')}) וזו הפחות דומיננטית (${distinctLowestTraits.map(lt=>lt.trait).join(', ')}), וחשוב כיצד המידע מעשיר את הבנתך ומסייע בגיבוש אסטרטגיות.`,
    "בקש משוב מאנשים שמכירים אותך היטב (חברים, משפחה, קולגות) לגבי האופן בו הם רואים את התכונות הבולטות והפחות בולטות שלך באות לידי ביטוי. השווה זאת לתפיסתך העצמית.",
    "אם אתה מתכונן לראיונות קבלה, חשוב כיצד תוכל לתאר בכנות את חוזקותיך האישיותיות ואת התחומים בהם אתה שואף להתפתח, בהתבסס על פרופיל זה. תן דוגמאות קונקרטיות.",
    "תרגל סימולציות נוספות כדי לחדד את המודעות העצמית שלך ולבחון כיצד שינויים קטנים בתפיסה או בגישה יכולים להשפיע על הפרופיל שלך באופן שמייצג אותך טוב יותר.",
  ];
  if (profileFlags.some(flag => flag.type === ProfileFlagType.PotentiallyExaggeratedPositive)) {
    actionSuggestions.push("תרגל מענה על שאלונים תוך התמקדות בבחירת ההיגד שבאמת מתאר אותך טוב יותר, גם אם הוא פחות 'אידיאלי' על פניו. כנות ואותנטיות חשובות מאוד.")
  }


  return (
    <div className="container mx-auto p-4 sm:p-8 bg-white shadow-xl rounded-lg">
      <h2 className="text-3xl font-bold text-sky-700 mb-8 text-center">תובנות והכוונה לפעולה</h2>
      
      <div className="mb-8 p-6 bg-sky-50 rounded-lg border border-sky-200">
        <h3 className="text-xl font-semibold text-sky-600 mb-3">סיכום קצר של הפרופיל שלך:</h3>
        {highestTraits.length > 0 && (
          <p className="text-slate-700 mb-1">
            התכונה/ות הדומיננטית ביותר: <strong>{highestTraits.map(ht => `${ht.trait} (${ht.score})`).join(', ')}</strong>
          </p>
        )}
        {distinctLowestTraits.length > 0 && (
          <p className="text-slate-700">
            התכונה/ות הפחות דומיננטית: <strong>{distinctLowestTraits.map(lt => `${lt.trait} (${lt.score})`).join(', ')}</strong>
          </p>
        )}
        <p className="text-slate-700 mt-1">ציון התאמה משוער: <strong>{fitScore}</strong></p>
        {profileFlags.length > 0 && (
          <div className="mt-2">
            <p className="text-slate-700 font-medium">הערות על דפוס המענה: {profileFlags.map(f => {
                if (f.type === ProfileFlagType.HighlyPolarized) return "מקוטב";
                if (f.type === ProfileFlagType.HighlyUniform) return "אחיד";
                if (f.type === ProfileFlagType.PotentiallyExaggeratedPositive) return "הדגשה חיובית";
                return f.type;
            }).join(', ')}</p>
          </div>
        )}
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">שאלות לרפלקציה אישית:</h3>
        <ul className="list-disc list-inside space-y-4 text-slate-700 pl-5">
          {reflectionPrompts.map((prompt, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: prompt.replace(/\*\*(.*?)\*\*/g, '<strong class="text-sky-600">$1</strong>') }}></li>
          ))}
        </ul>
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">הצעות לפעולה והמשך הכנה:</h3>
        <ul className="list-decimal list-inside space-y-3 text-slate-700 pl-5">
          {actionSuggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </div>
      
      <p className="text-sm text-slate-600 mt-8 mb-6 bg-amber-50 p-4 rounded-md border-l-4 border-amber-400">
        זכור, סימולטור זה הוא כלי ללמידה והכוונה עצמית. התובנות כאן נועדו לעורר מחשבה ולסייע לך לגבש אסטרטגיית מענה אותנטית ויעילה למבחן שאו"ל. 
        ההצלחה במבחן ובקריירה הרפואית תלויה במגוון רחב של גורמים, והמודעות העצמית היא צעד חשוב בדרך.
      </p>

      <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 rtl:space-x-reverse mt-10">
        <Button onClick={onBackToResults} variant="secondary" size="lg">
          חזור לתוצאות המלאות
        </Button>
        <Button onClick={onRetakeSimulation} variant="primary" size="lg">
          בצע סימולציה חוזרת
        </Button>
      </div>
    </div>
  );
};

export default GuidedReflectionScreen;
