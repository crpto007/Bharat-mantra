"use client";

import { useState } from "react";

type LawInput = {
  topic: string;
  targetLanguage: "en" | "hi";
};

export default function Page() {
  const [loading, setLoading] = useState(false);

  const [explanation, setExplanation] =
    useState("");

  const [formData, setFormData] =
    useState<LawInput>({
      topic: "",
      targetLanguage: "en",
    });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  async function explainLaw() {
    try {
      if (!formData.topic.trim()) {
        alert("Please enter a law topic");
        return;
      }

      setLoading(true);
      setExplanation("");

      const res = await fetch(
        "/api/law-explainer",
        {
          method: "POST",

          headers: {
  Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
  "Content-Type": "application/json",
  "HTTP-Referer": "https://bharat-mantra.vercel.app",
  "X-Title": "Bharat Mantra"
},

          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Something went wrong"
        );
      }

      setExplanation(data.explanation);

    } catch (error: any) {
      console.error(error);

      alert(error.message);

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">

        {/* LEFT */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

          <h1 className="text-4xl font-bold mb-6">
            Indian Law Explainer
          </h1>

          <div className="space-y-5">

            <div>

              <label className="block mb-2 text-zinc-400">
                Enter Law / Act / Rule
              </label>

              <textarea
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="Example: Article 370, RTI Act, IPC Section 420..."
                className="w-full h-40 bg-black border border-zinc-700 rounded-xl p-4 outline-none"
              />

            </div>

            <div>

              <label className="block mb-2 text-zinc-400">
                Select Language
              </label>

              <select
                name="targetLanguage"
                value={formData.targetLanguage}
                onChange={handleChange}
                className="w-full bg-black border border-zinc-700 rounded-xl p-3"
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
              onClick={explainLaw}
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 rounded-xl p-3 text-lg font-semibold"
            >
              {loading
                ? "Explaining..."
                : "Explain Law"}
            </button>

          </div>

        </div>

        {/* RIGHT */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 overflow-auto">

          <h2 className="text-3xl font-bold mb-4">
            Detailed Explanation
          </h2>

          {explanation ? (
            <div
              className="whitespace-pre-wrap leading-8"
              dangerouslySetInnerHTML={{
                __html: explanation.replace(
                  /\n/g,
                  "<br />"
                ),
              }}
            />
          ) : (
            <div className="text-zinc-500 text-lg">
              The detailed explanation will appear here ⚖️
            </div>
          )}

        </div>

      </div>

    </div>
  );
}