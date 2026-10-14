"""Recompute a small GEO observation table locally. No API or network calls.

Input: one row per planned run from one platform/entry/protocol cohort;
metrics for technical_error must be empty.
supported_citation is 1 only if every target-domain citation in this
answer support their attached claims; it is empty when there is no such citation.
Unknown manual audit results must be completed before running this strict demo.
This script reports descriptive counts, not significance or causal effects.
SPDX-License-Identifier: MIT
"""
import argparse
import csv
from collections import defaultdict


FIELDS = {"phase", "question_id", "run_id", "status", "brand_mentioned",
          "own_domain_cited", "supported_citation"}
METRICS = ("brand_mentioned", "own_domain_cited", "supported_citation")


def read_rows(path):
    with open(path, encoding="utf-8-sig", newline="") as source:
        reader = csv.DictReader(source)
        missing = FIELDS - set(reader.fieldnames or [])
        if missing:
            raise ValueError("Missing columns: " + ", ".join(sorted(missing)))
        rows = list(reader)
    if not rows:
        raise ValueError("The table contains no planned runs.")
    # Prevent a single apparent rate from silently mixing different products
    # or observation protocols. Export separate CSVs for separate cohorts.
    for column in ("platform", "entry", "locale", "session_condition", "search_setting"):
        if column in (reader.fieldnames or []):
            values = {row.get(column) for row in rows}
            if len(values) != 1 or None in values or "" in values:
                raise ValueError(f"Column {column}: filter to one non-empty value before summarizing.")
    seen = set()
    for line, row in enumerate(rows, 2):
        if None in row or any(value is None for value in row.values()):
            raise ValueError(f"Line {line}: malformed CSV row.")
        key = tuple(row[k] for k in ("phase", "question_id", "run_id"))
        if not all(key) or key in seen:
            raise ValueError(f"Line {line}: empty or duplicate run identifier {key}.")
        seen.add(key)
        if row["status"] == "technical_error":
            if any(row[k] != "" for k in METRICS):
                raise ValueError(f"Line {line}: technical errors require empty metrics.")
        elif row["status"] == "ok":
            if any(row[k] not in {"0", "1"} for k in METRICS[:2]):
                raise ValueError(f"Line {line}: completed runs need binary mention/citation labels.")
            expected = {"0", "1"} if row["own_domain_cited"] == "1" else {""}
            if row["supported_citation"] not in expected:
                raise ValueError(f"Line {line}: complete citation audit or leave empty when not cited.")
        else:
            raise ValueError(f"Line {line}: status must be ok or technical_error.")
    return rows


def fraction(numerator, denominator):
    if not denominator:
        return "N/A (0 denominator)"
    return f"{numerator}/{denominator} ({100 * numerator / denominator:.1f}%)"


def summarize(rows):
    groups = defaultdict(list)
    for row in rows:
        groups[row["phase"]].append(row)
    result = []
    for phase, planned in groups.items():
        valid = [row for row in planned if row["status"] == "ok"]
        cited = sum(row["own_domain_cited"] == "1" for row in valid)
        supported = sum(row["supported_citation"] == "1" for row in valid)
        result.extend([
            f"[{phase}] questions={len({row['question_id'] for row in planned})} "
            f"planned={len(planned)} valid={len(valid)} errors={len(planned)-len(valid)}",
            "mention_rate=" + fraction(sum(row["brand_mentioned"] == "1" for row in valid), len(valid)),
            "citation_rate=" + fraction(cited, len(valid)),
            "supported_answer_rate=" + fraction(supported, len(valid)),
            "support_within_cited=" + fraction(supported, cited),
            "failure_rate=" + fraction(len(planned) - len(valid), len(planned)),
            "per_question_citations=" + "; ".join(
                f"{question}:" + fraction(
                    sum(row["own_domain_cited"] == "1" for row in valid if row["question_id"] == question),
                    sum(row["question_id"] == question for row in valid))
                for question in sorted({row["question_id"] for row in planned})),
            "",
        ])
    return "\n".join(result)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("csv_path")
    args = parser.parse_args()
    try:
        rows = read_rows(args.csv_path)
    except (OSError, ValueError, csv.Error) as error:
        parser.exit(2, f"Error: {error}\n")
    if any(row.get("data_kind") == "synthetic" for row in rows):
        print("SYNTHETIC TEACHING DATA - not observed platform results.\n")
    print(summarize(rows))
    print("Descriptive sample only. Repeated runs are not independent users.")


if __name__ == "__main__":
    main()
