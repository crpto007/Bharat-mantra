"use client";

import { useState } from "react";
import { Loader2, HeartPulse } from "lucide-react";

type HealthPlannerInput = {
  goal: "Lose Weight" | "Build Muscle" | "Maintain Fitness";
  fitnessLevel: "Beginner" | "Intermediate" | "Advanced";
  dietaryPreference: "Anything" | "Vegetarian" | "Vegan" | "Keto" | "Paleo";
  allergies?: string;
  daysPerWeek: number;
  language: string;
};

export default function HealthPlannerClient() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("");

  const [formData, setFormData] = useState<HealthPlannerInput>({
    goal: "Build Muscle",
    fitnessLevel: "Beginner",
    dietaryPreference: "Anything",
    allergies: "",
    daysPerWeek: 5,
    language: "en",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
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

  const generatePlan = async () => {
    try {
      setLoading(true);
      setPlan("");

      const res = await fetch("/api/health-planner", {
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

      setPlan(data.plan);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8">

        {/* LEFT SIDE */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          
          <div className="flex items-center gap-3 mb-6">
            <HeartPulse className="text-green-400" size={32} />
            <h1 className="text-3xl font-bold">
              AI Health Planner
            </h1>
          </div>

          <div className="space-y-5">

            {/* GOAL */}
            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Fitness Goal
              </label>

              <select
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3"
              >
                <option>Lose Weight</option>
                <option>Build Muscle</option>
                <option>Maintain Fitness</option>
              </select>
            </div>

            {/* FITNESS */}
            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Fitness Level
              </label>

              <select
                name="fitnessLevel"
                value={formData.fitnessLevel}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            {/* DIET */}
            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Dietary Preference
              </label>

              <select
                name="dietaryPreference"
                value={formData.dietaryPreference}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3"
              >
                <option>Anything</option>
                <option>Vegetarian</option>
                <option>Vegan</option>
                <option>Keto</option>
                <option>Paleo</option>
              </select>
            </div>

            {/* ALLERGIES */}
            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Allergies / Restrictions
              </label>

              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="Example: Peanut, Milk"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 h-24"
              />
            </div>

            {/* DAYS */}
            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Workout Days Per Week
              </label>

              <input
                type="number"
                min={1}
                max={7}
                name="daysPerWeek"
                value={formData.daysPerWeek}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3"
              />
            </div>

            {/* LANGUAGE */}
            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Response Language
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
              onClick={generatePlan}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 transition-all rounded-xl p-3 font-semibold text-lg disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  Generating...
                </span>
              ) : (
                "Generate Health Plan"
              )}
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl overflow-auto">

          <h2 className="text-2xl font-bold mb-4">
            Your Personalized Plan
          </h2>

          {plan ? (
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: plan.replace(/\n/g, "<br />"),
              }}
            />
          ) : (
            <div className="text-zinc-500 text-lg">
              Your AI-generated fitness & meal plan will appear here 🚀
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
