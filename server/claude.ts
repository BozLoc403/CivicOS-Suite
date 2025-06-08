import Anthropic from '@anthropic-ai/sdk';
import type { PoliticianStatement } from "@shared/schema";

// the newest Anthropic model is "claude-sonnet-4-20250514" which was released May 14, 2025. Use this by default unless user has already selected claude-3-7-sonnet-20250219
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn('⚠️  ANTHROPIC_API_KEY not found - AI features will be disabled');
}

// the newest Anthropic model is "claude-sonnet-4-20250514" which was released May 14, 2025. Use this by default unless user has already selected claude-3-7-sonnet-20250219

export async function summarizeBill(billText: string): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("AI features require Anthropic API key configuration");
  }

  try {
    const message = await anthropic.messages.create({
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are an expert legislative analyst. Summarize this bill in clear, plain language that ordinary citizens can understand. Focus on key provisions, who is affected, and practical implications. Keep the summary concise but comprehensive.

Bill text:
${billText}`
        }
      ],
      model: 'claude-sonnet-4-20250514',
    });

    return message.content[0].type === 'text' ? message.content[0].text : "Summary could not be generated.";
  } catch (error) {
    console.error("Error generating bill summary:", error);
    throw new Error("Failed to generate AI summary");
  }
}

export async function analyzePoliticianStatement(
  statementText: string, 
  politicianName: string, 
  party: string
): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("AI features require Anthropic API key configuration");
  }

  try {
    const message = await anthropic.messages.create({
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are an expert political analyst. Analyze these statements from ${politicianName} (${party}) and provide insights into their political consistency, key positions, and any notable patterns or contradictions.

Statements to analyze:
${statementText}

Provide a comprehensive analysis covering:
1. Key political positions and themes
2. Consistency across statements
3. Any contradictions or evolving positions
4. Communication style and rhetoric
5. Alignment with party positions

Be factual and unbiased in your analysis.`
        }
      ],
      model: 'claude-sonnet-4-20250514',
    });

    return message.content[0].type === 'text' ? message.content[0].text : "Analysis could not be generated.";
  } catch (error) {
    console.error("Error analyzing politician statement:", error);
    throw new Error("Failed to generate politician analysis");
  }
}

export async function generateBillKeyPoints(billText: string): Promise<string[]> {
  try {
    const message = await anthropic.messages.create({
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Extract 3-5 key bullet points from this legislation. Each point should be concise and highlight important provisions. Respond in JSON format with an array of strings under the key "points".

Bill text:
${billText}`
        }
      ],
      model: 'claude-sonnet-4-20250514',
    });

    const content = message.content[0].type === 'text' ? message.content[0].text : '{"points": []}';
    const result = JSON.parse(content);
    return result.points || [];
  } catch (error) {
    console.error("Error generating key points:", error);
    return [];
  }
}