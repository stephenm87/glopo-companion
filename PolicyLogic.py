import sys
import json

class PolicyWarRoom:
    def __init__(self, scenario):
        self.scenario = scenario
        self.levels = {
            1: "Low Marks (Level 1). Your policy was too vague and failed.",
            2: "High Marks (Level 2). The policy is effective.",
            3: "Scholar Level (Level 3). You have secured the 7."
        }

    def grade_policy(self, policy_input):
        """
        Policy input should be a string.
        Logic:
        - Generic: Short, vague verbs ('help', 'do something', 'send stuff')
        - Surgical: Contains Actor + Mechanism + Rationale
        - Scholar: Contains Risk/Implication mitigation
        """
        policy_lower = policy_input.lower()
        
        # Check for Generic (vague)
        generic_keywords = ['help', 'try', 'fix', 'do something', 'support', 'send money']
        is_generic = len(policy_input.split()) < 10 or any(kw in policy_lower and len(policy_input.split()) < 15 for kw in generic_keywords)

        # Check for Surgical (Actor + Mechanism + Rationale)
        # Using a simple heuristic for demonstration
        has_actor = any(actor in policy_lower for actor in ['ministry', 'un', 'government', 'sc', 'agency', 'ngo'])
        has_mechanism = any(mech in policy_lower for mech in ['sanction', 'fund', 'subsidy', 'treaty', 'protocol', 'deployment'])
        has_rationale = 'to' in policy_lower or 'in order to' in policy_lower or 'because' in policy_lower
        
        is_surgical = has_actor and has_mechanism and has_rationale

        # Check for Scholar (Risk/Implication/Mitigation)
        risk_keywords = ['however', 'risk', 'challenge', 'but', 'mitigate', 'although', 'despite']
        has_risk = any(kw in policy_lower for kw in risk_keywords)

        if has_risk and is_surgical:
            return 3, self.levels[3]
        elif is_surgical:
            return 2, self.levels[2]
        else:
            return 1, self.levels[1]

def main():
    scenario = "A border dispute in the South China Sea is escalating between local fishermen and regional coast guards."
    print("\n" + "="*50)
    print("🌍 POLICY WAR ROOM SIMULATOR")
    print("="*50)
    print(f"SCENARIO: {scenario}\n")
    
    print("Submit your policy proposal:")
    user_input = input("> ")
    
    room = PolicyWarRoom(scenario)
    level, feedback = room.grade_policy(user_input)
    
    print("\n--- GRADING REPORT ---")
    if level == 3:
        print(f"RESULT: 🎉 {feedback}")
        print("EXPLANATION: You identified a specific actor, a mechanism, and accounted for systemic risks.")
    elif level == 2:
        print(f"RESULT: ✅ {feedback}")
        print("EXPLANATION: Good surgical approach, but you missed the 'Synthesis/Risk' check for a Level 7.")
    else:
        print(f"RESULT: ❌ {feedback}")
        print("EXPLANATION: This is too generic. Remember: Actor + Mechanism + Target + Rationale.")
    print("="*50 + "\n")

if __name__ == "__main__":
    main()
