// Helper to call Gemini API directly from the browser for live AI generation

const MODEL_NAME = "gemini-1.5-flash";

export async function generateQuestionFromAI(apiKey, topic, difficulty, history = []) {
  const prompt = `You are AceSAT, an expert SAT tutor AI agent. 
Generate a single, realistic SAT question matching the following criteria:
- Topic: "${topic}"
- Difficulty: "${difficulty}" (Must reflect this level: Easy, Medium, or Hard)

You must output your response in JSON format. Do not include markdown code block syntax (like \`\`\`json). The JSON must match the following schema:
{
  "id": "ai_${topic.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}",
  "topic": "${topic}",
  "difficulty": "${difficulty}",
  "question": "The question description. If math, use clear formatting. If verbal, write a short paragraph context first, followed by the question.",
  "options": [
    "A) [Option text]",
    "B) [Option text]",
    "C) [Option text]",
    "D) [Option text]"
  ],
  "correctAnswer": 0, // Integer (0 to 3) representing the index of the correct option
  "scaffold": [
    "Hint Level 1 (Conceptual): Remind the student of the key formulas, definitions, or grammar rules without giving any steps.",
    "Hint Level 2 (Scaffolding): Guide the student on the first step of setting up the problem or analyzing the text.",
    "Hint Level 3 (Actionable): Provide a strong hint about the calculations or relationship to help them choose the final option."
  ],
  "explanation": "A complete, step-by-step educational explanation of why the correct option is right, and why the other options are wrong."
}

Ensure the question is unique, educational, and mimics the format of the official College Board Digital SAT.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || "Failed to generate AI question");
    }

    const data = await response.json();
    const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResult) {
      throw new Error("No response from Gemini API");
    }

    return JSON.parse(textResult);
  } catch (error) {
    console.error("Error in AI Question Generation:", error);
    throw error;
  }
}

export async function getAICoachResponse(apiKey, messageHistory, studentState) {
  const formattedHistory = messageHistory.map(msg => ({
    role: msg.sender === "student" ? "user" : "model",
    parts: [{ text: msg.text }]
  }));

  const systemInstruction = `You are Ace, a highly encouraging, friendly, and expert AI Study Coach for the AceSAT platform. 
Your goal is to close the education gap for underserved public school students by acting as a top-tier private coach.
You must:
1. Speak directly, keep messages concise, encouraging, and highly action-oriented.
2. Adapt your advice based on the student's mastery:
   - Student current target: ${studentState.targetScore}
   - Weekly dedication hours: ${studentState.studyHours}
   - Mastery levels: ${JSON.stringify(studentState.mastery)}
3. Suggest study strategies, encourage them when they struggle, and push them to practice.
4. Guide them through onboarding if they are just getting started.

Do not solve math equations or write practice questions here. Encourage them to use the "SAT Prep Workspace" for interactive problem-solving.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: formattedHistory,
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          generationConfig: {
            maxOutputTokens: 250,
          }
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || "Failed to get AI Coach response");
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
      throw new Error("No text response from Gemini API");
    }

    return responseText;
  } catch (error) {
    console.error("Error in AI Coach Chat:", error);
    throw error;
  }
}
