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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Track sidebar state

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData((prev) => prev + nextWord + " ");
        }, 75 * index);
    };

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
    };

    const formatResponse = (text) => {
        // First, handle markdown-style formatting
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
        // Handle single asterisks for italics
        formattedText = formattedText.replace(/\*(.*?)\*/g, "<i>$1</i>");
        // Replace any remaining asterisks
        formattedText = formattedText.replace(/\*/g, "");
        // Handle newlines
        formattedText = formattedText.replace(/\n/g, "<br>");
        return formattedText;
    };

    const onSent = async (prompt = null) => {
        const promptToSend = prompt || input.trim(); // Use the provided prompt or the current input

        if (!promptToSend) {
            console.warn("⚠️ Please enter a valid prompt!");
            return null;
        }

        setLoading(true);
        setShowResult(true);
        setResultData(""); // Clear previous response

        // We'll manage adding to history from Main.js only
        // to avoid duplicates, so removing this code

        setRecentPrompt(promptToSend);

        try {
            const response = await run(promptToSend); // Fetch AI response
            
            // Ensure response is a string
            const responseText = typeof response === 'string' ? response : 
                               (response?.text || JSON.stringify(response));
            
            const formattedResponse = formatResponse(responseText);
            
            // Apply word-by-word animation for resultData state
            const wordsArray = formattedResponse.split(" ");
            wordsArray.forEach((word, index) => {
                delayPara(index, word);
            });
            
            // Return the full response for direct use elsewhere
            return formattedResponse;
        } catch (error) {
            console.error("❌ Error calling Gemini API:", error);
            return "I encountered an error while processing your request. Please try again.";
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
        setPrevPrompts,
        setRecentPrompt,
        showResult,
        setShowResult,
        loading,
        resultData,
        newChat,
        isSidebarOpen,
        setIsSidebarOpen
    };

    return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default ContextProvider;