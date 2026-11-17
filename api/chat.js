import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

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
        const { message } = req.body || {};

        if (!message || typeof message !== "string") {
            return res.status(400).json({
                error: "Please enter a message."
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: message,
            config: {
                systemInstruction:
                    "You are Haari AI, a friendly multilingual learning companion. Reply in Malayalam, Manglish, English, Hindi or Tamil according to the user's language. Explain concepts clearly and help students learn."
            }
        });

        return res.status(200).json({
            reply: response.text
        });

    } catch (error) {
        console.error("Haari AI error:", error);

        return res.status(500).json({
            error: "Haari AI is temporarily unavailable."
        });
    }
}
