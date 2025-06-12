import mongoose from "mongoose";

const suggestionSchema = new mongoose.Schema(
  {
    resumeId: { type: String, required: true },
    section: { type: String, required: true }, 
    category: { type: String, required: true },
    suggestion: { type: String, required: true },
  },
  { timestamps: true }
);

const ResumeSuggestion =
  mongoose.models.ResumeSuggestion ||
  mongoose.model("ResumeSuggestion", suggestionSchema);

export default ResumeSuggestion;
