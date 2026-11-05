// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


import { useState } from "react";

function App() {

    const [message, setMessage] = useState("");

    const [answer, setAnswer] = useState("");

    const [loading, setLoading] = useState(false);


    const sendMessage = async () => {

        if (!message.trim()) return;

        setLoading(true);

        setAnswer("");

        try {

            const response = await fetch(
                "http://localhost:5000/api/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        message: message
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Request failed");
            }

            setAnswer(data.answer);

        }

        catch (error) {

            console.error(error);

            setAnswer("Unable to connect with AI. Please try again.");

        }

        finally {

            setLoading(false);

        }

    };


    return (

        <div style={{
            maxWidth: "700px",
            margin: "60px auto",
            padding: "30px",
            fontFamily: "Arial"
        }}>

            <h1>AI Chatbot</h1>

            <p>Ask anything to your AI assistant.</p>


            <textarea

                rows="5"

                value={message}

                onChange={(e) => setMessage(e.target.value)}

                placeholder="Enter your question..."

                style={{
                    width: "100%",
                    padding: "15px",
                    fontSize: "16px"
                }}

            />


            <button

                onClick={sendMessage}

                disabled={loading}

                style={{
                    padding: "12px 25px",
                    marginTop: "15px",
                    cursor: "pointer"
                }}

            >

                {loading ? "Generating..." : "Ask AI"}

            </button>


            {answer && (

                <div style={{
                    marginTop: "30px",
                    padding: "20px",
                    background: "#f1f1f1",
                    borderRadius: "10px"
                }}>

                    <h3>AI Response</h3>

                    <p style={{
                        whiteSpace: "pre-wrap"
                    }}>

                        {answer}

                    </p>

                </div>

            )}

        </div>

    );

}

export default App;
