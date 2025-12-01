
import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';

@Injectable({ providedIn: 'root' })
export class GeminiService {
  private genAI: GoogleGenAI | null = null;
  
  constructor() {
    // IMPORTANT: This relies on process.env.API_KEY being set in the environment.
    // Do not modify this to accept user input.
    if (process.env.API_KEY) {
      this.genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
    } else {
      console.error("API_KEY environment variable not set. GeminiService will not work.");
    }
  }

  async analyzeCexData(data: any): Promise<string> {
    if (!this.genAI) {
      return Promise.resolve("AI Service is not configured. Please set the API_KEY.");
    }
    
    const model = 'gemini-2.5-flash-lite';
    const prompt = `Analyze the following list of cryptocurrency trading signals from a CEX.
    1. Identify the single signal with the highest 'profit_percent'.
    2. Summarize this most promising trade: state the coin, the entry price, and the target price.
    3. Check if there are multiple signals for the same coin (e.g., 'ALGO') and briefly comment if this pattern is significant.
    4. Provide a very brief, general risk assessment for acting on these types of signals.
    Keep the entire analysis concise, clear, and formatted for a retro terminal display.

    Data:
    ${JSON.stringify(data, null, 2)}
    `;

    try {
      const response = await this.genAI.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      return response.text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return 'Error: Could not get analysis from AI. The request might be blocked or the API key is invalid.';
    }
  }

  async analyzeDexData(data: any): Promise<string> {
    if (!this.genAI) {
        return Promise.resolve("AI Service is not configured. Please set the API_KEY.");
    }

    const model = 'gemini-2.5-flash-lite';
    const prompt = `Analyze the following DEX liquidity pool data.
    1. Identify which platform and pair has the highest liquidity.
    2. Explain why high liquidity is crucial for arbitrage traders.
    3. Suggest one potential arbitrage strategy involving this high-liquidity pool.
    Keep the analysis very brief and to the point, suitable for a retro terminal display.

    Data:
    ${JSON.stringify(data, null, 2)}
    `;

    try {
        const response = await this.genAI.models.generateContent({
            model: model,
            contents: prompt,
            config: {
              thinkingConfig: { thinkingBudget: 0 }
            }
        });
        return response.text;
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return 'Error: Could not get analysis from AI. The request might be blocked or the API key is invalid.';
    }
  }
}