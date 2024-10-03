import { SetStateAction, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

const Chat = () => {
  const [message, setMessage] = useState(""); // User input
  const [response, setResponse] = useState(""); // OpenAI response
  const [loading, setLoading] = useState(false); // Loading state
  const { getToken } = useAuth();

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
      const token = await getToken();

      if (!token) throw new Error("Invalid token");
      // const res = await fetch("https://api.openai.com/v1/chat/completions", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${API_KEY}`,
      //   },
      //   body: JSON.stringify({
      //     model: "gpt-3.5-turbo", // GPT-3.5 model
      //     messages: [{ role: "user", content: message }],
      //   }),
      // });
      const res = await fetch(
        "https://desolate-scrubland-86805-d0840db50656.herokuapp.com/openai",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to fetch response from OpenAI");
      }

      const data = await res.json();
      console.log(data);
      setResponse(data.answer);
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
