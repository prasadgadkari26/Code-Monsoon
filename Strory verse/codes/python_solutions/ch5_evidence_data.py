"""
Code Monsoon - Chapter 5: Bring Me Data
Concept: Lists, .append(), len(), max()
SDG Alignment: Goal 16 (Peace, Justice & Strong Institutions) & Goal 11 (Sustainable Cities)

At Ward 14 office, Officer Kavya Rao requires verifiable sensor data.
Vantage Civic claims zero blocked drains.
BOLT surveys 8 drains on the street. A drain at 70% water level or higher is blocked.
Meera calculates the count of blocked drains and the worst water level.
"""

# Survey readings (% capacity filled) across 8 street drains
levels = [35, 82, 91, 40, 77, 12, 95, 60]

blocked = []
for level in levels:
    if level >= 70:
        blocked.append(level)

# Dynamically calculate statistics from the filtered data
count = len(blocked)
worst = max(levels)

# Formatted evidence report for Officer Rao
print(f"{count} of {len(levels)} drains blocked. Worst: {worst}%")

if __name__ == "__main__":
    print(f"Blocked readings: {blocked}")
