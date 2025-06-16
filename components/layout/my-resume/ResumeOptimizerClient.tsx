"use client";

import React, { useState } from "react";
import BulletGenerator from "@/components/common/BulletPointGenerator";

export default function ResumeOptimizerClient({ resumeContent, resumeId, }: { resumeContent: string; resumeId: string }) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasOptimized, setHasOptimized] = useState(false);


  const handleOptimize = async () => {
    setLoading(true);
    const jobDesc = (document.getElementById("jobDescription") as HTMLTextAreaElement)?.value || "";
    const jobReqs = (document.getElementById("jobRequirements") as HTMLTextAreaElement)?.value || "";

    const res = await fetch("/api/optimize-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resumeId,
        resumeContent,
        jobDescription: jobDesc,
        jobRequirements: jobReqs,
      }),
    });

    const data = await res.json();
    setSuggestions(data.suggestions || []);
    setLoading(false);
    setHasOptimized(true);
  };


  const handleEdit = () => {
    window.location.href = `/my-resume/${resumeId}/edit`;
  };


  return (
    <div>
      {/* Job Description Input */}
      <div className="relative mb-2">
        <label className="block text-base font-semibold text-gray-700 text-center">Job Description</label>
        <div className="absolute top-0 right-0">
          <BulletGenerator targetId="jobDescription" />
        </div>
        <textarea
          id="jobDescription"
          rows={3}
          placeholder="Insert job description here in bullet-point format..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Job Requirements Input */}
      <div className="relative mb-2">
        <label className="block text-base font-semibold text-gray-700 text-center">Job Requirements</label>
        <div className="absolute top-0 right-0">
          <BulletGenerator targetId="jobRequirements" />
        </div>
        <textarea
          id="jobRequirements"
          rows={3}
          placeholder="Insert job requirements here in bullet-point format..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Optimize Button */}
      <div className="flex gap-2 mt-2">
        {hasOptimized ? (
          <>
            <button
              onClick={handleOptimize}
              className="w-1/2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              {loading ? "Optimizing..." : "Optimize Again"}
            </button>

            <button
              onClick={handleEdit}
              className="w-1/2 bg-gray-100 text-gray-800 text-center py-2 rounded-lg hover:bg-gray-200 transition border"
            >
              Back to Edit
            </button>
          </>
        ) : (
          <button
            onClick={handleOptimize}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            {loading ? "Optimizing..." : "Optimize"}
          </button>
        )}
      </div>


      <div className="p-4 mt-4 rounded-lg bg-white shadow-md border">
        <h3 className="text-base font-semibold text-gray-700 mb-2 border-b pb-1 text-center">
            🧠 ChantelleAI's Analysis 🧠
        </h3>

        <div className="max-h-40 overflow-y-auto pr-2 min-h-[168px]">
            {suggestions.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 leading-relaxed">
                {suggestions.map((suggestion, index) => (
                <li key={index}>
                    <strong className="capitalize">{suggestion.category}:</strong> {suggestion.suggestion}
                </li>
                ))}
            </ul>
            ) : (
            <p className="text-sm text-gray-400 italic text-center">No suggestions yet.</p>
            )}
        </div>
      </div>

    </div>
  );
}
