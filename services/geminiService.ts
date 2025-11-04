
import { GoogleGenAI } from "@google/genai";
import { ShedConfig } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. Please provide a valid API key for Gemini functionality.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'YOUR_API_KEY_HERE' });

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export const generateBuildOrder = async (config: ShedConfig, totalPrice: number): Promise<string> => {
    if (!config.size || !config.style || !config.siding || !config.roof) {
        throw new Error("Incomplete shed configuration.");
    }

    const addonsText = config.addons.length > 0
        ? config.addons.map(addon => `- ${addon.name}: ${formatCurrency(addon.price)}`).join('\n')
        : 'None';

    const prompt = `
      You are an expert project manager for a premium shed building company called "PLACED".
      Your task is to generate a professional, well-formatted build order document based on a customer's selections.
      The output should be in Markdown format.

      Here is the customer's configuration:
      - Base Model & Size: ${config.size.name} (${formatCurrency(config.size.price)})
      - Style Upgrade: ${config.style.name} (${formatCurrency(config.style.price)})
      - Siding Choice: ${config.siding.name} (${formatCurrency(config.siding.price)})
      - Roof Choice: ${config.roof.name} (${formatCurrency(config.roof.price)})
      - Add-ons:
      ${addonsText}
      - TOTAL CUSTOMER PRICE: ${formatCurrency(totalPrice)}

      Generate the build order with the following sections:
      1.  **Header**: "PLACED SHED BUILD ORDER" and a unique order number (e.g., #PLACED-2024-XXXX).
      2.  **Shed Specifications**: A clear, itemized list of the chosen model, size, style, siding, roof, and any custom features/add-ons.
      3.  **Cost Breakdown**: A simple table showing the base price, upgrades (style, siding, roof), add-ons, and the final total price.
      4.  **Next Steps**: Briefly explain what happens next (e.g., "A PLACED representative will contact you within 24 hours to confirm details, discuss site preparation, and schedule your delivery.").
      5.  **Footer**: A thank you message.

      Ensure the document is clean, professional, and easy for the customer to understand. Do not include any introductory or concluding text outside of the requested document format.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating build order:", error);
        return "### Error\n\nWe encountered an issue while generating your build order. Please check your API key and try again. If the problem persists, our team has been notified.";
    }
};
