import { NextRequest, NextResponse } from "next/server";
import { generateResumeOptimizationPrompt } from "@/lib/actions/gemini.actions";
import ResumeSuggestion from "@/lib/models/resumeSuggestion.model";
import { connectToDB } from "@/lib/mongoose";

export async function POST(req: NextRequest) {
  await connectToDB();

  const { resumeId, resumeContent, jobDescription, jobRequirements } = await req.json();

  if (!resumeId) {
    return NextResponse.json({ error: "Missing resumeId" }, { status: 400 });
  }

  const suggestions = await generateResumeOptimizationPrompt({
    resumeContent,
    jobDescription,
    jobRequirements,
  });

  //remove old suggestions first
  await ResumeSuggestion.deleteMany({ resumeId });

  //Save new ones
  await ResumeSuggestion.insertMany(
    suggestions.map((s: any) => ({
      resumeId,
      section: s.section,
      category: s.category,
      suggestion: s.suggestion,
    }))
  );

  return NextResponse.json({ suggestions });
}


export async function GET(req: NextRequest) {
  await connectToDB();

  const { searchParams } = new URL(req.url);
  const resumeId = searchParams.get("id");

  if (!resumeId) {
    return NextResponse.json({ suggestions: [] }, { status: 400 });
  }

  const suggestions = await ResumeSuggestion.find({ resumeId });

  return NextResponse.json({ suggestions });
}
