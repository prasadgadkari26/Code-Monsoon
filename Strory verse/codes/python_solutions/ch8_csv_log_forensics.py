"""
Code Monsoon - Chapter 8: The Contractor's CSV (Round 2 Expansion)
Concept: String splitting (.split), data parsing, data forensics
SDG Alignment: Goal 16 (Peace, Justice & Strong Institutions) & Goal 11 (Sustainable Cities)

Officer Kavya Rao obtains Vantage Civic's raw sensor dump for Ward 14:
Format: "Drain Name,Raw Reading %,Reported Reading %"
Meera and BOLT parse the records to expose systemic manipulation.
Any drain where the actual raw reading was >= 70% but reported as < 70%
is identified as a fraudulent record.
"""

# CSV audit rows: "drain,raw,reported"
logs = [
    "Station Road,85,42",
    "Ganesh Chowk,35,35",
    "Market Lane,92,46",
    "Nehru Nagar,74,37",
    "River Gate,98,49",
    "Old Bazaar,40,40"
]

tampered = []

for row in logs:
    parts = row.split(",")
    drain_name = parts[0]
    raw_reading = int(parts[1])
    reported_reading = int(parts[2])
    
    # Check if a severely blocked drain was reported as clear
    if raw_reading >= 70 and reported_reading < 70:
        tampered.append(drain_name)

print(f"Tampered drains found: {len(tampered)}")
print(tampered)

if __name__ == "__main__":
    print(f"Flagged for commissioner audit: {', '.join(tampered)}")
