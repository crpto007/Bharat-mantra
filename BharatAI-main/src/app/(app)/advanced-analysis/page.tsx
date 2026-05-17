"use client";

import { useState } from "react";

export default function Page() {
  const [query, setQuery] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    if (!query.trim()) return;

    try {
      setLoading(true);

      const res = await fetch("/api/advanced-analysis", {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
          },

        body: JSON.stringify({
          query,
          language: "en",
        }),
      });

      const data = await res.json();

      setAnalysis(data.analysis);
    } catch (error) {
      console.error(error);

      setAnalysis("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-6">
          Advanced Analysis AI
        </h1>

        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter complex topic..."
          rows={6}
          className="w-full p-4 rounded-lg bg-zinc-900 border border-zinc-700 outline-none"
        />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-4 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Analyzing..." : "Start Analysis"}
        </button>

        {analysis && (
          <div className="mt-8 p-6 rounded-lg bg-zinc-900 border border-zinc-700 whitespace-pre-wrap">
            {analysis}
          </div>
        )}

      </div>
    </div>
  );
}