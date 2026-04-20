import { GoogleGenAI, Type } from "@google/genai";

let aiInstance: any = null;
const getAI = () => {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiInstance;
};

export interface GeneratedQuestion {
  question: string;
  options: string[];
  answer: string;
  imageUrl: string;
}

export interface GeneratedRound {
  title: string;
  description: string;
  questions: GeneratedQuestion[];
}

export async function generateGameQuestions(): Promise<GeneratedRound[]> {
  const ai = getAI();
  const prompt = `Generate a unique set of 3 rounds for a game show trivia called "Tebak Suku Nusantara" for 5th grade students.
  Each round must have 5 questions.
  Make the questions diverse, fun, and educationally accurate.
  
  Rounds:
  1. Babak 1: Baju Adat & Pakaian (Culture & Clothing)
  2. Babak 2: Makanan & Minuman Khas (Culinary)
  3. Babak 3: Lokasi, Suku & Tradisi (Geography and Traditions)
  
  Important:
  - Generate DIFFERENT questions every time. 
  - Ensure the "options" array contains 4 distinct choices.
  - The "imageUrl" field can be an empty string or a generic keyword.
  - Language: Indonesian.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    minItems: 4,
                    maxItems: 4,
                  },
                  answer: { type: Type.STRING },
                  imageUrl: { type: Type.STRING },
                },
                required: ["question", "options", "answer", "imageUrl"],
              },
            },
          },
          required: ["title", "description", "questions"],
        },
      },
    },
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("AI Response parsing failed", e);
    throw new Error("Gagal memproses soal dari AI.");
  }
}
