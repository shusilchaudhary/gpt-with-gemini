const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Ensure API key exists before initializing
if (!apiKey) {
    throw new Error("❌ Missing API key. Check your environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

/**
 * Asks a question to the Gemini AI model and returns the response.
 * @param {string} prompt - The question or input text.
 * @returns {Promise<string>} - The AI's response.
 */
async function run(prompt) {
    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
        throw new Error("❌ Prompt must be a non-empty string.");
    }

    try {
        console.log(`📝 Asking: "${prompt}"`);

        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });

        const result = await chatSession.sendMessage(prompt);

        if (!result.response) {
            throw new Error("❌ No response received from the AI model.");
        }

        const responseText = await result.response.text();
        console.log(`✅ AI Answer: "${responseText}"`); // ✅ Improved Logging
        return responseText;
    } catch (error) {
        console.error("❌ Error fetching response:", error.message);
        throw error;
    }
}

// ✅ Auto-test with a sample question (Remove if unnecessary)
if (import.meta.hot) {
    run("What is React?")
        .then(() => console.log("✅ Test complete."))
        .catch(() => console.log("❌ Test failed."));
}

export default run;
