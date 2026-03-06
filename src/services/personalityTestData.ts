
import { ItemPair, Statement, PersonalityTrait } from '../types';

// Helper to create statements easily
const cs = (id: string, text: string, trait: PersonalityTrait): Statement => ({ id, text, trait });

// Define all statements (expanded to 60)
const statements: Statement[] = [
  // Conscientiousness (מצפוניות)
  cs('s1', 'אני תמיד מסיים משימות שהתחלתי.', PersonalityTrait.Conscientiousness),
  cs('s2', 'חשוב לי לתכנן את הדברים מראש.', PersonalityTrait.Conscientiousness),
  cs('s3', 'אני שם לב לפרטים הקטנים.', PersonalityTrait.Conscientiousness),
  cs('s4', 'אני עובד בצורה מסודרת ויעילה.', PersonalityTrait.Conscientiousness),
  cs('s5', 'אני לוקח את האחריות שלי ברצינות.', PersonalityTrait.Conscientiousness),
  cs('s6', 'אני אדם שאפשר לסמוך עליו שיבצע את המוטל עליו.', PersonalityTrait.Conscientiousness),
  cs('s31', 'אני מקפיד על סדר וארגון בסביבת העבודה שלי.', PersonalityTrait.Conscientiousness),
  cs('s32', 'אני נוטה לעמוד בלוחות זמנים.', PersonalityTrait.Conscientiousness),
  cs('s33', 'אני משקיע מאמץ כדי שהעבודה שלי תהיה מדויקת.', PersonalityTrait.Conscientiousness),
  cs('s34', 'אני מכין את עצמי היטב לפני ביצוע משימות חשובות.', PersonalityTrait.Conscientiousness),
  cs('s35', 'קשה לי להשאיר דברים לא גמורים.', PersonalityTrait.Conscientiousness),
  cs('s36', 'אני מעדיף לפעול לפי תוכנית ברורה.', PersonalityTrait.Conscientiousness),

  // Agreeableness (נועם הליכות)
  cs('s7', 'חשוב לי מאוד להבין איך אחרים מרגישים.', PersonalityTrait.Agreeableness),
  cs('s8', 'אני נוטה לסייע לאחרים גם אם זה לא נוח לי.', PersonalityTrait.Agreeableness),
  cs('s9', 'אני מאמין בטוב לבם של אנשים.', PersonalityTrait.Agreeableness),
  cs('s10', 'אני נמנע מוויכוחים ומעימותים ככל האפשר.', PersonalityTrait.Agreeableness),
  cs('s11', 'אני אדם חם ואמפתי.', PersonalityTrait.Agreeableness),
  cs('s12', 'קל לי לשתף פעולה עם אחרים.', PersonalityTrait.Agreeableness),
  cs('s37', 'אני משתדל להיות סבלני עם אנשים.', PersonalityTrait.Agreeableness),
  cs('s38', 'אני רגיש לצרכים של אחרים.', PersonalityTrait.Agreeableness),
  cs('s39', 'אני מאמין בשיתוף פעולה כדרך להשגת מטרות.', PersonalityTrait.Agreeableness),
  cs('s40', 'אני נוטה לסלוח בקלות.', PersonalityTrait.Agreeableness),
  cs('s41', 'חשוב לי לשמור על הרמוניה בקבוצה.', PersonalityTrait.Agreeableness),
  cs('s42', 'אני מנסה לראות את הדברים מנקודת מבטם של אחרים.', PersonalityTrait.Agreeableness),

  // Emotional Stability (יציבות רגשית)
  cs('s13', 'אני בדרך כלל רגוע ושלו, גם במצבי לחץ.', PersonalityTrait.EmotionalStability),
  cs('s14', 'אני לא נוטה לדאוג יותר מדי.', PersonalityTrait.EmotionalStability),
  cs('s15', 'אני מתאושש מהר ממצבי רוח רעים.', PersonalityTrait.EmotionalStability),
  cs('s16', 'אני מרגיש יציב רגשית ברוב המצבים.', PersonalityTrait.EmotionalStability),
  cs('s17', 'קשה להוציא אותי משלוותי.', PersonalityTrait.EmotionalStability),
  cs('s18', 'אני מסוגל להתמודד עם ביקורת בצורה טובה.', PersonalityTrait.EmotionalStability),
  cs('s43', 'אני לא נותן לכישלונות קטנים להשפיע עליי לאורך זמן.', PersonalityTrait.EmotionalStability),
  cs('s44', 'אני מצליח לשמור על קור רוח במצבי משבר.', PersonalityTrait.EmotionalStability),
  cs('s45', 'אני לא נוטה להתרגז בקלות.', PersonalityTrait.EmotionalStability),
  cs('s46', 'אני מרגיש בטוח בעצמי בדרך כלל.', PersonalityTrait.EmotionalStability),
  cs('s47', 'אני יכול להתמודד עם שינויים בלתי צפויים.', PersonalityTrait.EmotionalStability),
  cs('s48', 'דעות של אחרים לא מערערות אותי בקלות.', PersonalityTrait.EmotionalStability),

  // Extraversion (מוחצנות)
  cs('s19', 'אני נהנה להיות במרכז העניינים.', PersonalityTrait.Extraversion),
  cs('s20', 'אני מרגיש אנרגטי כשאני נמצא בחברת אנשים.', PersonalityTrait.Extraversion),
  cs('s21', 'קל לי ליזום שיחות עם אנשים חדשים.', PersonalityTrait.Extraversion),
  cs('s22', 'אני אוהב אירועים חברתיים גדולים.', PersonalityTrait.Extraversion),
  cs('s23', 'אני אדם דברן ופתוח.', PersonalityTrait.Extraversion),
  cs('s24', 'אני מחפש ריגושים והרפתקאות.', PersonalityTrait.Extraversion),
  cs('s49', 'אני אוהב להוביל ולהשפיע על אחרים.', PersonalityTrait.Extraversion),
  cs('s50', 'יש לי מעגל חברתי רחב.', PersonalityTrait.Extraversion),
  cs('s51', 'אני נהנה מפעילויות קבוצתיות.', PersonalityTrait.Extraversion),
  cs('s52', 'אני מרגיש בנוח לדבר בפני קהל.', PersonalityTrait.Extraversion),
  cs('s53', 'אני אדם אסרטיבי.', PersonalityTrait.Extraversion),
  cs('s54', 'אני אוהב להיות מעורב בהרבה דברים בו זמנית.', PersonalityTrait.Extraversion),
  
  // Openness (פתיחות מחשבתית)
  cs('s25', 'אני סקרן לגבי דברים חדשים ולא מוכרים.', PersonalityTrait.Openness),
  cs('s26', 'אני נהנה לחשוב על רעיונות מופשטים.', PersonalityTrait.Openness),
  cs('s27', 'יש לי דמיון מפותח.', PersonalityTrait.Openness),
  cs('s28', 'אני מעריך אמנות ויופי.', PersonalityTrait.Openness),
  cs('s29', 'אני פתוח לנסות חוויות חדשות.', PersonalityTrait.Openness),
  cs('s30', 'אני אוהב ללמוד דברים חדשים כל הזמן.', PersonalityTrait.Openness),
  cs('s55', 'אני נהנה לחקור תרבויות שונות.', PersonalityTrait.Openness),
  cs('s56', 'אני פתוח לרעיונות שנראים לא קונבנציונליים.', PersonalityTrait.Openness),
  cs('s57', 'אני אוהב לפתור בעיות מורכבות.', PersonalityTrait.Openness),
  cs('s58', 'אני מעריך יצירתיות ומקוריות.', PersonalityTrait.Openness),
  cs('s59', 'אני משנה את דעתי כאשר מוצגות לי ראיות חדשות.', PersonalityTrait.Openness),
  cs('s60', 'אני נהנה משיחות פילוסופיות עמוקות.', PersonalityTrait.Openness),
];

// Helper to find statement by ID
const getStatement = (id: string): Statement => {
  const statement = statements.find(s => s.id === id);
  if (!statement) {
    throw new Error(`Statement with id ${id} not found`);
  } else {
    return statement;
  }
}

// Create item pairs ensuring different traits in each pair for meaningful choices.
// Now 30 pairs for the simulation. Each trait appears 12 times.
export const SIMULATION_ITEMS: ItemPair[] = [
  { id: 'p1', statementA: getStatement('s1'), statementB: getStatement('s7') },   // C vs A
  { id: 'p2', statementA: getStatement('s13'), statementB: getStatement('s19') }, // ES vs E
  { id: 'p3', statementA: getStatement('s25'), statementB: getStatement('s2') },  // O vs C
  { id: 'p4', statementA: getStatement('s8'), statementB: getStatement('s14') },  // A vs ES
  { id: 'p5', statementA: getStatement('s20'), statementB: getStatement('s26') }, // E vs O
  { id: 'p6', statementA: getStatement('s3'), statementB: getStatement('s11') },  // C vs A
  { id: 'p7', statementA: getStatement('s15'), statementB: getStatement('s23') }, // ES vs E
  { id: 'p8', statementA: getStatement('s27'), statementB: getStatement('s4') },  // O vs C
  { id: 'p9', statementA: getStatement('s9'), statementB: getStatement('s17') },  // A vs ES
  { id: 'p10', statementA: getStatement('s22'), statementB: getStatement('s28') },// E vs O
  { id: 'p11', statementA: getStatement('s5'), statementB: getStatement('s12') }, // C vs A
  { id: 'p12', statementA: getStatement('s18'), statementB: getStatement('s21') },// ES vs E
  { id: 'p13', statementA: getStatement('s30'), statementB: getStatement('s6') }, // O vs C
  { id: 'p14', statementA: getStatement('s10'), statementB: getStatement('s16') },// A vs ES
  { id: 'p15', statementA: getStatement('s24'), statementB: getStatement('s29') },// E vs O
  
  // New pairs (16-30)
  { id: 'p16', statementA: getStatement('s31'), statementB: getStatement('s37') }, // C vs A
  { id: 'p17', statementA: getStatement('s43'), statementB: getStatement('s49') }, // ES vs E
  { id: 'p18', statementA: getStatement('s55'), statementB: getStatement('s32') }, // O vs C
  { id: 'p19', statementA: getStatement('s38'), statementB: getStatement('s44') }, // A vs ES
  { id: 'p20', statementA: getStatement('s50'), statementB: getStatement('s56') }, // E vs O

  { id: 'p21', statementA: getStatement('s33'), statementB: getStatement('s39') }, // C vs A
  { id: 'p22', statementA: getStatement('s45'), statementB: getStatement('s51') }, // ES vs E
  { id: 'p23', statementA: getStatement('s57'), statementB: getStatement('s34') }, // O vs C
  { id: 'p24', statementA: getStatement('s40'), statementB: getStatement('s46') }, // A vs ES
  { id: 'p25', statementA: getStatement('s52'), statementB: getStatement('s58') }, // E vs O

  { id: 'p26', statementA: getStatement('s35'), statementB: getStatement('s41') }, // C vs A
  { id: 'p27', statementA: getStatement('s47'), statementB: getStatement('s53') }, // ES vs E
  { id: 'p28', statementA: getStatement('s59'), statementB: getStatement('s36') }, // O vs C
  { id: 'p29', statementA: getStatement('s42'), statementB: getStatement('s48') }, // A vs ES
  { id: 'p30', statementA: getStatement('s54'), statementB: getStatement('s60') }, // E vs O
];

// Shuffle items for variety each time
export const getShuffledItems = (): ItemPair[] => {
  return [...SIMULATION_ITEMS].sort(() => Math.random() - 0.5);
};
