import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true },
    role: { type: String },
    link: { type: String },
    technologies: { type: String },
    startDate: { type: String },
    endDate: { type: String },   
    description: [{ type: String }],
  },
  { timestamps: true }
);

const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;
