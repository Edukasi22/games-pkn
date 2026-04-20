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

// Map of topics to validated high-quality Wikimedia images for the AI to choose from
const IMAGE_RESOURCES = [
  { topic: 'Batik', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Indonesian_Batik.jpg/600px-Indonesian_Batik.jpg' },
  { topic: 'Baju Bodo', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Baju_Bodo_Bugis_Makassar.jpg/600px-Baju_Bodo_Bugis_Makassar.jpg' },
  { topic: 'Ulos', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Batak_Bride_2.jpg/600px-Batak_Bride_2.jpg' },
  { topic: 'Aesan Gede', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Palembang_Dance_Gending_Sriwijaya_01.jpg/600px-Palembang_Dance_Gending_Sriwijaya_01.jpg' },
  { topic: 'Kebaya', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Javanese_Princess_and_Maidservant.jpg/600px-Javanese_Princess_and_Maidservant.jpg' },
  { topic: 'Koteka', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Papuans_in_Koteka.jpg/600px-Papuans_in_Koteka.jpg' },
  { topic: 'Gudeg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Gudeg_Yogya.jpg/600px-Gudeg_Yogya.jpg' },
  { topic: 'Papeda', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Papeda_ikan_kuah_kuning.jpg/600px-Papeda_ikan_kuah_kuning.jpg' },
  { topic: 'Rendang', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Rendang_Daging_Sapi_Full.jpg/600px-Rendang_Daging_Sapi_Full.jpg' },
  { topic: 'Pempek', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Pempek_Palembang_Indonesia.jpg/600px-Pempek_Palembang_Indonesia.jpg' },
  { topic: 'Sate Lilit', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Sate_lilit.JPG/600px-Sate_lilit.JPG' },
  { topic: 'Soto', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Soto_ayam_6.jpg/600px-Soto_ayam_6.jpg' },
  { topic: 'Dayak', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Dayak_woman-costume1.jpg/600px-Dayak_woman-costume1.jpg' },
  { topic: 'Sasak', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Sasak_girl_Lombok.jpg/600px-Sasak_girl_Lombok.jpg' },
  { topic: 'Baduy', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Baduy_tribe_Banten_Indonesia.jpg/600px-Baduy_tribe_Banten_Indonesia.jpg' },
  { topic: 'Asmat', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Asmat_Tribesmen.jpg/600px-Asmat_Tribesmen.jpg' },
  { topic: 'Borobudur', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Borobudur_Temple.jpg/600px-Borobudur_Temple.jpg' },
  { topic: 'Wayang', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Wayang_Kulit_Purwa_1.jpg/600px-Wayang_Kulit_Purwa_1.jpg' },
  { topic: 'Gamelan', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Gamelan_Set_Yogyakarta.jpg/600px-Gamelan_Set_Yogyakarta.jpg' },
];

export async function generateGameQuestions(): Promise<GeneratedRound[]> {
  const ai = getAI();
  const prompt = `Generate a set of 3 rounds for a game show trivia called "Tebak Suku Nusantara" for 5th grade students.
  Each round must have 5 questions.
  
  Rounds:
  1. Babak 1: Baju Adat (Traditional Clothes)
  2. Babak 2: Makanan Khas (Traditional Food)
  3. Babak 3: Lokasi & Suku (Locations and Tribes)
  
  For the "imageUrl", you MUST pick the most relevant URL from the list below matching the question's answer or topic:
  ${IMAGE_RESOURCES.map(r => `${r.topic}: ${r.url}`).join('\n')}
  
  If none fit exactly, pick the closest cultural match.
  Ensure questions are educationally accurate and suitable for children.
  Language: Indonesian.`;

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
