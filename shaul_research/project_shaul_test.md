---
name: The SHAUL personality test - what it actually is
description: Research-backed knowledge base on the real SHAUL (שאו"ל, formerly של"ו) Big Five personality questionnaire used in Israeli medical and dental admissions, based on NITE documentation and prep center sources
type: project
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

| University                                                     | SHAUL Weight | Other Components                          |
| -------------------------------------------------------------- | ------------ | ----------------------------------------- |
| HUJI dental — Interview & SHAUL Day (יום ראיונות ושאלון שאו"ל) | 15%          | Interviews 70%, Animation station 15%     |
| TAU dental — Stations Day (יום התחנות)                         | 15-20%       | Interviews ~65-70%, Animation station 15% |

**Open question:** Whether the SHAUL version/calibration used for dental candidates is identical to the one used for medical candidates, or whether NITE configures it differently for the dental "ideal profile." This is unknown from public sources.

---

## Test Format — The Real Test

| Aspect                 | Detail                                                                                                                                                      | Source                                        |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| **Format**             | Forced-choice pairs of statements                                                                                                                           | NITE, all prep centers                        |
| **Number of pairs**    | ~120 pairs (some sources say 90 — may reflect a recent reduction or version difference)                                                                     | Machon Noam says 120; Fair/Mor Markam says 90 |
| **Mechanism**          | Each pair presents two statements from different personality dimensions. Candidate must choose which describes them better, even if neither feels accurate. | NITE guidelines                               |
| **Time allocated**     | 60 minutes                                                                                                                                                  | All sources agree                             |
| **Typical completion** | 15-25 minutes (most candidates finish well under the limit)                                                                                                 | Machon Noam says ~15 min; Fair says 20-25 min |
| **Delivery**           | Computerized                                                                                                                                                | All sources confirm                           |
| **Anti-faking design** | Both statements in each pair are matched for social desirability — you can't just pick the "good" answer                                                    | Forced-choice methodology                     |

**Key difference from Likert-based tests:** Other personality assessments in the admissions process use 4-point Likert scales (agree/disagree). SHAUL deliberately uses paired forced-choice, which measures *relative trait strength* rather than absolute self-rating. This makes it harder to game.

---

## The Big Five Traits Assessed

| Hebrew               | English                | What It Captures                                                              |
| -------------------- | ---------------------- | ----------------------------------------------------------------------------- |
| מצפוניות             | Conscientiousness      | Organized, reliable, disciplined, thorough, committed                         |
| נעימות / נועם הליכות | Agreeableness          | Warm, empathetic, cooperative, patient, helpful                               |
| יציבות רגשית         | Emotional Stability    | Calm under pressure, resilient, not prone to anxiety (inverse of Neuroticism) |
| מוחצנות              | Extraversion           | Social energy, assertiveness, comfort in groups                               |
| פתיחות מחשבתית       | Openness to Experience | Curiosity, creativity, receptiveness to new ideas                             |

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

## Candidate Experience (From Prep Center Reports)

- Candidates report the forced-choice format is psychologically challenging: "the choice between two statements wasn't always simple"
- Many encounter pairs where neither statement feels like a good fit, yet must choose one
- The time pressure is minimal (most finish in 15-25 min) but the cognitive/emotional load of 90-120 forced choices is significant
- Common mistake: trying to "game" the test by always picking the more socially desirable option — the paired design is specifically built to prevent this

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
