"""
Code Monsoon - Chapter 6 (Boss): GRIDLOCK Debugging
Concept: Dictionaries, .items(), code auditing & bug fixes
SDG Alignment: Goal 16 (Justice & Strong Institutions) & Goal 11 (Sustainable Cities)

GRIDLOCK is the private contractor's reporting AI.
Three deliberate lies were embedded in its code:
1. Halving: `level = level // 2` secretly divided readings by two. (Removed)
2. Threshold: `if level > 100:` used an impossible 100% threshold. (Fixed to >= 70)
3. False Clear: Both branches returned "CLEAR". (Fixed to return "BLOCKED" when >= 70)

Containment over destruction: Deleting the function jams the floodgates shut.
Meera and BOLT patch the function so it truthfully reports reality.
"""

def drain_report(levels):
    report = {}
    for name, level in levels.items():
        # Correct threshold: 70% or higher is BLOCKED, otherwise CLEAR
        if level >= 70:
            report[name] = "BLOCKED"
        else:
            report[name] = "CLEAR"
    return report

if __name__ == "__main__":
    survey = {
        "Station Road": 82,
        "Ganesh Chowk": 35,
        "Market Lane": 91,
        "Nehru Nagar": 70,
        "River Gate": 95,
        "Old Bazaar": 45
    }
    audited = drain_report(survey)
    print("Repaired GRIDLOCK Ward 14 Report:")
    for drain, status in audited.items():
        print(f"  {drain:<14} -> {status}")
