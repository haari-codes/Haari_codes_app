import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is missing in Vercel.");
        }

        const { message } = req.body || {};

        if (!message || typeof message !== "string") {
            return res.status(400).json({
                error: "Please enter a message."
            });
        }

        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: message,
            config: {
                systemInstruction:
                    "You are Haari AI, a friendly multilingual learning companion. Reply in the user's language and explain concepts clearly."
            }
        });

        return res.status(200).json({
            reply: response.text
        });

    } catch (error) {
        console.error("Haari AI error:", error);

        return res.status(500).json({
            error: error.message || "Unknown server error"
        });
    }
}
