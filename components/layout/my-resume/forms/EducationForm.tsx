"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { generateEducationDescription } from "@/lib/actions/gemini.actions";
import { addEducationToResume } from "@/lib/actions/resume.actions";
import { useFormContext } from "@/lib/context/FormProvider";
import { Brain, Loader2, Minus, Plus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type Suggestion = {
  category: string;
  suggestion: string;
  section: string;
};



const EducationForm = ({ params }: { params: { id: string } }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const { formData, handleInputChange } = useFormContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiGeneratedDescriptionList, setAiGeneratedDescriptionList] = useState(
    [] as any
  );
  const [educationList, setEducationList] = useState(
    formData?.education.length > 0
      ? formData?.education
      : [
          {
            universityName: "",
            degree: "",
            major: "",
            startDate: "",
            endDate: "",
            description: "",
          },
        ]
  );
  const [currentAiIndex, setCurrentAiIndex] = useState(
    educationList.length - 1
  );
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [aiTips, setAiTips] = useState<string[]>([]);

  useEffect(() => {
    async function fetchSuggestions() {
      const res = await fetch(`/api/optimize-resume?id=${params.id}`);
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    }

    fetchSuggestions();
  }, [params.id]);



  useEffect(() => {
    educationList.forEach((education: any, index: number) => {
      const textarea = document.getElementById(`description-${index}`) as any;
      if (textarea) {
        textarea.value = education.description;
      }
    });
  }, [educationList]);

  const handleChange = (event: any, index: number) => {
    const newEntries = educationList.slice();
    const { name, value } = event.target;
    newEntries[index][name] = value;
    setEducationList(newEntries);

    handleInputChange({
      target: {
        name: "education",
        value: newEntries,
      },
    });
  };

  const AddNewEducation = () => {
    const newEntries = [
      ...educationList,
      {
        universityName: "",
        degree: "",
        major: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ];
    setEducationList(newEntries);

    handleInputChange({
      target: {
        name: "education",
        value: newEntries,
      },
    });
  };

  const RemoveEducation = () => {
    const newEntries = educationList.slice(0, -1);
    setEducationList(newEntries);

    if (currentAiIndex > newEntries.length - 1) {
      setCurrentAiIndex(newEntries.length - 1);
    }

    handleInputChange({
      target: {
        name: "education",
        value: newEntries,
      },
    });
  };

  const generateEducationDescriptionFromAI = async (index: number) => {
    if (
      !formData?.education[index]?.universityName ||
      formData?.education[index]?.universityName === "" ||
      !formData?.education[index]?.degree ||
      formData?.education[index]?.degree === "" ||
      !formData?.education[index]?.major ||
      formData?.education[index]?.major === ""
    ) {
      toast({
        title: "Uh Oh! Something went wrong.",
        description:
          "Please enter the name of institute, degree and major to generate description.",
        variant: "destructive",
        className: "bg-white border-2",
      });

      return;
    }

    setCurrentAiIndex(index);
    setIsAiLoading(true);

    const currentEdu = formData?.education[index];
    const promptInput = `${currentEdu.universityName} on ${currentEdu.degree} in ${currentEdu.major}`;

    // Try to use ChantelleAI suggestion first
    const relevantSuggestion = suggestions.find(
      (sugg) =>
        (sugg.category === "improvements" || sugg.category === "missing") &&
        sugg.section === "Education"
    );

    if (relevantSuggestion) {
      const currentDescription = formData?.education[index]?.description || "";

      try {
        const res = await fetch("/api/incorporate-suggestion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            original: currentDescription,
            suggestion: relevantSuggestion.suggestion,
          }),
        });

        const data = await res.json();
        const improvedDescription = data.improved;
        const cleanTip = improvedDescription.replace(/^"|"$/g, '');

        // Store suggestion for user to preview/click to apply
        setAiTips([cleanTip]);
      } catch (error) {
        console.error("Failed to fetch improved description:", error);
        toast({
          title: "AI Error",
          description: "Could not generate improved version.",
          variant: "destructive",
          className: "bg-white",
        });
      }

      setIsAiLoading(false);
      return;
    }


    //regular call
    const result = await generateEducationDescription(promptInput);

    setAiGeneratedDescriptionList(result);

    if (result && result.length > 0) {
      const newList = [...educationList];
      newList[index].description = result[0].description;

      setEducationList(newList);
      handleInputChange({
        target: {
          name: "education",
          value: newList,
        },
      });
    }

  setIsAiLoading(false);

  setTimeout(() => {
    listRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
};


  const onSave = async (e: any) => {
    e.preventDefault();

    setIsLoading(true);

    const educationToSubmit = (formData.education as any[]).map((entry) => ({
      ...entry,
      description: Array.isArray(entry.description)
        ? entry.description.join('\n')
        : entry.description,
    }));

    const result = await addEducationToResume(params.id, educationToSubmit);

    if (result.success) {
      toast({
        title: "Information saved.",
        description: "Educational details updated successfully.",
        className: "bg-white",
      });
    } else {
      toast({
        title: "Uh Oh! Something went wrong.",
        description: result?.error,
        variant: "destructive",
        className: "bg-white",
      });
    }

    setIsLoading(false);
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary-700 border-t-4 bg-white">
        <h2 className="text-lg font-semibold leading-none tracking-tight">
          Education
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Add your educational details
        </p>

        {educationList.map((item: any, index: number) => (
          <div key={index}>
            <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
              <div className="col-span-2 space-y-2">
                <label className="text-slate-700 font-semibold">
                  Name of Institute:
                </label>
                <Input
                  name="universityName"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.universityName}
                  className="no-focus"
                />
              </div>
              <div className="space-y-2">
                <label className="text-slate-700 font-semibold">Degree:</label>
                <Input
                  name="degree"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.degree}
                  className="no-focus"
                />
              </div>
              <div className="space-y-2">
                <label className="text-slate-700 font-semibold">Major:</label>
                <Input
                  name="major"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.major}
                  className="no-focus"
                />
              </div>
              <div className="space-y-2">
                <label className="text-slate-700 font-semibold">
                  Start Date:
                </label>
                <Input
                  type="date"
                  name="startDate"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.startDate}
                  className="no-focus"
                />
              </div>
              <div className="space-y-2">
                <label className="text-slate-700 font-semibold">
                  End Date:
                </label>
                <Input
                  type="date"
                  name="endDate"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.endDate}
                  className="no-focus"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <div className="flex justify-between items-end mt-2">
                  <label className="text-slate-700 font-semibold">
                    Description:
                  </label>
                  <Button
                    variant="outline"
                    onClick={() => {
                      generateEducationDescriptionFromAI(index);
                    }}
                    type="button"
                    size="sm"
                    className="border-primary text-primary flex gap-2"
                    disabled={isAiLoading}
                  >
                    {isAiLoading && currentAiIndex === index ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Brain className="h-4 w-4" />
                    )}{" "}
                    Generate from AI
                  </Button>
                </div>
                <Textarea
                  id={`description-${index}`}
                  name="description"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.description || ""}
                  className="no-focus"
                />
              </div>
            </div>
          </div>
        ))}
        <div className="mt-3 flex gap-2 justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={AddNewEducation}
              className="text-primary"
            >
              <Plus className="size-4 mr-2" /> Add More
            </Button>
            <Button
              variant="outline"
              onClick={RemoveEducation}
              className="text-primary"
            >
              <Minus className="size-4 mr-2" /> Remove
            </Button>
          </div>
          <Button
            disabled={isLoading}
            onClick={onSave}
            className="bg-primary-700 hover:bg-primary-800 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> &nbsp; Saving
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>

      {aiTips.length > 0 && (
        <div className="my-4 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2 text-center">💡 Chantelle's Suggests:</h3>
          <div className="space-y-3">
            {aiTips.map((tip, i) => (
              <div
                key={i}
                className="cursor-pointer p-3 rounded-md bg-white border hover:bg-yellow-100 transition"
                onClick={() => {
                  const newList = [...educationList];
                  newList[currentAiIndex].description = tip;
                  setEducationList(newList);

                  handleInputChange({
                    target: {
                      name: "education",
                      value: newList,
                    },
                  });
                }}
              >
                {tip}
              </div>
            ))}
          </div>
        </div>
      )}


      {aiGeneratedDescriptionList.length > 0 && (
        <div className="my-5" ref={listRef}>
          <h2 className="font-bold text-lg">Suggestions</h2>
          {aiGeneratedDescriptionList?.map((item: any, index: number) => (
            <div
              key={index}
              onClick={() =>
                handleChange(
                  {
                    target: { name: "description", value: item?.description },
                  },
                  currentAiIndex
                )
              }
              className={`p-5 shadow-lg my-4 rounded-lg border-t-2 ${
                isAiLoading ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              aria-disabled={isAiLoading}
            >
              <h2 className="font-semibold my-1 text-primary text-gray-800">
                Level: {item?.activity_level}
              </h2>
              <p className="text-justify text-gray-600">{item?.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationForm;
