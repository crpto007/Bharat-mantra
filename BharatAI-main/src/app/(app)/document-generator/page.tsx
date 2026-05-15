"use client";

import { useState } from "react";

export default function Page() {
  const [docType, setDocType] = useState("");
  const [details, setDetails] = useState("");

  const [generatedDoc, setGeneratedDoc] =
    useState("");

  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!docType.trim() || !details.trim())
      return;

    try {
      setLoading(true);

      const res = await fetch(
        "/api/document-generator",
        {
          method: "POST",

          headers: {
  Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
  "Content-Type": "application/json",
  "HTTP-Referer": "https://bharat-mantra.vercel.app",
  "X-Title": "Bharat Mantra"
},

          body: JSON.stringify({
            docType,
            details,
            language: "en",
          }),
        }
      );

      const data = await res.json();

      setGeneratedDoc(data.generatedDoc);

    } catch (error) {
      console.error(error);

      setGeneratedDoc("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-6">
          Legal Document Generator
        </h1>

        <input
          type="text"
          value={docType}
          onChange={(e) =>
            setDocType(e.target.value)
          }
          placeholder="Enter document type (e.g. NDA)"
          className="w-full p-4 rounded-lg bg-zinc-900 border border-zinc-700 outline-none"
        />

        <textarea
          value={details}
          onChange={(e) =>
            setDetails(e.target.value)
          }
          placeholder="Enter all document details..."
          rows={10}
          className="w-full mt-6 p-4 rounded-lg bg-zinc-900 border border-zinc-700 outline-none"
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-6 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          {loading
            ? "Generating..."
            : "Generate Document"}
        </button>

        {generatedDoc && (
          <div className="mt-8 p-6 rounded-lg bg-zinc-900 border border-zinc-700">
            <h2 className="text-2xl font-semibold mb-4">
              Generated Document
            </h2>

            <div className="whitespace-pre-wrap">
              {generatedDoc}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}