#!/usr/bin/env python3
"""
Expand SHAUL simulator content from 60 to 180 statements and 30 to 90 pairs.
Writes directly to questions.json.

This script was used to generate the initial expansion. It is kept as a reference
for the statement content and pairing algorithm. To modify content going forward,
edit the Google Sheet and run export_sheet_to_json.py instead.

Usage (from project root):
  python scripts/expand_content.py
"""
import json
import os

QUESTIONS_PATH = os.path.join(os.path.dirname(__file__), "..", "src", "data", "questions.json")

# 24 new statements per trait (s61-s180)
# Style: casual-formal Hebrew, dental-relevant, mix of positive and everyday framing
# Inspired by IPIP + real SHAUL reconstructions

NEW_STATEMENTS = [
    # Conscientiousness (s61-s84)
    ("s61", "אני דואג שהדברים יהיו מוכנים מראש.", "Conscientiousness"),
    ("s62", "אני בודק את העבודה שלי לפני שאני מגיש אותה.", "Conscientiousness"),
    ("s63", "אני עוקב אחרי רשימות משימות.", "Conscientiousness"),
    ("s64", "אני לא אוהב לדחות דברים למחר.", "Conscientiousness"),
    ("s65", "אני מגיע בזמן לפגישות ולמפגשים.", "Conscientiousness"),
    ("s66", "יש לי שגרה יומית שאני נצמד אליה.", "Conscientiousness"),
    ("s67", "אני שואף לעשות דברים נכון כבר בפעם הראשונה.", "Conscientiousness"),
    ("s68", "אני מסדר את החומרים שלי לפני שאני מתחיל לעבוד.", "Conscientiousness"),
    ("s69", "כשאני מקבל משימה, אני מתחיל לטפל בה מיד.", "Conscientiousness"),
    ("s70", "אני מתעד דברים חשובים כדי לא לשכוח.", "Conscientiousness"),
    ("s71", "אני מעדיף לעבוד לפי סדר עדיפויות ברור.", "Conscientiousness"),
    ("s72", "אני לא מוותר על איכות גם כשאני לחוץ בזמן.", "Conscientiousness"),
    ("s73", "אני חוזר ובודק פרטים קטנים לפני סיום.", "Conscientiousness"),
    ("s74", "אני ממלא את ההתחייבויות שלי גם כשזה לא נוח.", "Conscientiousness"),
    ("s75", "אני שומר על סביבת עבודה נקייה ומסודרת.", "Conscientiousness"),
    ("s76", "אני מציב לעצמי מטרות ועובד לקראתן בצורה שיטתית.", "Conscientiousness"),
    ("s77", "אני לומד מטעויות ומשתפר בפעם הבאה.", "Conscientiousness"),
    ("s78", "אני מקפיד לסיים שלב אחד לפני שאני עובר לבא.", "Conscientiousness"),
    ("s79", "אני שם לב כשמשהו לא תקין ומטפל בזה.", "Conscientiousness"),
    ("s80", "חשוב לי שהתוצר הסופי יהיה מושלם.", "Conscientiousness"),
    ("s81", "אני נוהג לתכנן את השבוע שלי מראש.", "Conscientiousness"),
    ("s82", "אני לוקח אחריות כשדברים לא הולכים כמתוכנן.", "Conscientiousness"),
    ("s83", "אני עובד בהתמדה גם כשהמשימה משעממת.", "Conscientiousness"),
    ("s84", "אני מוודא שאני מבין את ההנחיות לפני שאני מתחיל.", "Conscientiousness"),

    # Agreeableness (s85-s108)
    ("s85", "אני מקשיב לאנשים בלי לשפוט אותם.", "Agreeableness"),
    ("s86", "אני יודע לגרום לאנשים להרגיש בנוח.", "Agreeableness"),
    ("s87", "אני מעדיף לפתור סכסוכים בדרכי שלום.", "Agreeableness"),
    ("s88", "אני שמח כשאני יכול לעזור למישהו.", "Agreeableness"),
    ("s89", "אני מתחשב ברגשות של אחרים כשאני מקבל החלטות.", "Agreeableness"),
    ("s90", "אני נותן לאנשים הזדמנות שנייה.", "Agreeableness"),
    ("s91", "אני יודע להגיד מילה טובה בזמן הנכון.", "Agreeableness"),
    ("s92", "אני מוכן לוותר כדי לשמור על יחסים טובים.", "Agreeableness"),
    ("s93", "אני מתעניין בחיים של אנשים שאני פוגש.", "Agreeableness"),
    ("s94", "אני מנסה להבין מה עומד מאחורי התנהגות של אחרים.", "Agreeableness"),
    ("s95", "אני אדם שאנשים פונים אליו כשהם צריכים לדבר.", "Agreeableness"),
    ("s96", "אני מודה כשאני טועה ומתנצל.", "Agreeableness"),
    ("s97", "אני מכבד את הדעות של אחרים גם כשהן שונות משלי.", "Agreeableness"),
    ("s98", "אני מעדיף שיתוף פעולה על פני תחרות.", "Agreeableness"),
    ("s99", "אני שם לב כשמישהו מרגיש לא בנוח ומנסה לעזור.", "Agreeableness"),
    ("s100", "אני מביע הכרת תודה לאנשים שעוזרים לי.", "Agreeableness"),
    ("s101", "אני מתייחס בכבוד לכל אדם, ללא קשר למעמדו.", "Agreeableness"),
    ("s102", "אני מוכן להקריב מזמני כדי לתמוך בחבר.", "Agreeableness"),
    ("s103", "אני יודע לנחם אנשים כשהם עוברים תקופה קשה.", "Agreeableness"),
    ("s104", "אני חושב על ההשפעה של המעשים שלי על אחרים.", "Agreeableness"),
    ("s105", "אני מסתדר טוב עם כמעט כל אחד.", "Agreeableness"),
    ("s106", "אני מעדיף לתת מאשר לקבל.", "Agreeableness"),
    ("s107", "אני קשוב לשפת הגוף של אנשים סביבי.", "Agreeableness"),
    ("s108", "אני מאמין שרוב האנשים עושים כמיטב יכולתם.", "Agreeableness"),

    # Emotional Stability (s109-s132)
    ("s109", "אני מצליח להישאר רגוע כשדברים משתבשים.", "EmotionalStability"),
    ("s110", "אני לא מאבד את הראש במצבי חירום.", "EmotionalStability"),
    ("s111", "אני יודע להפריד בין רגשות לבין החלטות.", "EmotionalStability"),
    ("s112", "אני מתמודד עם אכזבות בלי להתמוטט.", "EmotionalStability"),
    ("s113", "אני לא נוטה לקחת דברים באופן אישי.", "EmotionalStability"),
    ("s114", "אני ישן טוב גם כשיש לי הרבה על הראש.", "EmotionalStability"),
    ("s115", "אני לא נותן ללחץ להשפיע על האיכות של העבודה שלי.", "EmotionalStability"),
    ("s116", "אני מרגיש שאני יכול להתמודד עם כל מה שיבוא.", "EmotionalStability"),
    ("s117", "מצב הרוח שלי יציב לאורך היום.", "EmotionalStability"),
    ("s118", "אני לא דואג יותר מדי לגבי דברים שלא קרו.", "EmotionalStability"),
    ("s119", "אני מצליח לשמור על אופטימיות גם בתקופות קשות.", "EmotionalStability"),
    ("s120", "אני מקבל משוב שלילי בלי להיפגע.", "EmotionalStability"),
    ("s121", "אני יודע להרגיע את עצמי כשאני מתוח.", "EmotionalStability"),
    ("s122", "אני לא נכנס ללחץ בקלות.", "EmotionalStability"),
    ("s123", "אני מסוגל לתפקד טוב גם ביום רע.", "EmotionalStability"),
    ("s124", "אני לא מרבה להשוות את עצמי לאחרים.", "EmotionalStability"),
    ("s125", "אני מרגיש ביטחון ביכולות שלי.", "EmotionalStability"),
    ("s126", "אני לא נוטה להרהר יותר מדי בדברים שכבר קרו.", "EmotionalStability"),
    ("s127", "אני מתאושש מהר אחרי יום מאתגר.", "EmotionalStability"),
    ("s128", "אני מסוגל לקבל החלטות גם תחת לחץ.", "EmotionalStability"),
    ("s129", "אני שומר על שקט פנימי גם כשסביבי כאוס.", "EmotionalStability"),
    ("s130", "אני לא נוטה לדרמטיזציה של בעיות.", "EmotionalStability"),
    ("s131", "אני מאמין שקשיים הם חלק טבעי מהחיים.", "EmotionalStability"),
    ("s132", "אני מצליח להסתכל על מצבים קשים בפרופורציה.", "EmotionalStability"),

    # Extraversion (s133-s156)
    ("s133", "אני נהנה להכיר אנשים חדשים.", "Extraversion"),
    ("s134", "אני מוצא את עצמי מוביל שיחות בקבוצה.", "Extraversion"),
    ("s135", "אני אוהב לספר סיפורים ולבדר אנשים.", "Extraversion"),
    ("s136", "אני מרגיש אנרגיה מאירועים חברתיים.", "Extraversion"),
    ("s137", "אני יוזם מפגשים חברתיים.", "Extraversion"),
    ("s138", "אני מביע את דעתי בביטחון.", "Extraversion"),
    ("s139", "אני אדם שקל להתחבר אליו.", "Extraversion"),
    ("s140", "אני נהנה לעבוד עם אנשים יותר מאשר לבד.", "Extraversion"),
    ("s141", "אני מכניס אנרגיה לחדר כשאני נכנס.", "Extraversion"),
    ("s142", "אני אוהב לחלוק את החוויות שלי עם אחרים.", "Extraversion"),
    ("s143", "אני נוטה ליזום פעולה במקום לחכות.", "Extraversion"),
    ("s144", "אני מרגיש בנוח במצבים חברתיים חדשים.", "Extraversion"),
    ("s145", "אני אוהב לתת מוטיבציה לאנשים סביבי.", "Extraversion"),
    ("s146", "אני אדם חברותי מטבעי.", "Extraversion"),
    ("s147", "אני מוצא עניין ברוב האנשים שאני פוגש.", "Extraversion"),
    ("s148", "אני לא מפחד לקחת את ההובלה.", "Extraversion"),
    ("s149", "אני נהנה מעבודה בצוות דינמי.", "Extraversion"),
    ("s150", "אני אוהב להשפיע ולהניע שינויים.", "Extraversion"),
    ("s151", "אני מרגיש חי כשאני בסביבה תוססת.", "Extraversion"),
    ("s152", "אני יודע ליצור אווירה חיובית סביבי.", "Extraversion"),
    ("s153", "אני אדם פעלתני שאוהב לעשות דברים.", "Extraversion"),
    ("s154", "אני מוכן להציג את הרעיונות שלי בפני קהל.", "Extraversion"),
    ("s155", "אני נהנה מתחרויות ואתגרים חברתיים.", "Extraversion"),
    ("s156", "אני מחפש הזדמנויות ללמוד מאנשים אחרים.", "Extraversion"),

    # Openness (s157-s180)
    ("s157", "אני נהנה לקרוא על נושאים מגוונים.", "Openness"),
    ("s158", "אני מוצא דרכים יצירתיות לפתור בעיות.", "Openness"),
    ("s159", "אני פתוח לשמוע נקודות מבט שונות.", "Openness"),
    ("s160", "אני אוהב לחשוב על דברים בצורה שונה מהרגיל.", "Openness"),
    ("s161", "אני נמשך לרעיונות חדשניים.", "Openness"),
    ("s162", "אני סקרן לגבי איך דברים עובדים.", "Openness"),
    ("s163", "אני נהנה מאתגרים אינטלקטואליים.", "Openness"),
    ("s164", "אני אוהב ללמוד מתחומים שלא קשורים ישירות לעבודה שלי.", "Openness"),
    ("s165", "אני רואה קשרים בין דברים שנראים לא קשורים.", "Openness"),
    ("s166", "אני שואל שאלות שאנשים אחרים לא חושבים לשאול.", "Openness"),
    ("s167", "אני פתוח לשנות את הדרך שבה אני עושה דברים.", "Openness"),
    ("s168", "אני מעריך מורכבות ועומק.", "Openness"),
    ("s169", "אני נהנה להתנסות בדברים חדשים.", "Openness"),
    ("s170", "אני חושב שתמיד אפשר ללמוד משהו חדש.", "Openness"),
    ("s171", "אני מתרגש מטכנולוגיות וגישות חדשות.", "Openness"),
    ("s172", "אני אוהב להעמיק בנושאים שמעניינים אותי.", "Openness"),
    ("s173", "אני מוכן לנסות גישות שלא ניסיתי בעבר.", "Openness"),
    ("s174", "אני רואה בשינויים הזדמנויות ולא איומים.", "Openness"),
    ("s175", "אני נהנה משיחות שגורמות לי לחשוב אחרת.", "Openness"),
    ("s176", "אני מחפש השראה ממקורות מגוונים.", "Openness"),
    ("s177", "אני אדם שאוהב לחקור.", "Openness"),
    ("s178", "אני מוצא עניין בדברים שאנשים רבים מתעלמים מהם.", "Openness"),
    ("s179", "אני מאמין שיש יותר מדרך אחת לפתור כל בעיה.", "Openness"),
    ("s180", "אני אוהב לגלות דברים חדשים על העולם.", "Openness"),
]

# Pair rotation pattern: C-A, ES-E, O-C, A-ES, E-O
PAIR_ROTATION = [
    ("Conscientiousness", "Agreeableness"),
    ("EmotionalStability", "Extraversion"),
    ("Openness", "Conscientiousness"),
    ("Agreeableness", "EmotionalStability"),
    ("Extraversion", "Openness"),
]


def main():
    path = os.path.normpath(QUESTIONS_PATH)
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    existing_ids = {s["id"] for s in data["statements"]}

    for sid, text, trait in NEW_STATEMENTS:
        if sid not in existing_ids:
            data["statements"].append({"id": sid, "text": text, "trait": trait})

    by_trait = {}
    for s in data["statements"]:
        by_trait.setdefault(s["trait"], []).append(s["id"])

    used_in_pairs = set()
    for p in data["pairs"]:
        used_in_pairs.add(p["statementA"])
        used_in_pairs.add(p["statementB"])

    available = {}
    for trait, ids in by_trait.items():
        available[trait] = [sid for sid in ids if sid not in used_in_pairs]

    new_pairs = []
    pair_id = 31

    for _block in range(12):
        for trait_a, trait_b in PAIR_ROTATION:
            if available[trait_a] and available[trait_b]:
                stmt_a = available[trait_a].pop(0)
                stmt_b = available[trait_b].pop(0)
                new_pairs.append({
                    "id": f"p{pair_id}",
                    "statementA": stmt_a,
                    "statementB": stmt_b,
                })
                pair_id += 1

    data["pairs"].extend(new_pairs)

    stmt_lookup = {s["id"]: s["trait"] for s in data["statements"]}
    trait_in_pairs = {}
    for p in data["pairs"]:
        ta = stmt_lookup[p["statementA"]]
        tb = stmt_lookup[p["statementB"]]
        trait_in_pairs[ta] = trait_in_pairs.get(ta, 0) + 1
        trait_in_pairs[tb] = trait_in_pairs.get(tb, 0) + 1

    print(f"Statements: {len(data['statements'])}")
    print(f"Pairs: {len(data['pairs'])}")
    print(f"\nTrait appearances in pairs:")
    for trait in sorted(trait_in_pairs.keys()):
        print(f"  {trait}: {trait_in_pairs[trait]}")

    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n[OK] Written to {path}")


if __name__ == "__main__":
    main()
