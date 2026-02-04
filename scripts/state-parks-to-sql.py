import csv
import re

input_file = "./scripts/active_state_parks.csv"
output_file = "./scripts/insert_state_park_badges.sql"

def escape_sql(text):
    """Escape single quotes for SQL."""
    return text.replace("'", "''")

def add_state_park_suffix(name):
    """Append 'State Park' if not already present at the end."""
    return name if name.strip().lower().endswith("state park") else f"{name} State Park"

def clean_id_for_sql(name, state_code):
    """Generate a safe, unique ID for SQL."""
    # Remove 'State Park' if it exists at the end
    base_name = re.sub(r'\s*state park$', '', name.strip(), flags=re.IGNORECASE)
    # Lowercase and replace non-alphanumeric characters with underscores
    safe_name = re.sub(r'\W+', '_', base_name.lower())
    # Append state code and "_state_park" suffix
    return f"{safe_name}_{state_code}_state_park"

with open(input_file, newline='', encoding='utf-8') as csv_in, \
     open(output_file, 'w', encoding='utf-8') as sql_out:

    reader = csv.DictReader(csv_in)
    count = 0
    for row in reader:
        name = row['name']
        # Extract state code from locationDesc (US-PA → PA)
        state_code = row['locationDesc'].split('-')[-1].lower()

        # Generate unique ID
        park_id = clean_id_for_sql(name, state_code)

        # Generate title and description
        title = escape_sql(add_state_park_suffix(name))
        description = escape_sql(f"completed 2 trails and visited {add_state_park_suffix(name)}")

        # Static icon and points
        icon = "state_park.svg"
        points = 0

        # Write INSERT statement
        sql_line = f"INSERT INTO badges (id, title, description, icon_svg, points) VALUES ('{park_id}', '{title}', '{description}', '{icon}', {points});\n"
        sql_out.write(sql_line)
        count += 1

print(f"SQL script generated safely with {count} active state parks: {output_file}")
