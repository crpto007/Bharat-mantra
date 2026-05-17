"use client";

import { useState } from "react";

type HealthPlannerInput = {
  goal: string;
  fitnessLevel: string;
  dietaryPreference: string;
  allergies?: string;
  daysPerWeek: number;
  language: string;
};

export default function Page() {
  const [loading, setLoading] = useState(false);

  const [plan, setPlan] = useState("");

  const [formData, setFormData] =
    useState<HealthPlannerInput>({
      goal: "Build Muscle",
      fitnessLevel: "Beginner",
      dietaryPreference: "Anything",
      allergies: "",
      daysPerWeek: 5,
      language: "en",
    });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,

      [e.target.name]:
        e.target.name === "daysPerWeek"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  async function generatePlan() {
    try {
      setLoading(true);
      setPlan("");

      const res = await fetch(
        "/api/health-planner",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
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

      setPlan(data.plan);

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
            AI Health Planner
          </h1>

          <div className="space-y-5">

            <div>
              <label className="block mb-2">
                Fitness Goal
              </label>

              <select
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                className="w-full bg-black border border-zinc-700 rounded-xl p-3"
              >
                <option>
                  Lose Weight
                </option>

                <option>
                  Build Muscle
                </option>

                <option>
                  Maintain Fitness
                </option>

              </select>
            </div>

            <div>
              <label className="block mb-2">
                Fitness Level
              </label>

              <select
                name="fitnessLevel"
                value={formData.fitnessLevel}
                onChange={handleChange}
                className="w-full bg-black border border-zinc-700 rounded-xl p-3"
              >
                <option>
                  Beginner
                </option>

                <option>
                  Intermediate
                </option>

                <option>
                  Advanced
                </option>

              </select>
            </div>

            <div>
              <label className="block mb-2">
                Dietary Preference
              </label>

              <select
                name="dietaryPreference"
                value={formData.dietaryPreference}
                onChange={handleChange}
                className="w-full bg-black border border-zinc-700 rounded-xl p-3"
              >
                <option>
                  Anything
                </option>

                <option>
                  Vegetarian
                </option>

                <option>
                  Vegan
                </option>

                <option>
                  Keto
                </option>

                <option>
                  Paleo
                </option>

              </select>
            </div>

            <div>
              <label className="block mb-2">
                Allergies
              </label>

              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="Example: Milk, Peanut"
                className="w-full bg-black border border-zinc-700 rounded-xl p-3 h-24"
              />
            </div>

            <div>
              <label className="block mb-2">
                Workout Days
              </label>

              <input
                type="number"
                min={1}
                max={7}
                name="daysPerWeek"
                value={formData.daysPerWeek}
                onChange={handleChange}
                className="w-full bg-black border border-zinc-700 rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block mb-2">
                Language
              </label>

              <select
                name="language"
                value={formData.language}
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
              onClick={generatePlan}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 rounded-xl p-3 text-lg font-semibold"
            >
              {loading
                ? "Generating..."
                : "Generate Health Plan"}
            </button>

          </div>

        </div>

        {/* RIGHT */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 overflow-auto">

          <h2 className="text-3xl font-bold mb-4">
            Your Personalized Plan
          </h2>

          {plan ? (
            <div
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: plan.replace(
                  /\n/g,
                  "<br />"
                ),
              }}
            />
          ) : (
            <div className="text-zinc-500 text-lg">
              Your AI-generated fitness and meal plan will appear here 🚀
            </div>
          )}

        </div>

      </div>

    </div>
  );
}