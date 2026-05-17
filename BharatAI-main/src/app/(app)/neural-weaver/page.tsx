"use client";

import { useState } from "react";

type NeuralWeaverInput = {
  documents: string[];
  goal: string;
  language: string;
};

export default function Page() {
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState("");

  const [formData, setFormData] = useState<NeuralWeaverInput>({
    documents: [""],
    goal: "",
    language: "en",
  });

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
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  async function generateContent() {
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

      setResult(data.synthesizedContent);
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error ? error.message : "Something went wrong.";

      setResult(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
        {/* LEFT */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h1 className="text-4xl font-bold mb-6">Neural Weaver AI</h1>

          <div className="space-y-5">
            <div>
              <label className="block mb-2">Final Goal</label>

              <input
                type="text"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                placeholder="Example: Blog post, Research report..."
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

            <div>
              <div className="flex items-center justify-between mb-3">
                <label>Source Documents</label>

                <button
                  onClick={addDocument}
                  className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg"
                >
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
                      className="w-full h-40 bg-black border border-zinc-700 rounded-xl p-4"
                    />

                    {formData.documents.length > 1 && (
                      <button
                        onClick={() => removeDocument(index)}
                        className="absolute top-3 right-3 text-red-400"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={generateContent}
              disabled={loading}
              className="w-full bg-purple-500 hover:bg-purple-600 rounded-xl p-3 text-lg font-semibold"
            >
              {loading ? "Synthesizing..." : "Generate Content"}
            </button>
          </div>
        </div>

        {/* RIGHT */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 overflow-auto">
          <h2 className="text-3xl font-bold mb-4">Synthesized Content</h2>

          {result ? (
            <div
              className="whitespace-pre-wrap leading-8"
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
