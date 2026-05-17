"use client";

import { useState } from "react";

export default function Page() {
  const [rawText, setRawText] = useState("");
  const [organizedContent, setOrganizedContent] = useState("");

  const [suggestions, setSuggestions] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!rawText.trim()) return;

    try {
      setLoading(true);

      const res = await fetch("/api/cognitive-canvas", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          rawText,
          language: "en",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || data.organizedContent || "Something went wrong",
        );
      }

      setOrganizedContent(data.organizedContent || "No result generated.");
      setSuggestions(data.suggestions);
    } catch (error: any) {
      console.error(error);

      setOrganizedContent(error.message || "Something went wrong.");
      setSuggestions("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Cognitive Canvas AI</h1>

        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste your brainstorming notes here..."
          rows={10}
          className="w-full p-4 rounded-lg bg-zinc-900 border border-zinc-700 outline-none"
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-4 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Generating..." : "Generate Canvas"}
        </button>

        {organizedContent && (
          <div className="mt-8 p-6 rounded-lg bg-zinc-900 border border-zinc-700">
            <h2 className="text-2xl font-semibold mb-4">Organized Content</h2>

            <div className="whitespace-pre-wrap">{organizedContent}</div>
          </div>
        )}

        {suggestions && (
          <div className="mt-8 p-6 rounded-lg bg-zinc-900 border border-zinc-700">
            <h2 className="text-2xl font-semibold mb-4">AI Suggestions</h2>

            <div className="whitespace-pre-wrap">{suggestions}</div>
          </div>
        )}
      </div>
    </div>
  );
}
