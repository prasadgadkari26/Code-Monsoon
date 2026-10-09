"""
Code Monsoon - Chapter 2: Reading the Rain
Concept: Variables, Arithmetic Subtraction, and f-strings
SDG Alignment: Goal 6 (Clean Water & Sanitation) & Goal 13 (Climate Action)

BOLT plugs into Station Road's rain gauge. The rain rate is 112 mm/hr,
while the legacy drain capacity is only 65 mm/hr.
Calculate the overflow spilling onto the street using dynamic variables.
"""

# Station Road drain readings
rainfall = 112      # mm of rain this hour
capacity = 65       # drain design carrying capacity (mm/hr)

# Calculate overflow dynamically
overflow = rainfall - capacity

# Report the calculated overflow
print(f"Overflow: {overflow} mm")
