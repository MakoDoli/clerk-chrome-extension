import { SetStateAction, useState } from "react";

const API_KEY =
  "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";

const Chat = () => {
  const [message, setMessage] = useState(""); // User input
  const [response, setResponse] = useState(""); // OpenAI response
  const [loading, setLoading] = useState(false); // Loading state

  const handleInputChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async () => {
    if (message.trim() === "") {
      alert("Please enter a message");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", // GPT-3.5 model
          messages: [{ role: "user", content: message }],
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch response from OpenAI");
      }

      const data = await res.json();
      setResponse(data.choices[0].message.content);
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse("Error occurred while fetching response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Ask GPT-3.5</h1>
      <input
        type="text"
        value={message}
        onChange={handleInputChange}
        placeholder="Enter your question"
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Loading..." : "Send"}
      </button>

      <div>
        <h2>Response:</h2>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default Chat;
