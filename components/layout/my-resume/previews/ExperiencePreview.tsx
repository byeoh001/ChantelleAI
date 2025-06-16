import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import React from "react";

const ExperiencePreview = () => {
  const { formData } = useFormContext();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
  };

  console.log("Preview FormData Experience:", formData?.experience);


  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{
          color: formData?.themeColor || themeColors[0],
        }}
      >
        Professional Experience
      </h2>
      <hr
        style={{
          borderColor: formData?.themeColor || themeColors[0],
        }}
      />

      {formData?.experience?.map((experience: any, index: number) => (
        <div key={index} className="my-5">
          <h2
            className="text-sm font-bold"
            style={{
              color: formData?.themeColor || themeColors[0],
            }}
          >
            {experience?.title}
          </h2>
          <h2 className="text-xs flex justify-between">
            {experience?.companyName}
            {experience?.companyName && experience?.city && ", "}
            {experience?.city}
            {experience?.city && experience?.state && ", "}
            {experience?.state}
            <span className="text-xs text-gray-600">
              {formatDate(experience?.startDate)}
              {" – "}
              {experience?.endDate === "" ? "Present" : formatDate(experience?.endDate)}
            </span>
          </h2>
          {experience?.workSummary && (
            <ul className="list-disc pl-5 text-xs my-2">
              {(Array.isArray(experience.workSummary)
                ? experience.workSummary
                : experience.workSummary.split("\n")
              ).map((line: string, i: number) => (
                <li key={i}>{line.replace(/^•\s?/, "")}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExperiencePreview;
