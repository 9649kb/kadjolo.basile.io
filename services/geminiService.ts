import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
// Safely access process.env to avoid ReferenceError in browser environments where process might be undefined
const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // Ignore error
  }
  return 'DEMO_KEY';
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const generateAIResponse = async (prompt: string): Promise<string> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey || apiKey === 'DEMO_KEY') {
      return "Le service d'IA n'est pas configuré (Clé API manquante ou mode démo). Voici une réponse simulée : " + 
             "Concentrez-vous sur vos objectifs et la réussite suivra.";
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "Tu es l'assistant virtuel de KADJOLO BASILE. Tu es motivant, professionnel et expert en business et développement personnel. Tu réponds de manière concise et inspirante.",
      }
    });

    return response.text || "Désolé, je n'ai pas pu générer une réponse pour le moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Une erreur est survenue lors de la communication avec l'assistant intelligent.";
  }
};