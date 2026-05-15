"use client";

import { useState } from "react";
import {
  WandSparkles,
  Loader2,
  Copy,
  Check,
} from "lucide-react";

type EnhancePromptForChatbotInput = {
  prompt: string;
  language: string;
};

export default function PromptEnhancerClient() {
  const [loading, setLoading] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] =
    useState<EnhancePromptForChatbotInput>({
      prompt: "",
      language: "en",
    });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const enhancePrompt = async () => {
    try {
      if (!formData.prompt.trim()) {
        alert("Please enter a prompt");
        return;
      }

      setLoading(true);
      setEnhancedPrompt("");

      const res = await fetch("/api/prompt-enhancer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setEnhancedPrompt(data.enhancedPrompt);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(enhancedPrompt);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">

        {/* LEFT PANEL */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">

          <div className="flex items-center gap-3 mb-6">
            <WandSparkles className="text-cyan-400" size={34} />
            <h1 className="text-3xl font-bold">
              AI Prompt Enhancer
            </h1>
          </div>

          <div className="space-y-5">

            {/* PROMPT */}
            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Original Prompt
              </label>

              <textarea
                name="prompt"
                value={formData.prompt}
                onChange={handleChange}
                placeholder="Enter your basic prompt here..."
                className="w-full h-64 bg-zinc-800 border border-zinc-700 rounded-xl p-4 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* LANGUAGE */}
            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Language
              </label>

              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>

            {/* BUTTON */}
            <button
              onClick={enhancePrompt}
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 transition-all rounded-xl p-3 font-semibold text-lg text-black disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  Enhancing...
                </span>
              ) : (
                "Enhance Prompt"
              )}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl overflow-auto">

          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold">
              Enhanced Prompt
            </h2>

            {enhancedPrompt && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-black px-4 py-2 rounded-lg font-medium"
              >
                {copied ? (
                  <>
                    <Check size={18} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copy
                  </>
                )}
              </button>
            )}
          </div>

          {enhancedPrompt ? (
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5 whitespace-pre-wrap leading-8 text-zinc-200">
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
