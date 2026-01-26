
// Fix: Add GenerateVideosResponse to imports for use with Operation type.
import { GoogleGenAI, Chat, Modality, Operation, GenerateContentResponse, GenerateVideosResponse } from "@google/genai";

// Storage key for user-provided API key
const API_KEY_STORAGE_KEY = 'gemini-api-key';

/**
 * Get the API key from multiple sources with priority:
 * 1. User-provided key from localStorage (highest priority)
 * 2. Build-time environment variable
 * Note: Both API_KEY and GEMINI_API_KEY are checked for backward compatibility
 */
const getApiKey = (): string => {
  // Check localStorage first (user-provided)
  if (typeof window !== 'undefined') {
    const userKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (userKey) return userKey;
  }
  
  // Fall back to build-time key (GEMINI_API_KEY is the standard, API_KEY for backward compatibility)
  return process.env.GEMINI_API_KEY || process.env.API_KEY || '';
};

/**
 * Save API key to localStorage
 */
export const saveApiKey = (apiKey: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
  }
};

/**
 * Clear API key from localStorage
 */
export const clearApiKey = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  }
};

/**
 * Check if an API key is configured (either build-time or user-provided)
 */
export const isApiKeyConfigured = (): boolean => {
  return !!getApiKey();
};

/**
 * Get the current API key (for specific cases like video download URLs)
 * Use with caution - don't log or expose this value
 */
export const getCurrentApiKey = (): string => {
  return getApiKey();
};

/**
 * Validate that an API key exists and throw a helpful error if not
 */
const validateApiKey = (): void => {
  if (!getApiKey()) {
    throw new Error("Gemini API key is not configured. Please add it in the settings or as a GitHub repository secret.");
  }
};

/**
 * Get or create the GoogleGenAI instance with current API key
 */
const getAiInstance = (): GoogleGenAI => {
  validateApiKey();
  return new GoogleGenAI({ apiKey: getApiKey() });
};

// Fix: Make `uri` and `title` optional to align with the library's `GroundingChunk` type.
export interface GroundingChunk {
    web?: {
        uri?: string;
        title?: string;
    };
}


export const generateImages = async (prompt: string): Promise<string[]> => {
  try {
    // Validate API key before attempting generation
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error("API key is not configured. Please add your Gemini API key in the settings.");
    }
    
    console.log('[Image Generation] Starting image generation...');
    console.log('[Image Generation] Prompt:', prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''));
    console.log('[Image Generation] Model: imagen-4.0-generate-001');
    
    const ai = getAiInstance();
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 4,
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
    });

    console.log('[Image Generation] Response received');
    console.log('[Image Generation] Number of images generated:', response.generatedImages?.length || 0);
    
    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error("No images were generated. The API returned an empty response.");
    }

    const imageUrls = response.generatedImages.map(img => `data:image/png;base64,${img.image.imageBytes}`);
    console.log('[Image Generation] Successfully processed images');
    
    return imageUrls;
  } catch (error) {
    // Enhanced error logging
    console.error("[Image Generation] Error details:", error);
    
    if (error instanceof Error) {
      console.error("[Image Generation] Error message:", error.message);
      console.error("[Image Generation] Error name:", error.name);
      
      // Check for common error scenarios
      if (error.message.includes('API key')) {
        throw new Error("API key error: " + error.message);
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        throw new Error("API quota exceeded. Please check your Gemini API quota and billing settings.");
      } else if (error.message.includes('permission') || error.message.includes('access')) {
        throw new Error("API permission error: Your API key may not have access to the Imagen API. Please verify your API key has image generation permissions enabled.");
      } else if (error.message.includes('model') || error.message.includes('imagen')) {
        throw new Error("Model error: The imagen-4.0-generate-001 model may not be available. Please check the Gemini API documentation for the current model name.");
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error("Network error: Unable to reach the Gemini API. Please check your internet connection.");
      } else {
        throw new Error("Image generation failed: " + error.message);
      }
    }
    
    throw new Error("Failed to generate images. An unexpected error occurred. Please check the console for details.");
  }
};

export const editImage = async (base64ImageData: string, base64MaskData: string, prompt: string): Promise<{ text: string, images: string[] }> => {
  try {
    const ai = getAiInstance();
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
        const ai = getAiInstance();
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
        const ai = getAiInstance();
        const updatedOperation = await ai.operations.getVideosOperation({ operation: operation });
        return updatedOperation;
    } catch (error) {
        console.error("Error checking video status:", error);
        throw new Error("Failed to get video generation status.");
    }
}

export const getInspiration = async (prompt: string): Promise<{ text: string, sources: GroundingChunk[] }> => {
  try {
    const ai = getAiInstance();
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
        const ai = getAiInstance();
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
