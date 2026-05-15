"use client";

import { useState } from "react";
import { BrainCircuit, Loader2, Plus, Trash2 } from "lucide-react";

type NeuralWeaverInput = {
  documents: string[];
  goal: string;
  language: string;
};

export default function NeuralWeaverClient() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<NeuralWeaverInput>({
    documents: [""],
    goal: "",
    language: "en",
  });

  const [result, setResult] = useState("");

  const handleDocumentChange = (index: number, value: string) => {
    const updatedDocs = [...formData.documents];
    updatedDocs[index] = value;

    setFormData({
      ...formData,
      documents: updatedDocs,
    });
  };

  const addDocument = () => {
    setFormData({
      ...formData,
      documents: [...formData.documents, ""],
    });
  };

  const removeDocument = (index: number) => {
    const updatedDocs = formData.documents.filter((_, i) => i !== index);

    setFormData({
      ...formData,
      documents: updatedDocs,
    });
  };

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

  const generateContent = async () => {
    try {
      if (!formData.goal.trim()) {
        alert("Please enter a goal");
        return;
      }

      if (
        formData.documents.length === 0 ||
        formData.documents.every((doc) => !doc.trim())
      ) {
        alert("Please add at least one document");
        return;
      }

      setLoading(true);
      setResult("");

      const res = await fetch("/api/neural-weaver", {
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

      setResult(data.synthesizedContent);
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
            <BrainCircuit className="text-purple-400" size={34} />
            <h1 className="text-3xl font-bold">
              Neural Weaver AI
            </h1>
          </div>

          <div className="space-y-5">

            {/* GOAL */}
            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Final Goal
              </label>

              <input
                type="text"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                placeholder="Example: Blog post, Research report..."
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

            {/* DOCUMENTS */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm text-zinc-400">
                  Source Documents
                </label>

                <button
                  onClick={addDocument}
                  className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 px-3 py-2 rounded-lg text-sm"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>

              <div className="space-y-4">
                {formData.documents.map((doc, index) => (
                  <div key={index} className="relative">

                    <textarea
                      value={doc}
                      onChange={(e) =>
                        handleDocumentChange(index, e.target.value)
                      }
                      placeholder={`Document ${index + 1}`}
                      className="w-full h-40 bg-zinc-800 border border-zinc-700 rounded-xl p-4 pr-12"
                    />

                    {formData.documents.length > 1 && (
                      <button
                        onClick={() => removeDocument(index)}
                        className="absolute top-3 right-3 text-red-400 hover:text-red-500"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={generateContent}
              disabled={loading}
              className="w-full bg-purple-500 hover:bg-purple-600 transition-all rounded-xl p-3 font-semibold text-lg disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  Synthesizing...
                </span>
              ) : (
                "Generate Content"
              )}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl overflow-auto">

          <h2 className="text-2xl font-bold mb-4">
            Synthesized Content
          </h2>

          {result ? (
            <div
              className="prose prose-invert max-w-none leading-8"
              dangerouslySetInnerHTML={{
                __html: result.replace(/\n/g, "<br />"),
              }}
            />
          ) : (
            <div className="text-zinc-500 text-lg">
              Your AI-generated synthesized content will appear here 🧠
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
