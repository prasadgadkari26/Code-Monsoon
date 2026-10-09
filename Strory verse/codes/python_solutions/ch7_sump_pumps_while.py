"""
Code Monsoon - Chapter 7: Pumps at the Sump (Round 2 Expansion)
Concept: while loops & simulation state
SDG Alignment: Goal 6 (Clean Water & Sanitation) & Goal 11 (Sustainable Cities)

3:30 AM at the Old Sump House. Sump water is at 160 cm, threatening to breach
the 170 cm emergency floodwall and flood the substation.
Unlike a for loop (which runs a fixed number of times), a while loop runs
continuously until the measured water level drops down to safe level (30 cm or below).
In each cycle, the turbine pump lowers the level by pump_power (25 cm).
"""

# Initial conditions at the sump
water_level = 160     # cm of water in the sump tank
pump_power = 25      # cm removed per pump cycle
target_safe = 30     # safe threshold level (cm)

# Run while water remains above safe levels
while water_level > target_safe:
    water_level -= pump_power
    print(f"Pumping: level at {water_level} cm")

# Final confirmation once safe
print("Sump secured! Level safe.")

if __name__ == "__main__":
    print(f"Final water level: {water_level} cm (Safe <= {target_safe} cm)")
