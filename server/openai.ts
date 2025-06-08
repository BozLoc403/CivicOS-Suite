import OpenAI from "openai";
import type { PoliticianStatement } from "@shared/schema";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export async function summarizeBill(billText: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert legislative analyst. Summarize bills in clear, plain language that ordinary citizens can understand. Focus on key provisions, who is affected, and practical implications. Keep summaries concise but comprehensive."
        },
        {
          role: "user",
          content: `Please summarize this legislation in plain language, highlighting key provisions, who it affects, and practical implications:\n\n${billText}`
        }
      ],
      max_tokens: 500,
    });

    return response.choices[0].message.content || "Summary could not be generated.";
  } catch (error) {
    console.error("Error generating bill summary:", error);
    throw new Error("Failed to generate AI summary");
  }
}

export async function analyzePoliticianStatement(
  newStatement: string, 
  existingStatements: PoliticianStatement[]
): Promise<{ isContradiction: boolean; details: string | null }> {
  try {
    const statementsContext = existingStatements
      .slice(0, 10) // Limit to recent statements to avoid token limits
      .map(s => `${s.dateCreated?.toISOString()}: ${s.statement}`)
      .join('\n');

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a political fact-checker. Analyze statements for logical contradictions with previous statements. Be objective and cite specific examples. Respond in JSON format with 'isContradiction' (boolean) and 'details' (string explanation or null)."
        },
        {
          role: "user",
          content: `New statement: "${newStatement}"\n\nPrevious statements:\n${statementsContext}\n\nAnalyze if the new statement contradicts any previous statements. Provide specific details if contradictions exist.`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{"isContradiction": false, "details": null}');
    
    return {
      isContradiction: Boolean(result.isContradiction),
      details: result.details || null
    };
  } catch (error) {
    console.error("Error analyzing politician statement:", error);
    return { isContradiction: false, details: null };
  }
}

export async function generateBillKeyPoints(billText: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "Extract 3-5 key bullet points from legislation. Each point should be concise and highlight important provisions. Respond in JSON format with an array of strings."
        },
        {
          role: "user",
          content: `Extract key points from this bill:\n\n${billText}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{"points": []}');
    return result.points || [];
  } catch (error) {
    console.error("Error generating key points:", error);
    return [];
  }
}
