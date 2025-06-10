
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuid4 } from "uuid";
import Resume from "../../../lib/models/resume.model";
import { connectToDB } from "@/lib/mongoose";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const resumeId = formData.get("resumeId") as string;

    if (!file || !resumeId) {
      return NextResponse.json({ error: "Missing file or resumeId" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${uuid4()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    await mkdir(uploadDir, { recursive: true });
    
    await writeFile(`${uploadDir}/${filename}`, new Uint8Array(buffer));

    const imageUrl = `/uploads/${filename}`;

    await connectToDB();
    const updatedResume = await Resume.findOneAndUpdate(
      { resumeId },
      { imageUrl },
      { new: true }
    );

    return NextResponse.json({ success: true, imageUrl: updatedResume.imageUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
  }
}
