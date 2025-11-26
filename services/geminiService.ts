
import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to handle this more gracefully.
  // For this example, we assume it's set.
  console.warn("Gemini API key not found in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const analyzeExpensesWithGemini = async (transactions: Transaction[]): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve("Error: Gemini API key is not configured. Please set the API_KEY environment variable.");
  }
  
  if (transactions.length === 0) {
    return "There are no transactions to analyze. Please add some expenses and try again.";
  }

  const prompt = `
    You are SpendSense, an expert financial analyst AI.
    Analyze the following list of financial transactions and provide a concise, actionable summary for the user.
    The user wants to understand their spending patterns and find ways to save money.

    The analysis should include:
    1.  A brief, encouraging overview of their financial activity.
    2.  Identification of the top 2-3 spending categories.
    3.  One or two specific, actionable insights or suggestions based on their spending. For example, if they spend a lot on 'Food', suggest cooking at home more often.
    4.  A concluding positive remark.

    Keep the tone friendly, helpful, and non-judgmental. Format the output as simple text. Avoid using markdown.

    Here are the user's recent transactions in JSON format:
    ${JSON.stringify(transactions, null, 2)}

    Please provide your analysis now.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I encountered an error while analyzing your expenses. Please check the console for details and try again later.";
  }
};
