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

export const getAISuggestions = async (text: string, type: 'title' | 'description'): Promise<string[]> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey || apiKey === 'DEMO_KEY') {
      return [
        "Suggestion IA simulée 1 : " + text + " (Premium)",
        "Suggestion IA simulée 2 : Maîtrisez " + text,
        "Suggestion IA simulée 3 : Le Guide Ultime : " + text
      ];
    }

    const prompt = type === 'title' 
      ? `Tu es un expert en copywriting et marketing digital. Propose 3 variantes de titres accrocheurs, professionnels et vendeurs pour une formation dont le titre provisoire est : "${text}". Réponds UNIQUEMENT par une liste brute séparée par des sauts de ligne, sans numérotation ni texte introductif.`
      : `Tu es un expert en vente. Améliore cette description de formation pour la rendre persuasive, claire et structurée (avec des puces si nécessaire). Le texte actuel est : "${text}". Propose 3 versions différentes (une courte punchy, une orientée bénéfices, une détaillée). Sépare les versions par le symbole "|||".`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const rawText = response.text || "";
    
    if (type === 'title') {
      return rawText.split('\n').filter(line => line.trim().length > 0).slice(0, 3);
    } else {
      return rawText.split('|||').map(s => s.trim()).filter(s => s.length > 0).slice(0, 3);
    }

  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return [];
  }
};