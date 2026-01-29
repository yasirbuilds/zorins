The "Founding Engineer" Practical Test: SyncSpark Edition

Goal: Build a functional micro-service that connects Gemini 3 Flash to a Google Workspace action.

Variation 1: The "Strategist" (Focus: Competitive Intelligence)

Best for: A developer who will lead the Al "Gap Detection" logic.

Task: Build a Node.js script that takes a raw text file of "Competitor Social Media Posts."

Al Challenge: Use Gemini 3 Flash to categorize these posts into a JSON "Gap Map" (e.g., Identify topics the competitor isn't talking about).

Implementation: The script must output a 1-page Google Doc summary titled "Gap Analysis Report" using the Google Docs API.

Evaluation: Look for how well they handle "hallucinations" and structured JSON outputs.

---

Variation 2: The "Architect" (Focus: Slides Automation)

Best for: A developer who will build the core "Export to Slides" feature.

Task: You provide a JSON file containing 3 slides worth of content (Title, Body, Image Description).

Implementation Challenge: Use the Google Slides API (batchUpdate) to create a new presentation.

Logic: They must programmatically create a "Title Slide" and two "Content Slides."

Bonus: Have them attempt to insert a placeholder image from a public URL.

Evaluation: Look for clean API handling and error retries (Google APIs often rate-limit).

---

Variation 3: The "Agent" (Focus: Multi-Step Workflows)

Best for: A developer who will build the autonomous "Agents" that work while you sleep.

Task: Build a "Self-Correcting Agent."

Workflow: 1. Ask Gemini to generate a social media post in exactly 20 words.

2. Write a function that counts the words.

3. If it's not 20 words, the agent must "re-prompt" itself to fix it.

Implementation: Log the "thought process" (the reasoning chain) into a Google Sheet via the Sheets API.

Evaluation: Look for their understanding of "Agentic Loops" and state management.
