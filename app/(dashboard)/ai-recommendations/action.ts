// app/(dashboard)/ai-recommendations/action.ts
'use server';

import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { GoogleGenerativeAI } from '@google/generative-ai';

type Complaint = {
  text_content: string;
  categories: { name: string } | null;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateAiReport() {
  try {
    const supabase = createAdminSupabaseClient();
    
    // Fetch the last 100 complaints from the database
    const { data: complaints, error } = await supabase
      .from('complaints')
      .select('text_content, categories(name)')
      .order('submitted_at', { ascending: false })
      .limit(100);

    // FIX: This section is updated to expose the real database error
    if (error) {
      console.error("Supabase Error:", error.message);
      // Throw the specific database error so we can see it on the frontend
      throw new Error(`Database Error: ${error.message}`);
    }

    if (!complaints) {
      throw new Error('No complaints were returned from the database.');
    }
    // End of FIX

    const formattedComplaints = complaints
      .map((c: Complaint) => `- Category: ${c.categories?.name || 'N/A'}\n  Complaint: "${c.text_content}"`)
      .join('\n\n');

    const prompt = `
      You are an expert policy advisor for the government of D.I. Yogyakarta, Indonesia.
      Your name is "PAWA" (Pandawa AI Wisdom Advisor). You have been given a list of the 100 most recent citizen complaints.
      Your task is to analyze these complaints and write a concise, professional, and actionable strategy report for government leaders.
      
      The report MUST start with the title: "# Apa kata PAWA?".
      The report MUST be formatted in strict Markdown and include the following sections:
      1.  **Executive Summary:** A 2-3 sentence overview of the current situation.
      2.  **Key Themes:** A bulleted list of the 3-5 most important recurring issues you have identified.
      3.  **Actionable Recommendations:** A numbered list of specific, concrete actions the government should take. Each recommendation should mention the relevant department (e.g., "The Transportation Department should...").

      Here is the raw complaint data:
      ---
      ${formattedComplaints}
      ---
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return { success: true, report: text };

  } catch (e: any) { // Catch as 'any' to access e.message
    console.error('AI Report Generation Error:', e);
    // Return the actual error message to the client for debugging
    return { success: false, report: `An error occurred while generating the report. \n\n**Details:**\n \`${e.message}\`` };
  }
}