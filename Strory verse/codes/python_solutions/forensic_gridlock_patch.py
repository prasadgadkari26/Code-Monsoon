"""
Code Monsoon - Forensic Audit Patch: Deconstructing the GRIDLOCK Exploit
Municipal Corporation of Shantipur - Ward 14 Special Audit

This file demonstrates the before-and-after comparison of the Vantage Civic
exploit code and the municipal transparency patch.
"""

def malicious_vantage_civic_engine(levels):
    """How Vantage Civic cheated the city of Rs 4,80,00,000"""
    report = {}
    for name, level in levels.items():
        # Lie #1: Halving algorithm
        calibrated = level // 2
        # Lie #2 & #3: Impossible 100% threshold and hardcoded CLEAR
        if calibrated > 100:
            report[name] = "CLEAR"
        else:
            report[name] = "CLEAR"
    return report

def transparent_shantipur_patch(levels):
    """The repaired municipal transparency module written by Meera & BOLT"""
    report = {}
    for name, level in levels.items():
        # Truthful threshold: 70% or higher is BLOCKED
        if level >= 70:
            report[name] = "BLOCKED"
        else:
            report[name] = "CLEAR"
    return report

if __name__ == "__main__":
    test_data = {
        "Station Road": 88,
        "Ganesh Chowk": 30,
        "Market Lane": 95,
        "Nehru Nagar": 72,
        "River Gate": 99,
        "Old Bazaar": 50
    }
    
    print("=" * 60)
    print("VANTAGE CIVIC AUDIT COMPARISON REPORT")
    print("=" * 60)
    fraudulent = malicious_vantage_civic_engine(test_data)
    truthful = transparent_shantipur_patch(test_data)
    
    print(f"{'Drain Location':<18} | {'Raw Sensor':<10} | {'Vantage Fake':<14} | {'Repaired Status'}")
    print("-" * 60)
    for drain in test_data:
        print(f"{drain:<18} | {test_data[drain]:>3}%       | {fraudulent[drain]:<14} | {truthful[drain]}")
    print("=" * 60)
    print("CONCLUSION: Vantage Civic reported 0/6 blocked. Reality: 4/6 blocked.")
    print("Action taken: Contract terminated; criminal penalty issued under Section 16.")
