import csv

input_file = "./scripts/all_parks.csv"
output_file = "./scripts/active_state_parks.csv"

with open(input_file, newline='', encoding='utf-8') as csv_in, \
     open(output_file, 'w', newline='', encoding='utf-8') as csv_out:

    reader = csv.DictReader(csv_in)
    writer = csv.DictWriter(csv_out, fieldnames=reader.fieldnames)
    
    writer.writeheader()  # write CSV header

    count = 0
    for row in reader:
        # Filter for active state parks
        if row['active'] == '1' and 'State Park' in row['name']:
            writer.writerow(row)
            count += 1

print(f"Found {count} active state parks and saved to {output_file}")
