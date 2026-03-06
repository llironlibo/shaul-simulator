
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { PersonalityProfile, TraitExplanations, PersonalityTrait } from '../types';
import { API_KEY_ERROR_MESSAGE } from "../constants";

// Safely access the API key from process.env
const API_KEY_FROM_ENV = (typeof process !== 'undefined' && 
                          process.env && 
                          typeof process.env.API_KEY === 'string') 
                         ? process.env.API_KEY 
                         : undefined;

let ai: GoogleGenAI | null = null;

// Initialize AI client only if the API key is present and non-empty
if (API_KEY_FROM_ENV && API_KEY_FROM_ENV.trim().length > 0) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY_FROM_ENV });
  } catch (error) {
    console.error("Error initializing GoogleGenAI with API Key:", error);
    console.warn(API_KEY_ERROR_MESSAGE); // Warn if initialization fails for some reason
    ai = null;
  }
} else {
  // This warning will be logged if API_KEY_FROM_ENV is undefined, empty, or whitespace only.
  // It covers the case where process.env.API_KEY might exist but be invalid.
  console.warn(API_KEY_ERROR_MESSAGE);
}

const constructPrompt = (profile: PersonalityProfile): string => {
  const profileScores: Partial<Record<PersonalityTrait, number>> = {};
  for (const traitKey in profile) {
    const trait = traitKey as PersonalityTrait;
    profileScores[trait] = profile[trait]; // Using raw scores as direct relative strength indicators
  }

  return `אתה עוזר וירטואלי עבור כלי הערכת אישיות למועמדים ללימודי רפואה.
המשתמש השלים סימולציה המבוססת על מודל חמש התכונות הגדולות. הציונים היחסיים שלו (ככל שהציון גבוה יותר, כך התכונה בולטת יותר בפרופיל שלו) הם:
מצפוניות: ${profileScores[PersonalityTrait.Conscientiousness]}
נועם הליכות: ${profileScores[PersonalityTrait.Agreeableness]}
יציבות רגשית: ${profileScores[PersonalityTrait.EmotionalStability]}
מוחצנות: ${profileScores[PersonalityTrait.Extraversion]}
פתיחות מחשבתית: ${profileScores[PersonalityTrait.Openness]}

עבור כל אחת מחמש התכונות, ספק בבקשה:
1.  הסבר קצר ומעודד בעברית מה משמעות רמת הציון (למשל, גבוהה, בינונית, נמוכה) עבור תכונה ספציפית זו.
2.  כיצד תכונה זו (ורמתה אצל המשתמש) רלוונטית בהקשר של מקצוע הרפואה (רופא/רופאת שיניים) בעברית.
3.  עצה מעשית אחת או שאלת רפלקציה למשתמש המבוססת על ציונו בתכונה זו, כדי לעזור לו להתכונן למבחן שאו"ל ולקריירה הרפואית שלו, בעברית.

שמור על שפה תומכת ובונה.
הפלט צריך להיות אובייקט JSON עם מפתחות עבור כל תכונה (למשל, "מצפוניות", "נועם הליכות" וכו' כפי שהם מופיעים ב-enum PersonalityTrait), כאשר כל תכונה מכילה תת-מפתחות: "explanation", "medicalRelevance", ו-"advice".

דוגמה למבנה JSON עבור תכונה אחת (אם נועם הליכות גבוה):
\`\`\`json
{
  "נועם הליכות": {
    "explanation": "ציון גבוה בנועם הליכות מצביע על נטייה טבעית לאמפתיה, שיתוף פעולה ודאגה לזולת. אתה כנראה אדם חם ואכפתי.",
    "medicalRelevance": "ברפואה, נועם הליכות חיוני לבניית אמון עם מטופלים, עבודה יעילה בצוות רפואי ויצירת סביבה טיפולית תומכת.",
    "advice": "חשוב כיצד תוכל למנף את האמפתיה הגבוהה שלך באינטראקציות מורכבות עם מטופלים, ובו זמנית לשמור על גבולות מקצועיים."
  }
}
\`\`\`
ודא שהפלט הוא JSON תקין לחלוטין.
`;
};

export const getPersonalizedExplanations = async (profile: PersonalityProfile): Promise<TraitExplanations | null> => {
  if (!ai) {
    // AI client is not initialized, either due to missing/invalid API key or initialization error.
    // The console.warn in the module scope would have already notified about the API key status.
    const fallbackExplanations: TraitExplanations = {};
    for (const traitKey in profile) {
        const trait = traitKey as PersonalityTrait;
        fallbackExplanations[trait] = {
            explanation: `לא ניתן היה לטעון הסבר מותאם אישית עבור ${trait}. ${API_KEY_ERROR_MESSAGE}`,
            medicalRelevance: "בדוק את חיבור האינטרנט שלך ואת הגדרות מפתח ה-API.",
            advice: "נסה לרענן מאוחר יותר."
        };
    }
    return fallbackExplanations;
  }

  const prompt = constructPrompt(profile);

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });
    
    let jsonStr = (response.text ?? '').trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    const parsedData = JSON.parse(jsonStr) as TraitExplanations;
    return parsedData;

  } catch (error) {
    console.error("Error fetching explanations from Gemini API:", error);
    const errorExplanations: TraitExplanations = {};
    for (const traitKey in profile) {
        const trait = traitKey as PersonalityTrait;
        errorExplanations[trait] = {
            explanation: `שגיאה בקבלת הסבר עבור ${trait}.`,
            medicalRelevance: "ייתכן שישנה בעיה בתקשורת עם שירות ה-AI.",
            advice: "אנא נסה שוב מאוחר יותר."
        };
    }
    return errorExplanations;
  }
};
