import csv

input_file = "data/professors.csv"   # change if needed
output_file = "facultyNames.js"

names = []

with open(input_file, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        names.append(row["full_name"].strip())

# remove duplicates + sort
names = sorted(set(names))

with open(output_file, "w", encoding="utf-8") as out:
    out.write("const facultyNames = [\n")
    for name in names:
        out.write(f'  "{name}",\n')
    out.write("];\n\nexport default facultyNames;\n")

print(f"Saved {len(names)} names to {output_file}")
