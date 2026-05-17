"use client";

import { useState } from "react";
import { postJson } from "@/lib/api-client";

export default function Page() {
  const [query, setQuery] = useState("");
  const [summary, setSummary] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!query.trim()) return;

    try {
      setLoading(true);

      const data = await postJson<{ summary: string }, Record<string, unknown>>(
        "/api/grounded-search",
        {
          query,
          language,
        }
      );

      setSummary(data.summary);

    } catch (error) {
      console.error(error);

      setSummary(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!summary) return;

    await navigator.clipboard.writeText(summary);

    alert("Summary copied!");
  }

  function handleDownload() {
    if (!summary) return;

    const blob = new Blob([summary], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "grounded-search-summary.txt";

    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Knowledge Explorer
        </h1>

        <div className="grid lg:grid-cols-2 gap-6">

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

            <h2 className="text-2xl font-semibold mb-4">
              Topic Input
            </h2>

            <input
              type="text"
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
              placeholder="Enter topic or question..."
              className="w-full p-4 rounded-lg bg-black border border-zinc-700 outline-none"
            />

            <div className="mt-6">

              <label className="block mb-2">
                Language
              </label>

              <select
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value)
                }
                className="w-full p-3 rounded-lg bg-black border border-zinc-700"
              >
                <option value="en">
                  English
                </option>

                <option value="hi">
                  Hindi
                </option>

              </select>

            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full mt-6 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              {loading
                ? "Generating..."
                : "Generate Summary"}
            </button>

          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

            <div className="flex items-center justify-between mb-4">

              <h2 className="text-2xl font-semibold">
                Generated Summary
              </h2>

              <div className="flex gap-2">

                <button
                  onClick={handleCopy}
                  disabled={!summary}
                  className="px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700"
                >
                  Copy
                </button>

                <button
                  onClick={handleDownload}
                  disabled={!summary}
                  className="px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700"
                >
                  Download
                </button>

              </div>

            </div>

            {loading ? (
              <div className="h-[500px] flex items-center justify-center">
                <p>Generating summary...</p>
              </div>
            ) : summary ? (
              <textarea
                readOnly
                value={summary}
                className="w-full h-[500px] p-4 rounded-lg bg-black border border-zinc-700 outline-none whitespace-pre-wrap"
              />
            ) : (
              <div className="h-[500px] flex items-center justify-center border border-dashed border-zinc-700 rounded-lg">
                <p className="text-zinc-400">
                  Your generated summary will appear here.
                </p>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}