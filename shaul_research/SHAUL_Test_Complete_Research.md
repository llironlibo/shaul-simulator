# The SHAUL Test: Comprehensive Research Document

**What this document is:** A consolidated knowledge base on the SHAUL personality questionnaire,
integrating findings from NITE official documentation, Israeli prep center sources, Liron's internal
course materials, and 25+ peer-reviewed academic papers on personality assessment in medical/dental admissions.

**Last updated:** 2026-03-20

---

## What Is the SHAUL Test?

SHAUL (שאו"ל) — full name: שאלון אישיות למיון (Personality Questionnaire for Screening) — is a **computerized forced-choice personality questionnaire** developed and administered by **NITE (National Institute for Testing & Evaluation / טל"ם)**. It was previously known as של"ו (SHALAV); the name change was a rebranding while the test itself remained essentially the same.

It is based on the **Big Five personality model**, specifically configured to assess how well a candidate's personality fits the desired profile of a physician or dentist in Israel.

**Why:** This is the authoritative reference for what the real test is. The simulator must match these specs. The test is underserved by competitors — a key market differentiator.

**How to apply:** Every design and implementation decision for the SHAUL simulator should be validated against these real-test specs. Deviations from reality should be conscious and documented.

---

## Scope: Dental Admissions Only

Israel has exactly **2 dental schools**: Hebrew University (Hadassah) and Tel Aviv University. ~100-120 students admitted per year total. SHAUL is used at both for dental candidate selection.

Note: SHAUL is also used in medical school admissions (BIU, Ariel, Technion, etc.) but with different weights and possibly different calibration. The medical context is **not relevant** to the simulator — everything below is dental-specific.

---

## Weight in Dental Admissions

| University | SHAUL Weight | Other Components |
|---|---|---|
| HUJI dental — Interview & SHAUL Day (יום ראיונות ושאלון שאו"ל) | 15% | Interviews 70%, Animation station 15% |
| TAU dental — Stations Day (יום התחנות) | 15-20% | Interviews ~65-70%, Animation station 15% |

**Open question:** Whether the SHAUL version/calibration used for dental candidates is identical to the one used for medical candidates, or whether NITE configures it differently for the dental "ideal profile." This is unknown from public sources.

---

## Test Format — The Real Test

| Aspect | Detail | Source |
|---|---|---|
| **Format** | Forced-choice pairs of statements | NITE, all prep centers |
| **Number of pairs** | ~120 pairs (some sources say 90 — may reflect a recent reduction or version difference) | Machon Noam says 120; Fair/Mor Markam says 90 |
| **Mechanism** | Each pair presents two statements from different personality dimensions. Candidate must choose which describes them better, even if neither feels accurate. | NITE guidelines |
| **Time allocated** | 60 minutes | All sources agree |
| **Typical completion** | 15-25 minutes (most candidates finish well under the limit) | Machon Noam says ~15 min; Fair says 20-25 min |
| **Delivery** | Computerized | All sources confirm |
| **Anti-faking design** | Both statements in each pair are matched for social desirability — you can't just pick the "good" answer | Forced-choice methodology |

**Key difference from Likert-based tests:** Other personality assessments in the admissions process use 4-point Likert scales (agree/disagree). SHAUL deliberately uses paired forced-choice, which measures *relative trait strength* rather than absolute self-rating. This makes it harder to game.

---

## The Big Five Traits Assessed

| Hebrew | English | What It Captures |
|---|---|---|
| מצפוניות | Conscientiousness | Organized, reliable, disciplined, thorough, committed |
| נעימות / נועם הליכות | Agreeableness | Warm, empathetic, cooperative, patient, helpful |
| יציבות רגשית | Emotional Stability | Calm under pressure, resilient, not prone to anxiety (inverse of Neuroticism) |
| מוחצנות | Extraversion | Social energy, assertiveness, comfort in groups |
| פתיחות מחשבתית | Openness to Experience | Curiosity, creativity, receptiveness to new ideas |

---

## Scoring

- **Scale:** 150-250
- **Mean:** 200
- **Standard deviation:** 20
- **Norm-referenced:** Score reflects candidate's standing relative to all other test-takers, not an absolute measure
- **Methodology:** All selected statements are aggregated to build a 5-trait profile. Assessors compare individual scores against established standards for the ideal physician/dentist profile to determine personality-profession fit.

(Source: NITE official scoring documentation for MERAV system)

---

## What the Test Looks For (Ideal Candidate Profile)

Per prep center sources and NITE descriptions, the test seeks evidence of:
- **Reliability and conscientiousness** — following through, attention to detail
- **Interpersonal competence** — empathy, teamwork, patient care orientation
- **Emotional regulation** — composure under stress, resilience
- **Commitment to patient care** — motivation aligned with medical/dental practice

The profile is NOT "max everything." The test is calibrated for a specific desired balance of traits for the medical/dental profession.

---

## Ideal Dental Candidate Profile (From Liron's Course Materials)

Source: Internal course materials at `C:\Google_Drive\רפוש\קורס הכנה למיונים\קורס מיונים לרפואת שיניים דרייב`

### Valued Positive Traits (mapped to Big Five)

**Conscientiousness (HIGH):**
- Detail-oriented / pedantic (obsessive about small details in restorations, treatments)
- Continuous improvement / always learning
- Handles workload / stress management
- High hand-eye coordination and precision

**Agreeableness (HIGH but nuanced):**
- Caring / empathetic — but not to the point of over-identification with patient pain
- Teamwork — dentist works with assistant, technician, hygienist, receptionist
- Accepts criticism — essential for clinical learning (phantom lab, student clinic, post-doc)
- Patient and sensitive to others

**Emotional Stability (MODERATE-HIGH):**
- Calm under pressure — emergency situations, unexpected complications mid-treatment
- Resilient — can handle bad days without carrying them forward
- But some vulnerability is OK — taking things to heart shows you care

**Extraversion (MODERATE):**
- Good communication with patients and team
- Not required to be center of attention
- Can explain clearly, maintain eye contact, natural conversation

**Openness (MODERATE):**
- Curious — goes beyond textbook, explores connections (e.g., periodontal disease and heart disease)
- Creative problem-solving — non-standard anatomy, cracked roots, aesthetic restorations
- But also follows protocols — not a maverick

### Acceptable "Weak" Traits (what the test should NOT penalize heavily)
- Self-criticism (shows self-awareness)
- Overthinking
- Mild procrastination (with coping strategy)
- Difficulty with change
- Over-empathy
- Difficulty saying no
- Appearing closed-off initially
- Shyness / public speaking anxiety
- Taking things to heart
- Tunnel vision (losing big picture in details)
- Avoiding confrontation
- Indecisiveness
- Difficulty delegating

### Disqualifying Traits (what the test SHOULD detect and penalize)
- Ethical problems (dishonesty, manipulation)
- Fundamental inability to handle stress
- Inability to accept criticism
- Lack of caring / empathy
- Presenting fake weaknesses ("I'm a perfectionist" as humble-brag)

### Key Principle: Authenticity Over Perfection
The course materials emphasize that interviewers (and by extension the SHAUL) value **self-awareness and genuine self-reflection** above a perfect-looking profile. A candidate who shows real weaknesses with coping strategies scores better than one who tries to present as flawless. This maps directly to the simulator's pattern detection flags (exaggerated positive = suspicious).

### 2025 Interview Observation
In HUJI 2025 interviews, "traits were barely asked about directly" (לא נשאלו כמעט בכלל על תכונות). This suggests the **personality assessment burden is shifting to the SHAUL computerized questionnaire**, making the simulator increasingly relevant as interview time focuses on situations and case descriptions instead.

---

## Candidate Experience (From Prep Center Reports)

- Candidates report the forced-choice format is psychologically challenging: "the choice between two statements wasn't always simple"
- Many encounter pairs where neither statement feels like a good fit, yet must choose one
- The time pressure is minimal (most finish in 15-25 min) but the cognitive/emotional load of 90-120 forced choices is significant
- Common mistake: trying to "game" the test by always picking the more socially desirable option — the paired design is specifically built to prevent this

---

## Academic Evidence: Personality Assessment in Medical/Dental Admissions

### The SHAUL Gap
**No peer-reviewed papers exist validating SHAUL specifically.** NITE has not published psychometric properties, construct validity, or predictive validity for the SHAUL questionnaire. The closest evidence comes from MOR/MIRKAM assessment center research and general forced-choice personality test literature.

### Key Israeli Papers

| Paper | Key Finding | PMID |
|---|---|---|
| Ziv et al. 2008 — MOR validation | Reliability 0.80-0.88; inter-rater 0.62-0.95; ~20% change in admitted cohorts vs cognitive-only | 18823518 |
| Gafni et al. 2012 — MOR/MIRKAM reliability | Composite G=0.79 (MOR), 0.76 (MIRKAM); need 14-15 stations for G>=0.80 | 22324527 |
| Gafni et al. 2003 — Dental questionnaire | Questionnaire and interview measure common construct; percentile-based cutoffs | 12665064 |
| Dolev et al. 2019 — MOR vs EI | NO significant correlation between MOR scores and emotional intelligence | 31002640 |
| Hadad et al. 2016 — MOR/MIRKAM predictive | Peer assessment correlations: MOR r=0.39, MIRKAM r=0.37 (moderate) | — |
| Weiss et al. 1988 — Hadassah historical | Early Israeli personality assessment; cognitive strongest predictor, personality adds for clinical | 3226341 |

### Key International Findings

**Conscientiousness is THE dominant predictor:**
- Only Big Five trait correlating with MMI scores (p=0.004) — Goes et al. 2025
- Validity increases from r=0.18 to r=0.45 across medical/dental school — Li et al. 2024 meta-analysis
- Predicts surgical skill improvement r=0.36 — Hattori et al. 2023
- Facets: competence, dutifulness, achievement-oriented, self-discipline all significant

**No "ideal profile" consensus exists:**
- Up to 87 personal qualities identified as relevant; no validated model — Albanese et al. 2003
- Relationships are CURVILINEAR (can be "too conscientious") — multiple sources
- Different selection procedures systematically select different profiles — de Visser et al. 2018

**SJT/noncognitive validity increases over time; cognitive decreases:**
- SJT: r=0.05 (year 1) to r=0.20 (year 5); cognitive: r=0.45 (year 1) to r=0.18 (year 5) — Buyse & Lievens 2011
- Personality assessment pays off long-term; cognitive tests predict short-term

**Response distortion is massive:**
- Applicants inflate scores by ~1.03 SD on NEO-PI — Anglim et al. 2017
- Forced-choice reduces but doesn't eliminate faking — meta-analyses mixed
- Conscientiousness predictive validity drops from r=0.21 (students) to r=0.11 (applicants)

**Traditional dental interviews have weak predictive validity:**
- Interview scores NOT significantly correlated with OSCE performance — Park & Price 2018 (Harvard dental)
- Noncognitive admissions data showed "low yield" for predicting success — Price & Park 2018

### Forced-Choice Scoring Science

**The ipsativity problem:** Classical scoring of forced-choice data produces ipsative (within-person) scores that can't validly compare people. This is a fundamental statistical issue.

**Modern solutions:**
- Thurstonian IRT models — enable normative scoring from forced-choice responses
- MUPP (Multi-Unidimensional Pairwise-Preference) model — Stark et al. 2005
- Quasi-ipsative scoring — algebraic independence between scales while maintaining forced-choice format

**Implication for simulator:** The current scoring approach (weighted deviation from ideal profile) is a reasonable approximation, but the real SHAUL likely uses IRT-based normative scoring. Phase 3 of the roadmap (IRT/CAT) would be more scientifically accurate.

### Implications for the SHAUL Simulator

1. **Conscientiousness should be weighted highest** — strongest evidence base as predictor
2. **Avoid linear "more is better" scoring** — curvilinear relationships mean optimal ranges, not maxima
3. **"Exaggerated positive" detection is scientifically justified** — response distortion is real and large
4. **Norm-referencing is correct** — applicant-pool-specific norms are more valid than population norms
5. **Forced-choice format is the right choice** — matches real test, reduces (but doesn't eliminate) faking
6. **Long-term predictive value** — noncognitive measures predict clinical success better than cognitive ones over 5+ years

---

## Sources

- [NITE — SHAUL Personality Questionnaire (official)](https://www.nite.org.il/other-tests/shaul/?lang=en)
- [NITE — MERAV Scoring Documentation](https://www.nite.org.il/other-tests/merav/scores/?lang=en)
- [NITE — MOR/MIRKAM About the Tests](https://www.nite.org.il/other-tests/mor-mirkam/about-the-tests/?lang=en)
- [NITE — Medical School Admissions](https://www.nite.org.il/other-tests/mor-mirkam/medical-school-admissions/?lang=en)
- [Machon Noam — Personality Tests for Medicine](https://www.machon-noam.co.il/%D7%9E%D7%91%D7%97%D7%A0%D7%99-%D7%90%D7%99%D7%A9%D7%99%D7%95%D7%AA-%D7%9C%D7%99%D7%9E%D7%95%D7%93%D7%99-%D7%A8%D7%A4%D7%95%D7%90%D7%94)
- [Fair/Mor Markam — SHAUL Test Practice](https://mormarkam.co.il/%D7%AA%D7%A8%D7%92%D7%95%D7%9C-%D7%9E%D7%91%D7%97%D7%9F-%D7%A9%D7%90%D7%95%D7%9C/)
- [Hebrew University — Dental Medicine Registration](https://info.huji.ac.il/bachelor/Dental-Medicine)
- [Bar-Ilan — 4-Year Track Selection Process](https://medicine.biu.ac.il/four_year_track_selection_process)
- [Gafni et al. 2003 — Standardized questionnaire in dental admissions (PubMed)](https://pubmed.ncbi.nlm.nih.gov/12665064/)
