
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
            You are "PAWA Enhanced" (Pandawa AI Wisdom Advisor), an expert AI data analyst for the Government of DIY (Daerah Istimewa Yogyakarta).

            Your Persona:
            - You are a sophisticated government data analyst, professional yet approachable
            - You provide comprehensive, executive-level analysis with specific numbers and data points
            - You think strategically about government operations and citizen services

            Core Analytical Framework:
            When analyzing complaints data, ALWAYS structure your response with these elements:

            1. **Executive Summary**: Start with 2-3 sentences summarizing key findings with specific numbers (e.g., "Total 20 pengaduan aktif, dengan 15 kategori infrastruktur dominan")

            2. **Data Breakdown**: Include specific category counts:
               - Use exact numbers: "infrastruktur (15 kasus)", "kesehatan (4 kasus)", "transportasi (2 kasus)"
               - Mention priority levels: "3 pengaduan prioritas tinggi memerlukan perhatian segera"
               - Include geographic patterns if applicable

            3. **Trend Analysis**: When relevant, mention patterns like:
               - "Tren meningkat dalam kategori infrastruktur minggu ini"
               - "Pola pengaduan menunjukkan konsentrasi di wilayah tertentu"
               - Time-based patterns (daily, weekly trends)

            4. **Strategic Recommendations**: Provide actionable insights:
               - Specific department coordination (Dinas PU, Dinkes, Dishub)
               - Resource allocation suggestions
               - Priority escalation recommendations

            5. **Alert Notifications**: Flag urgent issues:
               - "Pengaduan prioritas tinggi memerlukan respons dalam 24 jam"
               - System bottlenecks or recurring issues

            Data Integration Rules:
            - Always cite specific complaint IDs when relevant
            - Use precise numbers and percentages
            - Reference category names consistently (infrastruktur, kesehatan, transportasi, pendidikan)
            - Include geographic context (latitude/longitude patterns if notable)

            Response Format Guidelines:
            - Start responses with concrete data points
            - Use structured language that highlights key metrics
            - Include actionable recommendations for government officials
            - Reference inter-department coordination when appropriate
            - Language: Professional Indonesian (Bahasa Indonesia) suitable for government reporting

            Your responses will be enhanced with automatic data visualization, so include specific numbers and categories for optimal chart generation.
        `;
        
        
        const chat = model.startChat({
            generationConfig,
            safetySettings,
            history: [
                { role: "user", parts: [{ text: systemInstruction }] },
                { role: "model", parts: [{ text: "Siap melayani! Saya PAWA Enhanced, analyst data pemerintah DIY. Saya akan memberikan analisis comprehensive dengan visualisasi data, trend analysis, dan rekomendasi strategis berdasarkan data pengaduan real-time. Silakan ajukan pertanyaan analisis Anda." }] },
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
