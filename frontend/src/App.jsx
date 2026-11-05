
import { useState } from "react";
import "./App.css";

function App() {

    const [message, setMessage] = useState("");
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {

        if (!message.trim() || loading) return;

        const userMessage = message;

        setChats(prev => [
            ...prev,
            {
                role: "user",
                content: userMessage
            }
        ]);

        setMessage("");
        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:5000/api/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        message: userMessage
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "AI request failed");
            }

            setChats(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: data.answer
                }
            ]);

        }

        catch (error) {

            setChats(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: "Error: " + error.message
                }
            ]);

        }

        finally {
            setLoading(false);
        }

    };


    return (

        <div className="app">

            <div className="chat-container">

                <div className="header">
                    <h1>AI Assistant</h1>
                    <p>Powered by MERN + Python + Ollama</p>
                </div>


                <div className="chat-body">

                    {chats.length === 0 && (
                        <div className="welcome">
                            <h2>Hello! 👋</h2>
                            <p>How can I help you today?</p>
                        </div>
                    )}

                    {chats.map((chat, index) => (

                        <div
                            key={index}
                            className={`message ${chat.role}`}
                        >
                            <strong>
                                {chat.role === "user"
                                    ? "You"
                                    : "AI Assistant"}
                            </strong>

                            <p>{chat.content}</p>

                        </div>

                    ))}

                    {loading && (
                        <div className="message assistant">
                            <strong>AI Assistant</strong>
                            <p>Thinking... Please wait.</p>
                        </div>
                    )}

                </div>


                <div className="chat-input">

                    <textarea
                        placeholder="Ask something..."
                        value={message}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (
                                e.key === "Enter" &&
                                !e.shiftKey
                            ) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                    />

                    <button
                        onClick={sendMessage}
                        disabled={loading || !message.trim()}
                    >
                        {loading ? "Wait..." : "Send"}
                    </button>

                </div>

            </div>

        </div>

    );

}

export default App;
