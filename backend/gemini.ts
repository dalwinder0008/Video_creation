import { GoogleGenAI } from "@google/genai";

let geminiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set in environment. Running in fallback simulation mode.");
    }
    geminiClient = new GoogleGenAI({
      apiKey: apiKey || "dummy-key-for-init",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

export const GEMINI_MODEL = "gemini-3.8-flash";
