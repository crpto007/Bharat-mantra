"use client";

import { useState } from "react";
import { Scale, Loader2 } from "lucide-react";

type SimplifyIndianLawInput = {
  topic: string;
  targetLanguage: "en" | "hi";
};

export default function LawExplainerClient() {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState("");

  const [formData, setFormData] = useState<SimplifyIndianLawInput>({
    topic: "",
    targetLanguage: "en",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const explainLaw = async () => {
    try {
      if (!formData.topic.trim()) {
        alert("Please enter a law topic");
        return;
      }

      setLoading(true);
      setExplanation("");

      const res = await fetch("/api/law-explainer", {
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

      setExplanation(data.explanation);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">

        {/* LEFT PANEL */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">

          <div className="flex items-center gap-3 mb-6">
            <Scale className="text-blue-400" size={34} />
            <h1 className="text-3xl font-bold">
              Indian Law Explainer
            </h1>
          </div>

          <div className="space-y-5">

            {/* TOPIC */}
            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Enter Law / Act / Rule
              </label>

              <textarea
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="Example: Article 370, IPC Section 420, RTI Act..."
                className="w-full h-40 bg-zinc-800 border border-zinc-700 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* LANGUAGE */}
            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Select Language
              </label>

              <select
                name="targetLanguage"
                value={formData.targetLanguage}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>

            {/* BUTTON */}
            <button
              onClick={explainLaw}
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 transition-all rounded-xl p-3 font-semibold text-lg disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  Explaining...
                </span>
              ) : (
                "Explain Law"
              )}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl overflow-auto">

          <h2 className="text-2xl font-bold mb-4">
            Detailed Explanation
          </h2>

          {explanation ? (
            <div
              className="prose prose-invert max-w-none leading-8"
              dangerouslySetInnerHTML={{
                __html: explanation.replace(/\n/g, "<br />"),
              }}
            />
          ) : (
            <div className="text-zinc-500 text-lg">
              The detailed explanation of the law will appear here ⚖️
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
