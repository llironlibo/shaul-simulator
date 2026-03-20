#!/usr/bin/env python3
"""
Assemble learning and simulation pools from generated content files.

Reads:
  - scripts/content/{trait}.py (LEARNING + SIMULATION lists)
  - src/data/questions.json (existing statements s1-s180)

Writes:
  - src/data/learning-pool.json  (~300 statements, ~150 pairs)
  - src/data/simulation-pool.json (~720 statements, ~360 pairs)

Usage (from project root):
  python scripts/assemble_pools.py
"""
import json
import os
import sys
import importlib.util

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
CONTENT_DIR = os.path.join(SCRIPT_DIR, "content")
DATA_DIR = os.path.join(PROJECT_DIR, "src", "data")
QUESTIONS_PATH = os.path.join(DATA_DIR, "questions.json")

TRAITS = ["Conscientiousness", "Agreeableness", "EmotionalStability", "Extraversion", "Openness"]
TRAIT_FILES = {
    "Conscientiousness": "conscientiousness.py",
    "Agreeableness": "agreeableness.py",
    "EmotionalStability": "emotional_stability.py",
    "Extraversion": "extraversion.py",
    "Openness": "openness.py",
}

# Pair rotation pattern (same as original)
PAIR_ROTATION = [
    ("Conscientiousness", "Agreeableness"),
    ("EmotionalStability", "Extraversion"),
    ("Openness", "Conscientiousness"),
    ("Agreeableness", "EmotionalStability"),
    ("Extraversion", "Openness"),
]


def load_module(path):
    """Dynamically load a Python file as a module."""
    spec = importlib.util.spec_from_file_location("mod", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def generate_pairs(statements_by_trait, pair_id_start, prefix="p"):
    """Generate balanced pairs using rotation pattern. Each statement used exactly once."""
    available = {}
    for trait, stmts in statements_by_trait.items():
        available[trait] = list(stmts)  # copy

    pairs = []
    pair_id = pair_id_start
    max_blocks = min(len(v) for v in available.values()) // 2  # each trait needs 2 slots per block

    # Actually each trait appears once per rotation cycle (in 2 of 5 pair types)
    # Per 5-pair block: each trait appears exactly 2 times
    # So max blocks = min(available per trait) // 2
    # Total pairs = blocks * 5

    block = 0
    while True:
        block_pairs = []
        can_continue = True
        for trait_a, trait_b in PAIR_ROTATION:
            if not available[trait_a] or not available[trait_b]:
                can_continue = False
                break
            stmt_a = available[trait_a].pop(0)
            stmt_b = available[trait_b].pop(0)
            block_pairs.append({
                "id": f"{prefix}{pair_id}",
                "statementA": stmt_a,
                "statementB": stmt_b,
            })
            pair_id += 1

        if not can_continue:
            break

        pairs.extend(block_pairs)
        block += 1

    return pairs


def main():
    # Load existing statements
    with open(QUESTIONS_PATH, "r", encoding="utf-8") as f:
        existing = json.load(f)

    existing_stmts = {s["id"]: s for s in existing["statements"]}

    # Split existing: s1-s60 → learning base, s61-s180 → simulation base
    learning_existing = {}
    simulation_existing = {}

    for sid, s in existing_stmts.items():
        num = int(sid.lstrip("s"))
        if num <= 60:
            learning_existing.setdefault(s["trait"], []).append(sid)
        else:
            simulation_existing.setdefault(s["trait"], []).append(sid)

    # Load new content from trait files
    learning_new_stmts = []  # list of {id, text, trait}
    simulation_new_stmts = []

    learning_id = 1000  # L1000+
    simulation_id = 2000  # S2000+

    for trait, filename in TRAIT_FILES.items():
        filepath = os.path.join(CONTENT_DIR, filename)
        if not os.path.exists(filepath):
            print(f"[WARN] Missing: {filepath} — skipping {trait}")
            continue

        mod = load_module(filepath)
        learning_texts = getattr(mod, "LEARNING", [])
        simulation_texts = getattr(mod, "SIMULATION", [])

        print(f"  {trait}: {len(learning_texts)} learning, {len(simulation_texts)} simulation")

        for text in learning_texts:
            sid = f"L{learning_id}"
            learning_new_stmts.append({"id": sid, "text": text, "trait": trait})
            learning_id += 1

        for text in simulation_texts:
            sid = f"S{simulation_id}"
            simulation_new_stmts.append({"id": sid, "text": text, "trait": trait})
            simulation_id += 1

    # Build learning pool statements
    learning_all_stmts = []
    learning_stmt_ids_by_trait = {t: [] for t in TRAITS}

    # Add existing s1-s60
    for s in existing["statements"]:
        num = int(s["id"].lstrip("s"))
        if num <= 60:
            learning_all_stmts.append(s)
            learning_stmt_ids_by_trait[s["trait"]].append(s["id"])

    # Add new learning statements
    for s in learning_new_stmts:
        learning_all_stmts.append(s)
        learning_stmt_ids_by_trait[s["trait"]].append(s["id"])

    # Build simulation pool statements
    simulation_all_stmts = []
    simulation_stmt_ids_by_trait = {t: [] for t in TRAITS}

    # Add existing s61-s180
    for s in existing["statements"]:
        num = int(s["id"].lstrip("s"))
        if num > 60:
            simulation_all_stmts.append(s)
            simulation_stmt_ids_by_trait[s["trait"]].append(s["id"])

    # Add new simulation statements
    for s in simulation_new_stmts:
        simulation_all_stmts.append(s)
        simulation_stmt_ids_by_trait[s["trait"]].append(s["id"])

    # Generate pairs
    print("\n--- Learning Pool ---")
    for t in TRAITS:
        print(f"  {t}: {len(learning_stmt_ids_by_trait[t])} statements")
    learning_pairs = generate_pairs(learning_stmt_ids_by_trait, 1, "LP")
    print(f"  Total pairs: {len(learning_pairs)}")

    print("\n--- Simulation Pool ---")
    for t in TRAITS:
        print(f"  {t}: {len(simulation_stmt_ids_by_trait[t])} statements")
    simulation_pairs = generate_pairs(simulation_stmt_ids_by_trait, 1, "SP")
    print(f"  Total pairs: {len(simulation_pairs)}")

    # Validate trait balance in pairs
    for pool_name, pairs, stmts in [("Learning", learning_pairs, learning_all_stmts), ("Simulation", simulation_pairs, simulation_all_stmts)]:
        stmt_lookup = {s["id"]: s["trait"] for s in stmts}
        trait_counts = {t: 0 for t in TRAITS}
        for p in pairs:
            trait_counts[stmt_lookup[p["statementA"]]] += 1
            trait_counts[stmt_lookup[p["statementB"]]] += 1
        print(f"\n  {pool_name} trait appearances in pairs:")
        for t in TRAITS:
            print(f"    {t}: {trait_counts[t]}")

    # Write outputs
    learning_pool = {"statements": learning_all_stmts, "pairs": learning_pairs}
    simulation_pool = {"statements": simulation_all_stmts, "pairs": simulation_pairs}

    learning_path = os.path.join(DATA_DIR, "learning-pool.json")
    simulation_path = os.path.join(DATA_DIR, "simulation-pool.json")

    with open(learning_path, "w", encoding="utf-8") as f:
        json.dump(learning_pool, f, ensure_ascii=False, indent=2)
    print(f"\n[OK] Learning pool: {learning_path}")
    print(f"     {len(learning_all_stmts)} statements, {len(learning_pairs)} pairs")

    with open(simulation_path, "w", encoding="utf-8") as f:
        json.dump(simulation_pool, f, ensure_ascii=False, indent=2)
    print(f"[OK] Simulation pool: {simulation_path}")
    print(f"     {len(simulation_all_stmts)} statements, {len(simulation_pairs)} pairs")


if __name__ == "__main__":
    main()
