"use client";

import { useState } from "react";
import {
  Presentation,
  Loader2,
  ImageIcon,
  FileText,
} from "lucide-react";

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

export default function PresentationGuideClient() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<PresentationGuideInput>({
    topic: "",
    audience: "",
    numberOfSlides: 10,
    language: "en",
  });

  const [result, setResult] =
    useState<PresentationGuideOutput | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "numberOfSlides"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const generatePresentation = async () => {
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
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">

        {/* LEFT PANEL */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">

          <div className="flex items-center gap-3 mb-6">
            <Presentation className="text-yellow-400" size={34} />
            <h1 className="text-3xl font-bold">
              AI Presentation Guide
            </h1>
          </div>

          <div className="space-y-5">

            {/* TOPIC */}
            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Presentation Topic
              </label>

              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="Example: Artificial Intelligence"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3"
              />
            </div>

            {/* AUDIENCE */}
            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Target Audience
              </label>

              <input
                type="text"
                name="audience"
                value={formData.audience}
                onChange={handleChange}
                placeholder="Example: College Students"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3"
              />
            </div>

            {/* SLIDES */}
            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Number of Slides
              </label>

              <input
                type="number"
                min={5}
                max={20}
                name="numberOfSlides"
                value={formData.numberOfSlides}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3"
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
              onClick={generatePresentation}
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 transition-all rounded-xl p-3 font-semibold text-lg text-black disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  Generating...
                </span>
              ) : (
                "Generate Presentation"
              )}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl overflow-auto">

          {!result ? (
            <div className="text-zinc-500 text-lg">
              Your AI-generated presentation outline, script, and image prompts
              will appear here 🎤
            </div>
          ) : (
            <div className="space-y-8">

              {/* OUTLINE */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="text-yellow-400" />
                  <h2 className="text-2xl font-bold">
                    Presentation Outline
                  </h2>
                </div>

                <div
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: result.outline.replace(/\n/g, "<br />"),
                  }}
                />
              </div>

              {/* SCRIPT */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Presentation className="text-green-400" />
                  <h2 className="text-2xl font-bold">
                    Full Presentation Script
                  </h2>
                </div>

                <div
                  className="prose prose-invert max-w-none leading-8"
                  dangerouslySetInnerHTML={{
                    __html: result.script.replace(/\n/g, "<br />"),
                  }}
                />
              </div>

              {/* IMAGE PROMPTS */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ImageIcon className="text-pink-400" />
                  <h2 className="text-2xl font-bold">
                    AI Image Prompts
                  </h2>
                </div>

                <div className="space-y-4">
                  {result.imagePrompts.map((prompt, index) => (
                    <div
                      key={index}
                      className="bg-zinc-800 border border-zinc-700 rounded-xl p-4"
                    >
                      <p className="font-semibold mb-2 text-pink-400">
                        Prompt {index + 1}
                      </p>

                      <p className="text-zinc-300 leading-7">
                        {prompt}
                      </p>
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
