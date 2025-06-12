import { NextRequest, NextResponse } from "next/server";
import { incorporateSuggestionIntoDescription } from "@/lib/actions/gemini.actions";

export async function POST(req: NextRequest) {
  const { original, suggestion } = await req.json();

  if (!original || !suggestion) {
    return NextResponse.json(
      { error: "Missing original text or suggestion." },
      { status: 400 }
    );
  }

  const improved = await incorporateSuggestionIntoDescription({ original, suggestion });

  return NextResponse.json({ improved });
}
