"use client";

import { useState } from "react";
import { readJsonResponse } from "@/lib/api-client";

export default function Page() {
  const [text, setText] = useState("");

  const [humanizedText, setHumanizedText] = useState("");

  const [humanizeLevel, setHumanizeLevel] = useState(70);

  const [outputLength, setOutputLength] = useState("normal");

  const [loading, setLoading] = useState(false);

  async function handleHumanize() {
    if (!text.trim()) return;

    try {
      setLoading(true);

      const res = await fetch("/api/content-humanizer", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          text,
          humanizeLevel,
          outputLength,
          language: "en",
        }),
      });

      const data = await readJsonResponse(res);

      if (!res.ok) {
        throw new Error(
          data.error || data.humanizedText || "Something went wrong",
        );
      }

      setHumanizedText(data.humanizedText || "No result generated.");
    } catch (error: any) {
      console.error(error);

      setHumanizedText(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Content Humanizer AI</h1>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste AI-generated text here..."
          rows={10}
          className="w-full p-4 rounded-lg bg-zinc-900 border border-zinc-700 outline-none"
        />

        <div className="mt-6">
          <label className="block mb-2 text-lg">
            Humanize Level: {humanizeLevel}
          </label>

          <input
            type="range"
            min="0"
            max="100"
            value={humanizeLevel}
            onChange={(e) => setHumanizeLevel(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="mt-6">
          <label className="block mb-2 text-lg">Output Length</label>

          <select
            value={outputLength}
            onChange={(e) => setOutputLength(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 p-3 rounded-lg"
          >
            <option value="short">Short</option>

            <option value="normal">Normal</option>

            <option value="long">Long</option>
          </select>
        </div>

        <button
          onClick={handleHumanize}
          disabled={loading}
          className="mt-6 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Humanizing..." : "Humanize Content"}
        </button>

        {humanizedText && (
          <div className="mt-8 p-6 rounded-lg bg-zinc-900 border border-zinc-700">
            <h2 className="text-2xl font-semibold mb-4">Humanized Output</h2>

            <div className="whitespace-pre-wrap">{humanizedText}</div>
          </div>
        )}
      </div>
    </div>
  );
}
