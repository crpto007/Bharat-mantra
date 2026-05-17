"use client";

import { useState } from "react";

export default function ChatbotPage() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!message.trim()) return;

    try {
      setLoading(true);

      const res = await fetch("/api/chatbot", {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
          },

        body: JSON.stringify({
          message,
          language: "en",
          context: "",
        }),
      });

      const data = await res.json();

      setResponse(data.response);
    } catch (error) {
      console.error(error);

      setResponse("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          BharatAI Chatbot
        </h1>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full p-4 rounded-lg bg-zinc-900 border border-zinc-700 outline-none"
          rows={5}
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className="mt-4 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Generating..." : "Send"}
        </button>

        {response && (
          <div className="mt-6 p-4 rounded-lg bg-zinc-900 border border-zinc-700">
            <h2 className="text-xl font-semibold mb-2">
              AI Response
            </h2>

            <p className="whitespace-pre-wrap">
              {response}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}