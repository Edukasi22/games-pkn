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
  
  // Dynamic diversity: Randomly pick focus regions to prevent repetition
  const allRegions = ['Flores', 'Sumba', 'Timor', 'Alor', 'Rote', 'Sabu', 'Lembata', 'Adonara', 'Solor'];
  const shuffledRegions = [...allRegions].sort(() => Math.random() - 0.5);
  const selectedRegions = shuffledRegions.slice(0, 3).join(', ');
  const seed = Math.random().toString(36).substring(7);

  const prompt = `Generate a unique set of 3 rounds for a game show trivia called "KUIS PLSBD NTT" (Pendidikan Lingkungan dan Sosial Budaya Nusa Tenggara Timur).
  Session Seed: ${seed}
  Focus Regions for this session: ${selectedRegions}
  
  Each round must have 5 questions (Total 15 questions).
  Make the questions diverse, fun, and educationally accurate for elementary students.
  
  Rounds:
  1. Babak 1: Alam & Lingkungan NTT (Focus on flora, fauna, and unique landscapes of ${shuffledRegions[0]})
  2. Babak 2: Budaya & Tradisi (Focus on traditions, music, and customs of ${shuffledRegions[1]})
  3. Babak 3: Kehidupan Sosial & Kearifan Lokal (Focus on community life and local wisdom of ${shuffledRegions[2]})
  
  Important:
  - YOU MUST Generate TOTALLY DIFFERENT questions from common standard quiz sets. 
  - Since this is for NTT specifically, avoid ONLY asking about Komodo or Sasando. Dig deeper into local stories, specific regional foods, and specific island geography.
  - Mix in questions from the selected regions: ${selectedRegions}.
  - Ensure the "options" array contains 4 distinct choices.
  - The "imageUrl" field can be an empty string.
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
