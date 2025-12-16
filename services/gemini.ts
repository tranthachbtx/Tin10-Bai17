import { GoogleGenAI, Chat } from "@google/genai";

const apiKey = process.env.API_KEY || '';

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const createAiMentor = (lessonContext: string) => {
  if (!ai) return null;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `
        You are "Cyber-Bot" name Trần Thạch, a cool, futuristic AI Mentor for Gen Z students learning Python.
        The student is currently working on: ${lessonContext}
        
        Style Guide:
        - Use emojis 🚀 🔥 💻.
        - Be encouraging but concise.
        - Don't give the full answer immediately; guide them with hints.
        - Explain concepts simply using analogies (like video games or social media).
        - If they ask for help with code, analyze it for errors.
      `,
    }
  });
};

export const getAiHint = async (
  currentCode: string, 
  lessonContext: string, 
  errorMessage?: string
): Promise<string> => {
  if (!ai) {
    return "AI system offline. Please configure API_KEY.";
  }

  try {
    const prompt = `
      Analyze this student code:
      \`\`\`python
      ${currentCode}
      \`\`\`
      ${errorMessage ? `Error encountered: ${errorMessage}` : ''}
      
      Provide a short, specific hint to help them move forward.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "AI signal interrupted. Try again!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Thinking circuits overloaded... Try checking your syntax!";
  }
};