"""
Code Monsoon - Chapter 4: Twelve Drains Before Dawn
Concept: for loops & range()
SDG Alignment: Goal 6 (Clean Water & Sanitation) & Goal 11 (Sustainable Cities)

11:40 PM. Storm arrives at 5 AM. Rafiq's beat has 12 drains.
Instead of typing commands 12 times, Meera and BOLT automate the sweep
with a loop over range(1, 13), printing the completion signal once outside the loop.
"""

# Clear drains 1 through 12 in order
for drain in range(1, 13):
    print(f"Clearing drain {drain}")

# Printed once after the loop finishes
print("Beat complete!")
