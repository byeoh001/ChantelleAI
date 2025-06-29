"use client";

import RichTextEditor from "@/components/common/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { generateExperienceDescription } from "@/lib/actions/gemini.actions";
import { addExperienceToResume } from "@/lib/actions/resume.actions";
import { useFormContext } from "@/lib/context/FormProvider";
import { Brain, Loader2, Minus, Plus } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";


type Suggestion = {
  category: string;
  suggestion: string;
  section: string;
};


const ExperienceForm = ({ params }: { params: { id: string } }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const { formData, handleInputChange } = useFormContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiGeneratedSummaryList, setAiGeneratedSummaryList] = useState(
    [] as any
  );
  const [experienceList, setExperienceList] = useState(
    formData?.experience.length > 0
      ? formData?.experience
      : [
          {
            title: "",
            companyName: "",
            city: "",
            state: "",
            startDate: "",
            endDate: "",
            workSummary: "",
          },
        ]
  );
  const [currentAiIndex, setCurrentAiIndex] = useState(
    experienceList.length - 1
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



  const handleChange = (index: number, event: any) => {
    const newEntries = experienceList.slice();
    const { name, value } = event.target;
    newEntries[index][name] = value;
    setExperienceList(newEntries);

    handleInputChange({
      target: {
        name: "experience",
        value: newEntries,
      },
    });
  };

  const AddNewExperience = () => {
    const newEntries = [
      ...experienceList,
      {
        title: "",
        companyName: "",
        city: "",
        state: "",
        startDate: "",
        endDate: "",
        workSummary: "",
      },
    ];
    setExperienceList(newEntries);

    handleInputChange({
      target: {
        name: "experience",
        value: newEntries,
      },
    });
  };

  const RemoveExperience = () => {
    const newEntries = experienceList.slice(0, -1);
    setExperienceList(newEntries);

    if (currentAiIndex > newEntries.length - 1) {
      setCurrentAiIndex(newEntries.length - 1);
    }

    handleInputChange({
      target: {
        name: "experience",
        value: newEntries,
      },
    });
  };

  const generateExperienceDescriptionFromAI = async (index: number) => {
    if (
      !formData?.experience[index]?.title ||
      formData?.experience[index]?.title === "" ||
      !formData?.experience[index]?.companyName ||
      formData?.experience[index]?.companyName === ""
    ) {
      toast({
        title: "Uh Oh! Something went wrong.",
        description:
          "Please enter the position title and company name to generate summary.",
        variant: "destructive",
        className: "bg-white border-2",
      });
      return;
    }

    setCurrentAiIndex(index);
    setIsAiLoading(true);

    const currentSummary = formData?.experience[index]?.workSummary || "";

   
    const relevantSuggestion = suggestions.find(
      (sugg) =>
        (sugg.category === "improvements" || sugg.category === "missing") &&
        sugg.section === "Experience"
    );

    if (relevantSuggestion) {
      try {
        const res = await fetch("/api/incorporate-suggestion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            original: currentSummary,
            suggestion: relevantSuggestion.suggestion,
          }),
        });

        const data = await res.json();
        const improved = data.improved;
        const cleaned = improved.replace(/^"|"$/g, "");

        setAiTips([cleaned]);
      } catch (err) {
        console.error("AI integration failed", err);
        toast({
          title: "AI Error",
          description: "Could not process suggestion.",
          variant: "destructive",
          className: "bg-white",
        });
      }

      setIsAiLoading(false);
      return; 
    }

    //Fallback: Use Gemini AI if no Chantelle suggestion
    const result = await generateExperienceDescription(
      `${formData?.experience[index]?.title} at ${formData?.experience[index]?.companyName}`
    );

    setAiGeneratedSummaryList(result);
    setIsAiLoading(false);

    setTimeout(function () {
      listRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };


  const onSave = async (e: any) => {
    e.preventDefault();

    setIsLoading(true);

    const result = await addExperienceToResume(params.id, formData.experience);

    if (result.success) {
      toast({
        title: "Information saved.",
        description: "Professional experience updated successfully.",
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
          Professional Experience
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Add your previous job experiences
        </p>

        <div className="mt-5">
          {experienceList.map((item: any, index: number) => (
            <div key={index}>
              <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
                <div className="space-y-2">
                  <label className="text-slate-700 font-semibold">
                    Position Title:
                  </label>
                  <Input
                    name="title"
                    onChange={(event) => handleChange(index, event)}
                    defaultValue={item?.title}
                    className="no-focus"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-slate-700 font-semibold">
                    Company Name:
                  </label>
                  <Input
                    name="companyName"
                    onChange={(event) => handleChange(index, event)}
                    defaultValue={item?.companyName}
                    className="no-focus"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-slate-700 font-semibold">City:</label>
                  <Input
                    name="city"
                    onChange={(event) => handleChange(index, event)}
                    defaultValue={item?.city}
                    className="no-focus"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-slate-700 font-semibold">State:</label>
                  <Input
                    name="state"
                    onChange={(event) => handleChange(index, event)}
                    defaultValue={item?.state}
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
                    onChange={(event) => handleChange(index, event)}
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
                    onChange={(event) => handleChange(index, event)}
                    defaultValue={item?.endDate}
                    className="no-focus"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <div className="flex justify-between items-end">
                    <label className=" text-slate-700 font-semibold">
                      Summary:
                    </label>
                    <Button
                      variant="outline"
                      onClick={() => {
                        generateExperienceDescriptionFromAI(index);
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
                  <RichTextEditor
                    defaultValue={
                      Array.isArray(item?.workSummary)
                        ? item.workSummary.join("\n")
                        : item?.workSummary || ""
                    }
                    onRichTextEditorChange={(value: string) => {
                      const updatedList = [...experienceList];
                      updatedList[index].workSummary = value;

                      setExperienceList(updatedList);
                      handleInputChange({
                        target: {
                          name: "experience",
                          value: updatedList,
                        },
                      });

                      console.log("Editor update:", updatedList[index].workSummary);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2 justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={AddNewExperience}
              className="text-primary"
            >
              <Plus className="size-4 mr-2" /> Add More
            </Button>
            <Button
              variant="outline"
              onClick={RemoveExperience}
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
          <h3 className="font-semibold text-yellow-800 mb-2 text-center">
            💡 Chantelle's Suggests:
          </h3>
          <div className="space-y-3">
            {aiTips.map((tip, i) => (
              <div
                key={i}
                className="cursor-pointer p-3 rounded-md bg-white border hover:bg-yellow-100 transition"
                onClick={() => {
                  const updatedList = [...experienceList];
                  updatedList[currentAiIndex].workSummary = tip;

                  setExperienceList(updatedList);

                  handleInputChange({
                    target: {
                      name: "experience",
                      value: [...updatedList], 
                    },
                  });

                  //Log to confirm it's syncing
                  console.log("Applied tip to formData:", updatedList);
                }}

              >
                {tip}
              </div>
            ))}
          </div>
        </div>
      )}

      {aiGeneratedSummaryList.length > 0 && (
        <div className="my-5" ref={listRef}>
          <h2 className="font-bold text-lg">Suggestions</h2>
          {aiGeneratedSummaryList?.map((item: any, index: number) => (
            <div
              key={index}
              onClick={() => {
                const updatedList = [...experienceList];
                updatedList[currentAiIndex].workSummary = Array.isArray(item.description)
                  ? item.description.join("\n")
                  : item.description || "";

                setExperienceList(updatedList);

                handleInputChange({
                  target: {
                    name: "experience",
                    value: updatedList,
                  },
                });

              }}

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

export default ExperienceForm;
