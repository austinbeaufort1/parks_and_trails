import csv

# ---------------------------
# Helper to convert names to safe badge IDs
# ---------------------------
def slugify(text):
    # lowercase, replace spaces and hyphens with underscores, remove other punctuation
    import re
    text = text.lower()
    text = re.sub(r"[^\w\s]", "", text)  # remove non-alphanumeric
    text = text.replace(" ", "_")
    return text

# ---------------------------
# Escape single quotes for SQL
# ---------------------------
def escape_sql(s):
    return s.replace("'", "''")

# ---------------------------
# Open CSV and generate SQL
# ---------------------------
input_csv = "./scripts/uscounties.csv"  # path to your CSV
output_sql = "./scripts/insert_counties.sql"

with open(input_csv, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    sql_lines = []

    for row in reader:
        county = row['county_full'].strip()      # e.g., "Prince George's County"
        state = row['state_name'].strip()        # e.g., "Maryland"
        state_id = row['state_id'].strip().lower()  # e.g., "md"

        # Generate a badge ID like 'prince_georges_county_md'
        badge_id = f"{slugify(county)}_{state_id}"

        title = f"{county}, {state}"
        description = f"Complete 3 trails in {county}, {state}"

        # Escape single quotes for SQL
        title_sql = escape_sql(title)
        description_sql = escape_sql(description)

        line = f"('{badge_id}', '{title_sql}', '{description_sql}', NULL)"
        sql_lines.append(line)

# Join all lines into one INSERT statement
with open(output_sql, "w", encoding='utf-8') as f:
    f.write("INSERT INTO badges (id, title, description, icon_svg) VALUES\n")
    f.write(",\n".join(sql_lines))
    f.write(";\n")

print(f"SQL script generated: {output_sql}")
