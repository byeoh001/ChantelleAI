import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import React from "react";

const ProjectsPreview = () => {
  const { formData } = useFormContext();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
  };

  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{
          color: formData?.themeColor || themeColors[0],
        }}
      >
        Personal Projects
      </h2>
      <hr
        style={{
          borderColor: formData?.themeColor || themeColors[0],
        }}
      />

      {formData?.projects?.map((project: any, index: number) => (
        <div key={index} className="my-5">
          <h3
            className="text-sm font-bold"
            style={{
              color: formData?.themeColor || themeColors[0],
            }}
          >
            {project.projectName}
          </h3>

          <div className="flex justify-between text-xs text-gray-700 italic">
            <span className="font-medium">{project.role}</span>
            <span className="text-gray-600 not-italic">
                {project.startDate && formatDate(project.startDate)} –{" "}
                {project.endDate ? formatDate(project.endDate) : "Present"}
            </span>
          </div>

          {project.link && (
            <p className="text-xs text-gray-600 mt-1">
                <span className="text-xs">Project Link:</span>{" "}
                <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all"
                >
                {project.link}
                </a>
            </p>
            )}


          {project.technologies && (
            <p className="text-xs text-gray-600 mt-1">
              <strong>Tech Stack:</strong> {project.technologies}
            </p>
          )}


          {project.description && (
            <p className="text-xs my-2 text-justify">{project.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectsPreview;
