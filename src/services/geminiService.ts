
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

  return `אתה יועץ מומחה להכנה למבחן שאו"ל (שאלון אישיות למועמדים לרפואת שיניים).

המועמד סיים סימולציה של מבחן אישיות Big Five. הציונים (0-12, ככל שגבוה יותר - בולט יותר):
- מצפוניות: ${profileScores[PersonalityTrait.Conscientiousness]}
- נועם הליכות: ${profileScores[PersonalityTrait.Agreeableness]}
- יציבות רגשית: ${profileScores[PersonalityTrait.EmotionalStability]}
- מוחצנות: ${profileScores[PersonalityTrait.Extraversion]}
- פתיחות מחשבתית: ${profileScores[PersonalityTrait.Openness]}

הקשר חשוב: המבחן נערך כחלק מתהליך קבלה לרפואת שיניים. המועמדים נבחנים על ידי בוחנים חיצוניים (סטודנטים לרפואה ורופאי שיניים). הציון הסופי נע בין 150-250.

עבור כל תכונה, כתוב בעברית:
1. "explanation": הסבר קצר ותומך מה המשמעות של רמת הציון שקיבל.
2. "medicalRelevance": איך הבוחנים במבחן עשויים לפרש תכונה זו. תן דוגמה קונקרטית מתוך ראיון קבלה (למשל: שאלת סימולציה על מטופל מורכב, דילמה אתית, עבודת צוות).
3. "advice": תרגיל אחד ספציפי שהמועמד יכול לעשות לפני המבחן כדי לחזק תכונה זו, או טיפ קונקרטי להצגת התכונה בצורה אותנטית מול הבוחנים.

הנחיות:
- שפה תומכת ומעשית, לא גנרית
- הימנע ממשפטים כמו "זה יכול להיות חיובי או שלילי" - היה ספציפי
- כל "advice" חייב להיות תרגיל או טיפ קונקרטי, לא המלצה כללית

פלט: JSON תקין. מפתחות: "מצפוניות", "נועם הליכות", "יציבות רגשית", "מוחצנות", "פתיחות מחשבתית".
כל מפתח מכיל: "explanation", "medicalRelevance", "advice".
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
      model: "gemini-2.0-flash",
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
