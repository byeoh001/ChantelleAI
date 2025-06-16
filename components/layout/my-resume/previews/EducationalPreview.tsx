import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import React from "react";

const EducationalPreview = () => {
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
        Education
      </h2>
      <hr
        style={{
          borderColor: formData?.themeColor || themeColors[0],
        }}
      />

      {formData?.education.map((education: any, index: number) => (
        <div key={index} className="my-5">
          <h2
            className="text-sm font-bold"
            style={{
              color: formData?.themeColor || themeColors[0],
            }}
          >
            {education.universityName}
          </h2>
          <h2 className="text-xs flex justify-between">
            {education?.degree}
            {education?.degree && education?.major && " in "}
            {education?.major}
           <span className="text-xs text-gray-600">
              {formatDate(education?.startDate)}
              {" – "}
              {education?.endDate === "" ? "Present" : formatDate(education?.endDate)}
            </span>
          </h2>
          {education?.description && (
            <ul className="list-disc pl-5 text-xs my-2">
              {(Array.isArray(education.description)
                ? education.description
                : education.description.split('\n')
              ).map((line: string, i: number) => (
                <li key={i}>{line.replace(/^•\s?/, '')}</li>
              ))}
            </ul>
          )}

        </div>
      ))}
    </div>
  );
};

export default EducationalPreview;
