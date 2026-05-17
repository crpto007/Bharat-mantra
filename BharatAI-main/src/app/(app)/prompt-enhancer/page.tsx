"use client";

import { useState } from "react";

type PromptInput = {
  prompt: string;
  language: string;
};

export default function Page() {
  const [loading, setLoading] = useState(false);

  const [enhancedPrompt, setEnhancedPrompt] = useState("");

  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState<PromptInput>({
    prompt: "",
    language: "en",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  async function enhancePrompt() {
    try {
      if (!formData.prompt.trim()) {
        alert("Please enter a prompt");

        return;
      }

      setLoading(true);
      setEnhancedPrompt("");

      const res = await fetch("/api/prompt-enhancer", {
        method: "POST",

<<<<<<< HEAD
        headers: {
          "Content-Type": "application/json",
        },
=======
          headers: {
            "Content-Type": "application/json",
          },
>>>>>>> main

        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setEnhancedPrompt(data.enhancedPrompt);
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error ? error.message : "Something went wrong.";

      setEnhancedPrompt(message);
    } finally {
      setLoading(false);
    }
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(enhancedPrompt);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
        {/* LEFT */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h1 className="text-4xl font-bold mb-6">AI Prompt Enhancer</h1>

          <div className="space-y-5">
            <div>
              <label className="block mb-2 text-zinc-400">
                Original Prompt
              </label>

              <textarea
                name="prompt"
                value={formData.prompt}
                onChange={handleChange}
                placeholder="Enter your prompt here..."
                className="w-full h-64 bg-black border border-zinc-700 rounded-xl p-4 outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 text-zinc-400">Language</label>

              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full bg-black border border-zinc-700 rounded-xl p-3"
              >
                <option value="en">English</option>

                <option value="hi">Hindi</option>
              </select>
            </div>

            <button
              onClick={enhancePrompt}
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 rounded-xl p-3 text-lg font-semibold text-black"
            >
              {loading ? "Enhancing..." : "Enhance Prompt"}
            </button>
          </div>
        </div>

        {/* RIGHT */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 overflow-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-3xl font-bold">Enhanced Prompt</h2>

            {enhancedPrompt && (
              <button
                onClick={copyToClipboard}
                className="bg-cyan-500 hover:bg-cyan-600 text-black px-4 py-2 rounded-lg font-semibold"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>

          {enhancedPrompt ? (
            <div className="bg-black border border-zinc-700 rounded-xl p-5 whitespace-pre-wrap leading-8">
              {enhancedPrompt}
            </div>
          ) : (
            <div className="text-zinc-500 text-lg">
              Your enhanced AI prompt will appear here ✨
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
