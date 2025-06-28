// lib/ai/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

// Access your API key as an environment variable
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable not set. Please add it to your .env.local file.");
}

// Initialize the Google Generative AI client
export const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Get the model you'll use for text generation
// For general text-based tasks, 'gemini-pro' is the standard.
export const textGenModel = genAI.getGenerativeModel({ model: "gemini-pro" });

// You might define a function here later to make specific AI calls
// export async function getAiInsight(prompt: string) { ... }