import sys
import os
import subprocess
import argparse

# Config
SKILL_DIR = "/Users/stephenmartinez/.gemini/antigravity/scratch/notebooklm_research/.agent/skills/notebooklm"
NOTEBOOK_ID = "glopo-test-prep"

def main():
    parser = argparse.ArgumentParser(description="Analyze a student draft using NotebookLM")
    parser.add_argument("--text", help="The draft text to analyze")
    parser.add_argument("--file", help="File containing the draft text")
    args = parser.parse_args()

    draft_text = ""
    if args.text:
        draft_text = args.text
    elif args.file:
        with open(args.file, 'r') as f:
            draft_text = f.read()
    else:
        print("Error: No draft text provided. Use --text or --file.")
        sys.exit(1)

    question = f"""Please perform a rigorous, source-grounded assessment of this IB Global Politics student draft. 
    Use the 2026 syllabus criteria. Focus on:
    1. Terminology & Conceptual Depth: Are concepts like Power and Sovereignty used correctly and at a high level?
    2. Case Studies: Is the evidence specific and relevant?
    3. Structural Rigor: Does it follow PEEL or Golden Thread patterns?
    
    Draft: '{draft_text}'
    """

    # Run the skill script
    cmd = [
        "python3", "scripts/run.py", "ask_question.py",
        "--question", question,
        "--notebook-id", NOTEBOOK_ID
    ]

    print(f"🚀 Requesting Deep Analysis from NotebookLM ({NOTEBOOK_ID})...")
    
    try:
        result = subprocess.run(cmd, cwd=SKILL_DIR, capture_output=True, text=True, check=True)
        print("\n--- ANALYSIS RESULT ---\n")
        print(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Error calling NotebookLM Skill:\n{e.stderr}")
        sys.exit(1)

if __name__ == "__main__":
    main()
