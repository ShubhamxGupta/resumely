# Multi-Dimensional ATS Scoring Engine Specification — Resumely

## 1. Overview

Resumely calculates a composite ATS Score $S_{total} \in [0, 100]$ across five weighted categories:

$$\text{ATS Score} = \text{Formatting}(20\%) + \text{Keywords}(25\%) + \text{Content}(25\%) + \text{Skill Validation}(15\%) + \text{ATS Compatibility}(15\%)$$

---

## 2. Component Weighting & Calculation Rules

| Category               | Max Score | Evaluation Rules & Tier Thresholds                                                                                                                                              |
| :--------------------- | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Formatting Quality** | 20.0 pts  | Presence of Experience (3.0), Education (2.0), Skills (2.0), Summary (1.5), Projects (1.5). Tiered bullet count score (up to 5.0 pts). Tiered section coverage (up to 5.0 pts). |
| **Keyword Matching**   | 25.0 pts  | Tiered volume score for resume keywords (up to 10.0 pts) & skills (up to 10.0 pts). Fuzzy match percentage against JD (up to 5.0 pts).                                          |
| **Content Quality**    | 25.0 pts  | Action verb volume score (up to 10.0 pts). Achievement & metric quantification density (percentages, currency, scale) (up to 5.0 pts). Grammar penalty deduction.               |
| **Skill Validation**   | 15.0 pts  | Percentage of listed skills validated against Experience or Project text via vector similarity (Threshold = 0.60).                                                              |
| **ATS Compatibility**  | 15.0 pts  | Single-column readability, standard fonts, absence of complex tables/text boxes, location privacy check.                                                                        |
