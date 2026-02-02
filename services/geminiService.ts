
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  /**
   * Performs OCR by sending an image to Gemini.
   */
  async performOCR(base64Image: string, mimeType: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Image, mimeType } },
            { text: "Extract all text from this image as accurately as possible. Output only the text found." }
          ]
        }
      });
      return response.text || "No text found.";
    } catch (error) {
      console.error("OCR Error:", error);
      throw new Error("Failed to process document with Gemini.");
    }
  }

  /**
   * Summarizes document content.
   */
  async summarizeDocument(content: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Please provide a concise summary of the following document content:\n\n${content}`
      });
      return response.text || "Could not generate summary.";
    } catch (error) {
      console.error("Summarization Error:", error);
      return "Summarization unavailable.";
    }
  }
}

export const gemini = new GeminiService();
