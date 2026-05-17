"use client";

import { useState } from "react";

type PresentationGuideInput = {
  topic: string;
  audience: string;
  numberOfSlides: number;
  language: string;
};

type PresentationGuideOutput = {
  outline: string;
  script: string;
  imagePrompts: string[];
};

export default function Page() {
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<PresentationGuideOutput | null>(null);

  const [formData, setFormData] = useState<PresentationGuideInput>({
    topic: "",
    audience: "",
    numberOfSlides: 10,
    language: "en",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,

      [e.target.name]:
        e.target.name === "numberOfSlides"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  async function generatePresentation() {
    try {
      if (!formData.topic.trim()) {
        alert("Please enter presentation topic");

        return;
      }

      if (!formData.audience.trim()) {
        alert("Please enter target audience");

        return;
      }

      setLoading(true);
      setResult(null);

      const res = await fetch("/api/presentation-guide", {
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

      setResult(data);
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error ? error.message : "Something went wrong.";

      setResult({
        outline: message,
        script: "",
        imagePrompts: [],
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
        {/* LEFT */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h1 className="text-4xl font-bold mb-6">AI Presentation Guide</h1>

          <div className="space-y-5">
            <div>
              <label className="block mb-2">Presentation Topic</label>

              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="Example: Artificial Intelligence"
                className="w-full bg-black border border-zinc-700 rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block mb-2">Target Audience</label>

              <input
                type="text"
                name="audience"
                value={formData.audience}
                onChange={handleChange}
                placeholder="Example: College Students"
                className="w-full bg-black border border-zinc-700 rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block mb-2">Number of Slides</label>

              <input
                type="number"
                min={5}
                max={20}
                name="numberOfSlides"
                value={formData.numberOfSlides}
                onChange={handleChange}
                className="w-full bg-black border border-zinc-700 rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block mb-2">Language</label>

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
              onClick={generatePresentation}
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 rounded-xl p-3 text-lg font-semibold text-black"
            >
              {loading ? "Generating..." : "Generate Presentation"}
            </button>
          </div>
        </div>

        {/* RIGHT */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 overflow-auto">
          {!result ? (
            <div className="text-zinc-500 text-lg">
              Your AI-generated presentation content will appear here 🎤
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  Presentation Outline
                </h2>

                <div
                  className="whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: result.outline.replace(/\n/g, "<br />"),
                  }}
                />
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4">Full Script</h2>

                <div
                  className="whitespace-pre-wrap leading-8"
                  dangerouslySetInnerHTML={{
                    __html: result.script.replace(/\n/g, "<br />"),
                  }}
                />
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4">AI Image Prompts</h2>

                <div className="space-y-4">
                  {result.imagePrompts.map((prompt, index) => (
                    <div
                      key={index}
                      className="bg-black border border-zinc-700 rounded-xl p-4"
                    >
                      <p className="font-bold mb-2 text-pink-400">
                        Prompt {index + 1}
                      </p>

                      <p>{prompt}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
