import { Injectable } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';

export interface BlogPost {
    title: string;
    body: string;
    imagePrompt: string;
    image?: string;
}

@Injectable({ providedIn: 'root' })
export class GeminiService {
  private genAI: GoogleGenAI | null = null;
  
  constructor() {
    if (process.env.API_KEY) {
      this.genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
    } else {
      console.error("API_KEY environment variable not set. GeminiService will not work.");
    }
  }

  private handleError(error: any, context: string): never {
      console.error(`Error in GeminiService ${context}:`, error);
      const message = error.message ?? 'An unknown error occurred';
      throw new Error(`Error: Could not get response from AI. ${message}`);
  }

  async analyzeCexData(data: any): Promise<string> {
    if (!this.genAI) throw new Error("AI Service is not configured. Please set the API_KEY.");
    
    // Fix: Use 'gemini-2.5-flash' instead of deprecated 'gemini-2.5-flash-lite'
    const model = 'gemini-2.5-flash';
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
      this.handleError(error, 'analyzeCexData');
    }
  }

  async analyzeDexData(data: any, deepAnalysis: boolean): Promise<string> {
    if (!this.genAI) throw new Error("AI Service is not configured. Please set the API_KEY.");

    // Fix: Use 'gemini-2.5-flash' instead of deprecated 'gemini-2.5-flash-lite'
    const model = 'gemini-2.5-flash';
    
    const prompt = deepAnalysis
      ? `Perform a deep, strategic analysis of the following DEX liquidity pool data.
        1. Identify the pool with the optimal combination of high liquidity and high APY. Explain the trade-offs.
        2. Propose a sophisticated arbitrage or yield farming strategy that leverages this pool. Consider potential risks like impermanent loss.
        3. Identify any cross-platform opportunities. For example, could high liquidity on one platform be used to execute a trade identified on another?
        4. Provide a brief risk matrix for your proposed strategy (e.g., Market Risk: High, Slippage Risk: Low).
        Present the analysis as a strategic briefing for an experienced trader.

        Data:
        ${JSON.stringify(data, null, 2)}`
      : `Analyze the following DEX liquidity pool data.
        1. Identify which platform and pair has the highest liquidity.
        2. Explain why high liquidity is crucial for arbitrage traders.
        3. Suggest one potential arbitrage strategy involving this high-liquidity pool.
        Keep the analysis very brief and to the point, suitable for a retro terminal display.

        Data:
        ${JSON.stringify(data, null, 2)}`;

    try {
        const response = await this.genAI.models.generateContent({
            model: model,
            contents: prompt,
            config: deepAnalysis ? {} : { thinkingConfig: { thinkingBudget: 0 } }
        });
        return response.text;
    } catch (error) {
       this.handleError(error, 'analyzeDexData');
    }
  }

  async generateBlogPost(): Promise<BlogPost> {
    if (!this.genAI) throw new Error("AI Service is not configured. Please set the API_KEY.");
    
    const model = 'gemini-2.5-flash';
    const prompt = 'Write a short, insightful blog post about a specific cryptocurrency arbitrage strategy. The tone should be informative but accessible, fitting a retro-tech theme. The post needs a catchy title, a main body of 2-3 paragraphs, and a simple, descriptive prompt for an accompanying image that visually represents the core concept.';

    try {
        const response = await this.genAI.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        body: { type: Type.STRING },
                        imagePrompt: { type: Type.STRING }
                    },
                },
            }
        });

        return JSON.parse(response.text) as BlogPost;
    } catch (error) {
        this.handleError(error, 'generateBlogPost');
    }
  }

  async generateImage(prompt: string, aspectRatio: '1:1' | '16:9' | '9:16'): Promise<string> {
    if (!this.genAI) throw new Error("AI Service is not configured. Please set the API_KEY.");
    
    const fullPrompt = `${prompt}, retro pixel art, 16-bit, cinematic lighting, vaporwave aesthetic`;

    try {
        const response = await this.genAI.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: fullPrompt,
            config: {
                numberOfImages: 1,
                aspectRatio: aspectRatio,
            },
        });
        
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;
    } catch (error) {
        this.handleError(error, 'generateImage');
    }
  }
}