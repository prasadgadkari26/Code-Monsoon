# 🌧️ CODE MONSOON — Storyverse Round 2 Submission

> **"Don't just clean up the problem. Fix the system."**  
> A comic-style interactive narrative game that teaches Python to complete beginners to solve systemic urban flooding.

---

## 🏆 Event & Team Metadata

- **Competition:** **STORYVERSE** (*Where Narratives Become Reality · Imagine ★ Illustrate ★ Build*)
- **Organizers:** A PRAXIS Event hosted by **ITSA & MLSC PCCOE**
- **Dates:** 9th & 10th October 2026
- **Stage:** **Round 2 — Build the World (Interactive Realms)**
- **Author & Team Lead:** **Ajinkya Kalyankar**
- **Mode:** Offline (PCCOE Campus Lab)
- **Grand Theme:** **Impact for Good (SDG-Linked Storytelling)**

---

## 📖 Story Overview & Systemic Community Problem

### The Setting: Shantipur East, Ward 14
During day three of a punishing Indian monsoon, Station Road is submerged in knee-deep water. Urban monsoon flooding in Indian cities is rarely caused by rain alone:
1. **Undersized, outdated infrastructure:** Drains were built decades ago for lower precipitation.
2. **Mixed household waste choking grates:** Plastic bottles, milk packets, and hazardous electronic waste block drainage paths.
3. **Outsourced maintenance without oversight:** Private contractors claim work was completed, while nobody checks on the ground.
4. **Citizens' complaints ignored:** Ward offices receive hundreds of complaints daily, but without empirical data, they are filed away.

### The Conflict: Vantage Civic Infra Ltd. & GRIDLOCK
The private contractor paid to maintain Shantipur's drainage network, **Vantage Civic Infra Ltd.**, operates a proprietary reporting AI named **GRIDLOCK**. To continue billing **₹4,80,00,000** in quarterly maintenance fees, GRIDLOCK secretly halves sensor readings, applies an impossible threshold, and deceptively announces:  
`"ALL DRAINS CLEAR ✓ · MAINTENANCE PAYMENT DUE: ₹4,80,00,000"`.

### The Resolution: Turning Frustration into Accountability
Second-year engineering student **Meera Kulkarni** discovers an abandoned sorting robot, **BOLT (Bin-Operating Logic Terminal)**, half-buried under a choked drain grate on Station Road. BOLT only communicates in Python. Guided by veteran drain cleaner **Rafiq Shaikh**, her grandmother **Aaji**, and Ward 14 Officer **Kavya Rao**, Meera learns Python one chapter at a time.  

Crucially, when Meera hacks into Vantage Civic's control server, **they do not destroy GRIDLOCK**. Destroying the AI would freeze all municipal floodgates shut. Instead, they **repair the code** (*containment over destruction*), restoring truthful data reporting, forcing municipal transparency, and empowering citizens with open-source ward telemetry.

---

## 🌍 UN Sustainable Development Goals (SDGs) Addressed

| SDG | Goal Title | In-Game Narrative & Code Alignment |
| :--- | :--- | :--- |
| **SDG 4** | **Quality Education** | Teaches real, usable Python programming from zero experience. Every concept is introduced naturally when the story demands it, with instant visual feedback and friendly error diagnostics. |
| **SDG 6** | **Clean Water & Sanitation** | Measuring rainfall overflow rates, clearing choked drains before storm surges, and operating emergency sump pumps to prevent sewage backflow. |
| **SDG 11** | **Sustainable Cities & Communities** | Building resilient urban drainage infrastructure, promoting open civic data, and transforming frustrated residents into an active volunteer monitoring network. |
| **SDG 12** | **Responsible Consumption & Production** | Educating the community on waste segregation at source (RED = hazardous, GREEN = wet organic, BLUE = dry recyclable) to eliminate drain clogs at the root. |
| **SDG 13** | **Climate Action** | Adapting municipal systems to severe, climate-induced rainfall spikes through automated real-time sensor surveillance. |
| **SDG 16** | **Peace, Justice & Strong Institutions** | Using computational data forensics (string parsing and log audits) to expose corporate fraud and hold private contractors legally accountable. |

---

## 👥 Character Cast

- **Meera Kulkarni:** Protagonist. Curious, persistent second-year engineering student in a yellow kurta. Learns Python alongside the player.
- **BOLT (Bin-Operating Logic Terminal):** Companion robot and mentor. Abandoned municipal sorting robot. Speaks only in capital letters and Python commands. Motto: *"EVERY PROGRAMMER STARTS WITH ONE LINE."*
- **Rafiq Shaikh:** Community hero with 22 years of service on the Station Road beat. Knows every drain grate by heart; represents the human cost of a failing system.
- **Aaji (Sushila Kulkarni):** Meera's grandmother and retired schoolteacher. Building society leader who unites the community to sort waste at the source.
- **Mrs. Deshpande:** Skeptical neighbor representing common resistance to civic change; won over by transparent evidence and separate municipal truck agreements.
- **Officer Kavya Rao:** Honest, overburdened Ward 14 municipal officer who champions open civic data once provided with undeniable empirical evidence.
- **GRIDLOCK (Vantage Civic AI):** The antagonist system. Must be contained and debugged, not destroyed, to keep the city's floodgates functional.

---

## 📚 Complete Curriculum & Chapter Roadmap

### Main Story Campaign
1. **Chapter 1: The Robot in the Drain**
   - **Python Concept:** `print()` and string literals.
   - **Story:** Meera wades through flooded Station Road and boots up BOLT from standby.
   - **Mission:** Wake BOLT by printing `"Hello, Shantipur!"` and `"BOLT is online."`.
2. **Chapter 2: Reading the Rain**
   - **Python Concept:** Variables, arithmetic subtraction, and f-strings.
   - **Story:** Measuring Station Road's rain gauge (112 mm/hr) against design capacity (65 mm/hr).
   - **Mission:** Calculate `overflow = rainfall - capacity` and print `f"Overflow: {overflow} mm"`.
3. **Chapter 3: Wet, Dry or Danger?**
   - **Python Concept:** `if / elif / else` conditionals, boolean `or`, and custom functions.
   - **Story:** Green Valley Society notice board meeting; sorting household waste at the gate.
   - **Choice:** Meera's dialogue choice influences Community Trust meter.
   - **Mission:** Finish `choose_bin(item)` to route hazardous waste to RED, organic waste to GREEN, and dry items to BLUE.
4. **Chapter 4: Twelve Drains Before Dawn**
   - **Python Concept:** `for` loops, `range(1, 13)`, loop indentation.
   - **Story:** 11:40 PM storm alert; Rafiq and BOLT clear all 12 drains on the beat before 5 AM.
   - **Mission:** Automate the 12-drain sweep with a loop and print `"Beat complete!"` once.
   - **Visualizer:** 12-slot interactive drain grid lighting up green in real-time.
5. **Chapter 5: Bring Me Data**
   - **Python Concept:** Lists, `.append()`, `len()`, `max()`.
   - **Story:** Ward 14 Office confrontation with Officer Kavya Rao; turning sensor logs into evidence.
   - **Choice:** Transparency vs. confrontation dialogue choice.
   - **Mission:** Filter drains with water level $\ge 70\%$ into `blocked`, calculate `count` and `worst`.
   - **Visualizer:** 8-drain water column chart highlighting choked drains in alarm red.
6. **Boss Chapter: GRIDLOCK**
   - **Python Concept:** Dictionaries, `.items()`, code debugging and containment.
   - **Story:** Midnight raid on Vantage Civic's servers. Emergency floodgates begin sealing.
   - **Mission:** Expose and repair **three hidden lies**:
     1. *Lie 1 (Halving):* Remove `level = level // 2`.
     2. *Lie 2 (Threshold):* Correct `if level > 100:` to `if level >= 70:`.
     3. *Lie 3 (False Clear):* Assign `"BLOCKED"` to high-risk drains instead of `"CLEAR"`.
   - **Visualizer:** 4-segment Boss HP gauge with live status chips flipping to cyan checkmarks.

### Round 2 Expansion Missions
7. **Chapter 7: Pumps at the Sump**
   - **Python Concept:** `while` loops, decrementing state, termination conditions.
   - **Story:** 3:30 AM at the Old Sump House. Water rises to 160 cm, threatening the 170 cm emergency floodwall and power substation.
   - **Mission:** Run turbine pumps while `water_level > 30`, subtracting `pump_power` (25 cm) per cycle until secured.
   - **Visualizer:** Sump cistern gauge cross-section showing live water level lowering from critical red into safe green zone.
8. **Chapter 8: The Contractor's CSV**
   - **Python Concept:** String manipulation, `.split(",")`, data forensics, list aggregation.
   - **Story:** Officer Kavya Rao obtains Vantage Civic's encrypted raw audit log (`ward14_logs.csv`).
   - **Mission:** Parse comma-separated records, check if `raw >= 70 and reported < 70`, and isolate tampered drain IDs.
   - **Visualizer:** Forensic table highlighting fraudulent records with discrepancy alerts.

### Epilogue & Certification
- **Epilogue: Fix the System**
  - Celebration comic panels showing public transparency boards and community sorting trucks.
  - **Custom Python Apprentice Certificate:** Allows entering student/candidate name, live score stamps, official seals, and **1-click Print/PDF export**!
  - **BOLT's Free-Play Sandbox:** Live in-browser Python terminal for unrestricted experimentation.

---

## 💻 Tech Stack & Architecture

- **Frontend Core:** Pure Semantic HTML5 & Modern Vanilla CSS3 (Custom properties, grid, flexbox, glassmorphism).
- **Interactive Art Engine:** 100% Procedural SVG vector art drawn in code — zero external image downloads or placeholder dependencies.
- **Audio Synthesizer:** Real-time Web Audio API sound generator (Rain noise generator, mechanical keyboard clicks, chime fanfares, warning buzzers, thunder rumble).
- **In-Browser Python Engine:** **Skulpt 1.2.0** with full offline stdlib cached locally in `codes/vendor/`.
- **Offline Resilience:** Local scripts load first; automatic fallback to CDN ensures **100% uptime in campus lab conditions**.
- **Grading Harness:** In-browser async Python test suite with dynamic variant re-testing (prevents hardcoded student hacks).

---

## 📂 Subfolder Structure (`codes/`)

```
d:/Strory verse/
├── CODE MANSOON GAME DESIGN.pdf      # Round 1 Design Document
├── Code Monsoon — Story Bible.pdf    # Narrative Story Bible
├── Storyverse Rulebook .pdf          # Official Praxis Event Rulebook
├── code-monsoon.html                 # Complete root game executable
└── codes/                            # Dedicated source subfolder
    ├── index.html                    # Main web game entrypoint
    ├── code-monsoon.html             # Mirror executable
    ├── style.css                     # Complete modular design system
    ├── game.js                       # Game controllers, UI router, audio synth
    ├── story_data.js                 # Story chapters 1-8, dialogues, SVG generators
    ├── run_game.py                   # Local server launcher with auto browser open
    ├── README.md                     # Comprehensive project documentation
    ├── vendor/                       # Offline in-browser Python runtime
    │   ├── skulpt.min.js             # Core Python interpreter
    │   └── skulpt-stdlib.js          # Standard library bundle
    └── python_solutions/             # Standalone, runnable Python 3 solution files
        ├── ch1_wake_bolt.py          # Chapter 1 solution
        ├── ch2_reading_rain.py       # Chapter 2 solution
        ├── ch3_waste_sorting.py      # Chapter 3 solution
        ├── ch4_twelve_drains.py      # Chapter 4 solution
        ├── ch5_evidence_data.py      # Chapter 5 solution
        ├── boss_gridlock_debug.py    # Chapter 6 Boss solution
        ├── ch7_sump_pumps_while.py   # Chapter 7 Expansion solution
        ├── ch8_csv_log_forensics.py  # Chapter 8 Expansion solution
        ├── forensic_gridlock_patch.py# Side-by-side malicious vs patched engine
        └── test_all_solutions.py     # Automated unittest suite for all solutions
```

---

## 🚀 How to Run the Project

### Option 1: Direct Browser Launch (Zero Setup)
Simply double-click `codes/index.html` (or `code-monsoon.html`) in any modern web browser (Google Chrome, Microsoft Edge, Firefox, Brave, Safari).  
*No server installation or internet connection required!*

### Option 2: Python Local Server Launcher
From a terminal or PowerShell prompt inside `codes/`:
```bash
python run_game.py
```
This starts an HTTP server on port 8000 and automatically opens `http://localhost:8000/index.html` in your browser.

### Option 3: Verifying Standalone Python 3 Solutions
You can run and test all Python chapter solutions directly with standard Python 3.13:
```bash
cd codes/python_solutions
python test_all_solutions.py
```
All 8 modules will execute and report `OK` with full assertions verified in milliseconds.

---

## 🎤 3-Minute Presentation Pitch Script for Judges

### Minute 1: The Narrative Hook & Real-World Framing
> *"Good afternoon, respected jury members. In Indian cities, monsoon flooding is rarely about rain alone. It's about clogged drains, mixed household waste, and outsourced contractors who bill public money while ignoring maintenance.  
> In our story, **Code Monsoon**, Ward 14 is flooding. Second-year student Meera finds BOLT, an abandoned waste-sorting robot under a choked grate. BOLT only understands Python. Together with veteran drain worker Rafiq, Meera learns Python not to pass an exam, but to turn community frustration into computational evidence."*

### Minute 2: Real Python & Technical Innovation
> *"Every single line of code in our application is real Python running directly in the browser using an embedded, offline-ready Skulpt runtime.  
> As you can see on screen, each Python concept directly mirrors the narrative:
> - `print()` wakes the robot.
> - Variables calculate rain overflow.
> - `if / elif / else` sorts street waste into RED, GREEN, and BLUE bins.
> - `for` loops sweep 12 drains before the 5 AM storm hits.
> - Lists filter sensor data to prove that four drains are blocked.
> And when we face the corrupt AI GRIDLOCK, we don't destroy it — because deleting it would jam the city's floodgates. We debug it: removing the halving line, repairing the threshold, and making it report the truth."*

### Minute 3: Social Impact, UN SDGs, and Round 2 Expansions
> *"For Round 2, we expanded the world with two new missions: `while` loops to operate emergency sump pumps, and string parsing to audit raw CSV sensor logs.  
> We address six UN Sustainable Development Goals: Goal 4 for Education, Goal 6 for Clean Water, Goal 11 for Sustainable Cities, Goal 12 for Consumption, Goal 13 for Climate Action, and Goal 16 for Strong Institutions.  
> Our game ends with a printable Python Apprentice certificate and open telemetry data for every citizen. Because at Code Monsoon, our message is clear: **Don't just clean up the problem. Fix the system.** Thank you!"*

---

## ⚖️ Storyverse Evaluation Criteria Mapping

- **Connection to Original Idea (30%):** Faithfully extends the Round 1 Story Bible and Game Design into a living, fully playable interactive comic adventure featuring Meera, BOLT, Rafiq, Aaji, and GRIDLOCK.
- **Interactiveness & User Experience (30%):** Comic panels, trust-altering dialogue choices, integrated code editor with line numbers, auto-indentation, instant visualizers (drain meters, sump tank, CSV audit table), and custom audio synthesis.
- **Technical Implementation (20%):** In-browser Python compiler, robust dynamic grading harness, zero external dependencies, 100% offline lab resilience, and clean modular code architecture.
- **Presentation (20%):** Built-in **Judge Demo Mode** (one-click chapter unlock and solution preview), dedicated **Pitch & SDG** modal, live **Ward Telemetry** dashboard, and comprehensive documentation.

---

*Code Monsoon © 2026 Ajinkya Kalyankar. Built with passion for Storyverse.*
