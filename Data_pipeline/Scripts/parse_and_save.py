import pdfplumber
import pandas as pd
from pathlib import Path
import re

BASE_DIR = Path(__file__).resolve().parent.parent
RAW_PDF_DIR = BASE_DIR / "samples" / "raw_pdfs"
OUTPUT_DIR = BASE_DIR / "samples" / "parsed_csv"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def extract_week(filename):
    m = re.search(r"week_(\d+)", filename.lower())
    return int(m.group(1)) if m else None

def clean_cell(cell):
    if cell is None:
        return None
    return cell.replace("\n", " ").strip()

def parse_pdf(pdf_path):
    week = extract_week(pdf_path.name)
    rows = []

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            tables = page.extract_tables()

            for table in tables:
                # skip very small tables
                if not table or len(table) < 2:
                    continue

                header = [clean_cell(c).lower() if c else "" for c in table[0]]

                # identify outbreak table by headers
                if (
                    "name of state" in " ".join(header)
                    and "disease" in " ".join(header)
                    and "no. of cases" in " ".join(header)
                ):
                    for row in table[1:]:
                        row = [clean_cell(c) for c in row]

                        try:
                            rows.append({
                                "week": week,
                                "state": row[1],
                                "district": row[2],
                                "disease": row[3],
                                "cases": int(row[4]) if row[4] else None,
                                "deaths": int(row[5]) if row[5] else None,
                                "current_status": row[8],
                                "source_file": pdf_path.name
                            })
                        except Exception:
                            # silently skip malformed rows
                            continue

    return rows

def main():
    all_rows = []

    for pdf in RAW_PDF_DIR.glob("*.pdf"):
        print(f"Processing {pdf.name}")
        all_rows.extend(parse_pdf(pdf))

    if not all_rows:
        print("No outbreak tables found.")
        return

    df = pd.DataFrame(all_rows)
    df.to_csv(OUTPUT_DIR / "idsp_outbreaks.csv", index=False)
    print("✅ Clean outbreak table saved")

if __name__ == "__main__":
    main()
