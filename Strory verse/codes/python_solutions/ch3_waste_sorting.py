"""
Code Monsoon - Chapter 3: Wet, Dry or Danger?
Concept: if / elif / else conditionals, boolean 'or', functions
SDG Alignment: Goal 11 (Sustainable Cities) & Goal 12 (Responsible Consumption)

Green Valley Society meets at the notice board. Aaji encourages community sorting.
BOLT sorts household waste at the gate using classification logic:
- Hazardous items (battery, medicine strip) -> RED
- Wet waste (banana peel, tea leaves, vegetable peels) -> GREEN
- Dry waste (plastic bottles, milk packets, newspapers, etc.) -> BLUE
"""

def choose_bin(item):
    # Hazardous waste
    if item == "battery" or item == "medicine strip":
        return "RED"
    # Wet organic waste
    elif item == "banana peel" or item == "tea leaves" or item == "vegetable peels":
        return "GREEN"
    # Everything else is dry recyclable/non-recyclable waste
    else:
        return "BLUE"

# Demonstration tests
if __name__ == "__main__":
    test_items = ["tea leaves", "milk packet", "battery", "banana peel", "newspaper"]
    for item in test_items:
        print(f"Item: {item:<16} -> Bin: {choose_bin(item)}")
