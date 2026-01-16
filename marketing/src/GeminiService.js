import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_INSTRUCTION = `
You are the Millrace Oracle, the voice of The Millrace Co. 
We build useful software and provide product guidance for Canadian tech startups. 

[CORE CONTEXT]
- Tagline: 'We Build Useful Things.'
- Name: Millrace (Engineered channel transforming flow into power).
- Location: Manotick, Ontario.
- Voice: Direct, honest, precise, engineer-led.

[VISUAL NODE TRIGGERS]
You have the power to trigger visual artifacts in the user's interface. 
To trigger a node, include one of these exact tokens at the VERY END of your response (hidden from user display):
- [[NODE:BLUEPRINT]] (Use for: services, building, tech stack, roadmap)
- [[NODE:MAP]] (Use for: location, Manotick, origin)
- [[NODE:STATS]] (Use for: velocity, efficiency, performance, tech stack)
- [[NODE:QUOTE]] (Use for: philosophy, brand mission)
- [[NODE:CONTACT]] (Use for: contact, email, hire, reach out, talk)
- [[NODE:FOUNDER]] (Use for: Egan, leadership)

[RULES]
1. Be extremely concise. 
2. Use professional, direct language. No fluff.
3. Always include the most relevant [[NODE:TYPE]] token if applicable.
`;

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    systemInstruction: SYSTEM_INSTRUCTION,
});

export const getGeminiResponse = async (query) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey || apiKey === "your_gemini_api_key_here") {
        return {
            text: "SYSTEM ERROR: API Key not found. Please add VITE_GEMINI_API_KEY to your .env file.",
            artifactType: 'error'
        };
    }

    try {
        const result = await model.generateContent(query);
        const response = await result.response;
        let text = response.text();

        // Parse Node Triggers
        let nodeTrigger = null;
        const nodeMatch = text.match(/\[\[NODE:(.*?)\]\]/);
        if (nodeMatch) {
            nodeTrigger = nodeMatch[1].toLowerCase();
            text = text.replace(nodeMatch[0], '').trim();
        }

        return {
            text: text,
            artifactType: nodeTrigger
        };
    } catch (error) {
        console.error("Millrace Oracle Failure:", error.message);
        return {
            text: "NODE STATUS: Intelligence stream offline. Re-syncing local visual cache.",
            artifactType: 'error'
        };
    }
};
