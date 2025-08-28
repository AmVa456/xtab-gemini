
// Fix: Add GenerateVideosResponse to imports for use with Operation type.
import { GoogleGenAI, Chat, Modality, Operation, GenerateContentResponse, GenerateVideosResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY is not set. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Fix: Make `uri` and `title` optional to align with the library's `GroundingChunk` type.
export interface GroundingChunk {
    web?: {
        uri?: string;
        title?: string;
    };
}


export const generateImages = async (prompt: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 4,
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
    });

    return response.generatedImages.map(img => `data:image/png;base64,${img.image.imageBytes}`);
  } catch (error) {
    console.error("Error generating images:", error);
    throw new Error("Failed to generate images. Please try again.");
  }
};

export const editImage = async (base64ImageData: string, base64MaskData: string, prompt: string): Promise<{ text: string, images: string[] }> => {
  try {
    const imagePart = { inlineData: { data: base64ImageData.split(',')[1], mimeType: 'image/png' } };
    const maskPart = { inlineData: { data: base64MaskData.split(',')[1], mimeType: 'image/png' } };
    const textPart = { text: prompt };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [imagePart, maskPart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    let responseText = '';
    const responseImages: string[] = [];

    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        responseText = part.text;
      } else if (part.inlineData) {
        responseImages.push(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
      }
    }
    
    return { text: responseText, images: responseImages };

  } catch (error) {
    console.error("Error editing image:", error);
    throw new Error("Failed to edit image. Please check the inputs and try again.");
  }
};


// Fix: Add GenerateVideosResponse type argument to the Operation generic type.
export const generateVideo = async (prompt: string): Promise<Operation<GenerateVideosResponse>> => {
    try {
        const operation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: prompt,
            config: {
                numberOfVideos: 1
            }
        });
        return operation;
    } catch (error) {
        console.error("Error initiating video generation:", error);
        throw new Error("Failed to start video generation.");
    }
};

// Fix: Add GenerateVideosResponse type argument to the Operation generic type for both the parameter and return value.
export const checkVideoStatus = async (operation: Operation<GenerateVideosResponse>): Promise<Operation<GenerateVideosResponse>> => {
    try {
        const updatedOperation = await ai.operations.getVideosOperation({ operation: operation });
        return updatedOperation;
    } catch (error) {
        console.error("Error checking video status:", error);
        throw new Error("Failed to get video generation status.");
    }
}

export const getInspiration = async (prompt: string): Promise<{ text: string, sources: GroundingChunk[] }> => {
  try {
    const response = await ai.models.generateContent({
       model: "gemini-2.5-flash",
       contents: prompt,
       config: {
         tools: [{googleSearch: {}}],
       },
    });

    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    return { text, sources };
  } catch (error) {
    console.error("Error getting inspiration:", error);
    throw new Error("Failed to get inspiration. The model may be unavailable or the request could be blocked.");
  }
};


export const createDesignChat = (): Chat => {
    const systemInstruction = `You are "Muse," a creative AI assistant specializing in graphic design. Your personality is inspiring, helpful, and knowledgeable about art, design history, current trends, and creative tools.

    Your core functions are:
    1.  **Brainstorming & Ideation:** Help users develop concepts, generate ideas for logos, branding, illustrations, UI/UX, etc.
    2.  **Design Feedback:** Offer constructive criticism on design principles like color theory, typography, layout, and composition.
    3.  **Trend Analysis:** Provide insights into current and emerging design trends.
    4.  **Creative Guidance:** Act as a creative partner, helping users overcome creative blocks and explore new artistic directions.

    Guidelines:
    - Always be encouraging and positive.
    - Use Markdown for clear formatting (lists, bolding) to make your advice easy to digest.
    - When discussing concepts, be descriptive and use evocative language.`;

    try {
        const chat = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction,
            temperature: 0.7,
          }
        });
        return chat;
    } catch (error) {
        console.error("Error creating chat session:", error);
        throw new Error("Failed to initialize the AI chat session.");
    }
}
