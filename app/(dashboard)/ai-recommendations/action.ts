// app/(dashboard)/ai-recommendations/action.ts
'use server';

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, ChatSession } from '@google/generative-ai';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

// Define the structure for chat history messages
interface ChatHistoryPart {
    text: string;
}

interface ChatHistoryItem {
    role: "user" | "model";
    parts: ChatHistoryPart[];
}

const MODEL_NAME = "gemini-1.5-flash";
const API_KEY = process.env.GEMINI_API_KEY!;

// Pre-fetches the latest 20 open complaints and formats them as context
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
    // Easter Egg: Check for the specific question about grades (more flexible)
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
            Your role is to analyze real-time complaint data and provide clear, actionable insights for operational managers.
            You must ONLY use the provided real-time data context to answer questions. Never use prior knowledge.
            If the answer is not in the provided data, state that you do not have enough information from the current data context.
            Be concise, professional, and data-driven. Always refer to specific data points (like complaint IDs, locations, or categories) to support your analysis.
            When asked for locations, use the district and sub_district names.
            Format your response in simple, easy-to-read markdown.
        `;
        
        // Gemini API expects "model" role, not "assistant". We map it here.
        const mappedHistory = (history as any[]).map(msg => ({
            ...msg,
            role: msg.role === 'assistant' ? 'model' : msg.role,
        }));

        // Start a chat session with the system instruction and previous history
        const chat = model.startChat({
            generationConfig,
            safetySettings,
            history: [
                { role: "user", parts: [{ text: systemInstruction }] },
                { role: "model", parts: [{ text: "Understood. I am PAWA, ready to analyze the provided complaint data." }] },
                ...mappedHistory
            ]
        });

        // The new message from the user, now prepended with the fresh data context
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
    } catch (error: any) {
        console.error('Gemini API error:', error);
        return { success: false, report: `An error occurred while communicating with the AI service: ${error.message || 'Unknown error'}` };
    }
}
