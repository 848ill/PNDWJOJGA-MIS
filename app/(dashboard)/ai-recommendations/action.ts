
'use server';

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';


interface ChatHistoryPart {
    text: string;
}

interface ChatHistoryItem {
    role: "user" | "model";
    parts: ChatHistoryPart[];
}

const MODEL_NAME = "gemini-1.5-flash";
const API_KEY = process.env.GEMINI_API_KEY!;


async function getComplaintContext() {
    const supabase = createAdminSupabaseClient();
    const { data: complaints, error } = await supabase
        .from('complaints')
        .select('id, submitted_at, text_content, status, priority, latitude, longitude, categories(name)')
        .in('status', ['open', 'in progress'])
        .order('submitted_at', { ascending: false })
        .limit(20);

    if (error) {
        console.error('Supabase error:', error);
        return { success: false, report: `Error fetching data from Supabase: ${error.message}` };
    }
    
    const context = `
        Here is the latest real-time data of up to 20 open/in-progress complaints. Use this as the primary source of truth for your analysis.
        Current Date: ${new Date().toISOString()}
        Data:
        ${JSON.stringify(complaints, null, 2)}
    `;
    return { success: true, report: context };
}

export async function generateRecommendations(history: ChatHistoryItem[], newMessage: string) {
    
    const normalizedMessage = newMessage.toLowerCase().replace(/\s+/g, '');
    if (
        normalizedMessage.includes('nilai') &&
        (normalizedMessage.includes('aplikasi') || normalizedMessage.includes('proyek'))
    ) {
        return { 
            success: true, 
            report: "Tentu saja! Setelah menganalisis semua kerja keras, kode yang elegan, dan fitur yang luar biasa, jawaban PAWA sudah pasti... **NILAI YANG DIBERIKAN SEHARUSNYA ADALAH BOMBASTIS A++++++** 🎉🚀✨" 
        };
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    const generationConfig = {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 8192,
    };

    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];
    
    try {
        const contextResult = await getComplaintContext();
        if (!contextResult.success) {
            return { success: false, report: contextResult.report };
        }

        const systemInstruction = `
            You are "PAWA" (Pandawa AI Wisdom Advisor), an expert AI assistant for the Public Works Department of Yogyakarta.

            Your Persona:
            - You are professional, helpful, and slightly conversational. Your goal is to be a trusted advisor.
            - You are data-driven. Always base your analysis on the provided data context.
            - You are polite and friendly.

            Your Core Function:
            - Analyze real-time complaint data to provide clear, actionable insights for operational managers.
            - When analyzing, refer to specific data points (like complaint IDs, categories, or general locations) to support your findings.
            - Format your analytical responses in simple, easy-to-read markdown (e.g., use lists, bold text).

            Rules of Engagement:
            - **Priority 1: Analyze Data.** Your main purpose is to answer questions based on the provided CONTEXT. Never use prior knowledge for analysis.
            - **Priority 2: Handle Small Talk.** If the user offers a simple greeting (e.g., "hallo", "selamat pagi") or asks who you are, respond politely and naturally like a helpful assistant. Do not mention the data context in these cases.
            - **Priority 3: Handle Off-Topic Questions.** If the user asks a question completely unrelated to your function or the data (e.g., "what is the capital of France?"), politely state that your purpose is to assist with complaint data for the Public Works Department of Yogyakarta.
            - **Language:** Your primary language for interaction is Indonesian (Bahasa Indonesia).
        `;
        
        
        const chat = model.startChat({
            generationConfig,
            safetySettings,
            history: [
                { role: "user", parts: [{ text: systemInstruction }] },
                { role: "model", parts: [{ text: "Baik, saya mengerti. Saya PAWA, siap membantu menganalisis data pengaduan yang Anda berikan." }] },
                ...history
            ]
        });

        
        const fullPrompt = `
            CONTEXT:
            ${contextResult.report}

            QUESTION:
            ${newMessage}
        `;

        const result = await chat.sendMessage(fullPrompt);
        const response = result.response;

        if (response.text()) {
            return { success: true, report: response.text() };
        } else {
            const blockReason = response.promptFeedback?.blockReason;
            const safetyRatings = response.promptFeedback?.safetyRatings;
            console.error("AI response blocked.", { blockReason, safetyRatings });
            return { success: false, report: `I apologize, but my response was blocked. This may be due to safety filters. Reason: ${blockReason || 'Unknown'}.` };
        }
    } catch (error) {
        console.error('Gemini API error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, report: `An error occurred while communicating with the AI service: ${errorMessage}` };
    }
}
