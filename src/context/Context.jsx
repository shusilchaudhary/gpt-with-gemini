
import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = ({ children }) => {
    const [input, setInput] = useState(""); // Stores user input
    const [recentPrompt, setRecentPrompt] = useState(""); // Last prompt sent
    const [prevPrompts, setPrevPrompts] = useState([]); // Stores previous prompts
    const [showResult, setShowResult] = useState(false); // Controls result visibility
    const [loading, setLoading] = useState(false); // Loading state
    const [resultData, setResultData] = useState(""); // Stores AI response

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData((prev) => prev + nextWord + " ");
        }, 75 * index);
    };

    const newChat = () => {
        setLoading(false)
        setShowResult(false)
    }

    const formatResponse = (text) => {
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
        formattedText = formattedText.replace(/\n/g, "<br>");
        return formattedText;
    };

    const onSent = async (prompt = null) => {
        const promptToSend = prompt || input.trim(); // Use the provided prompt or the current input

        if (!promptToSend) {
            console.warn("⚠️ Please enter a valid prompt!");
            return;
        }

        setLoading(true);
        setShowResult(true);
        setResultData(""); // Clear previous response

        if (!prompt) {
            setPrevPrompts((prev) => [...prev, promptToSend]); // Only add new inputs to history
        }

        setRecentPrompt(promptToSend);

        try {
            const response = await run(promptToSend); // Fetch AI response

            const formattedResponse = formatResponse(response);
            const wordsArray = formattedResponse.split(" ");

            wordsArray.forEach((word, index) => {
                delayPara(index, word);
            });
        } catch (error) {
            console.error("❌ Error calling Gemini API:", error);
        } finally {
            setLoading(false);
            setInput(""); // Clear input field only if it was manually typed
        }
    };

    const contextValue = {
        input,
        setInput,
        onSent,
        recentPrompt,
        prevPrompts,
        setRecentPrompt,
        showResult,
        setShowResult,
        loading,
        resultData,
        newChat,
    };

    return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default ContextProvider;

