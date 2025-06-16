"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useFormContext } from "@/lib/context/FormProvider";
import { addProjectsToResume } from "@/lib/actions/resume.actions"; 
import { generateProjectDescription } from "@/lib/actions/gemini.actions";
import { Plus, Minus, Loader2, Brain } from "lucide-react";
import React, { useState, useEffect } from "react";


type Suggestion = {
  category: string;
  suggestion: string;
  section: string;
};

const ProjectsForm = ({ params }: { params: { id: string } }) => {
  const { formData, handleInputChange } = useFormContext();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [currentAiIndex, setCurrentAiIndex] = useState(0);
  const [aiGeneratedSuggestions, setAiGeneratedSuggestions] = useState<any[]>([]);
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



  const [projectsList, setProjectsList] = useState(
    formData?.projects?.length > 0
      ? formData.projects
      : [
          {
            projectName: "",
            role: "",
            link: "",
            technologies: "",
            description: "",
            startDate: "",
            endDate: "",
          },
        ]
  );

  const handleChange = (event: any, index: number) => {
    const { name, value } = event.target;
    const newList = [...projectsList];
    newList[index][name] = value;
    setProjectsList(newList);

    handleInputChange({
      target: {
        name: "projects",
        value: newList,
      },
    });
  };

  const addProject = () => {
    const newList = [
      ...projectsList,
      {
        projectName: "",
        role: "",
        link: "",
        technologies: "",
        description: "",
        startDate: "",
        endDate: "",
      },
    ];
    setProjectsList(newList);
    handleInputChange({
      target: {
        name: "projects",
        value: newList,
      },
    });
  };

  const removeProject = () => {
    if (projectsList.length === 1) return;

    const newList = projectsList.slice(0, -1);
    setProjectsList(newList);
    handleInputChange({
      target: {
        name: "projects",
        value: newList,
      },
    });
  };

const generateProjectDescriptionFromAI = async (index: number) => {
    const project = projectsList[index];

    if (!project.projectName || !project.role) {
        toast({
        title: "Missing info",
        description: "Please fill in Project Name and Role first.",
        variant: "destructive",
        className: "bg-white border",
        });
        return;
    }

    setCurrentAiIndex(index);
    setIsAiLoading(true);

    const currentDescription = project.description || "";

    //Check for ChantelleAI suggestion first
    const relevantSuggestion = suggestions.find(
        (sugg) =>
        (sugg.category === "improvements" || sugg.category === "missing") &&
        sugg.section === "Projects"
    );

    if (relevantSuggestion) {
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
        const improved = data.improved;
        const cleaned = improved.replace(/^"|"$/g, "");

        setAiTips([cleaned]);
        } catch (error) {
        console.error("Failed to incorporate project suggestion", error);
        toast({
            title: "AI Error",
            description: "Could not generate improved project description.",
            variant: "destructive",
            className: "bg-white",
        });
        }

        setIsAiLoading(false);
        return;
    }

    //fallback: regular Gemini suggestion
    const result = await generateProjectDescription(
        `${project.projectName} as a ${project.role}`
    );

    setAiGeneratedSuggestions(result);
    setIsAiLoading(false);
    };



  const onSave = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    const cleanedProjects = projectsList.map((project: any) => ({
      ...project,
      description: Array.isArray(project.description)
        ? project.description.join("\n") 
        : project.description,
    }));

    const result = await addProjectsToResume(params.id, cleanedProjects);

    if (result.success) {
      toast({
        title: "Information saved.",
        description: "Project details updated successfully.",
        className: "bg-white",
      });
    } else {
      toast({
        title: "Uh Oh! Something went wrong.",
        description: result?.error || "Please try again.",
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
          Personal Projects
        </h2>
        <p className="mt-1 text-sm text-slate-500">Add details of your personal or freelance projects</p>

        {projectsList.map((item: any, index: number) => (
          <div key={index} className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
            <div className="col-span-2 space-y-2">
              <label className="text-slate-700 font-semibold">Project Name:</label>
              <Input
                name="projectName"
                onChange={(e) => handleChange(e, index)}
                defaultValue={item?.projectName}
              />
            </div>

            <div className="space-y-2">
              <label className="text-slate-700 font-semibold">Role:</label>
              <Input
                name="role"
                onChange={(e) => handleChange(e, index)}
                defaultValue={item?.role}
              />
            </div>

            <div className="space-y-2">
              <label className="text-slate-700 font-semibold">Project Link (Optional):</label>
              <Input
                name="link"
                onChange={(e) => handleChange(e, index)}
                defaultValue={item?.link}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <label className="text-slate-700 font-semibold">Technologies Used (Optional):</label>
              <Input
                name="technologies"
                onChange={(e) => handleChange(e, index)}
                defaultValue={item?.technologies}
              />
            </div>

            <div className="space-y-2">
                <label className="text-slate-700 font-semibold">Start Date:</label>
                <Input
                    type="date"
                    name="startDate"
                    onChange={(e) => handleChange(e, index)}
                    defaultValue={item?.startDate}
                />
            </div>

            <div className="space-y-2">
                <label className="text-slate-700 font-semibold">End Date:</label>
                <Input
                    type="date"
                    name="endDate"
                    onChange={(e) => handleChange(e, index)}
                    defaultValue={item?.endDate}
                />
            </div>


            <div className="col-span-2 space-y-2">
              <div className="flex justify-between items-end">
                <label className="text-slate-700 font-semibold">Description:</label>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateProjectDescriptionFromAI(index)}
                    className="border-primary text-primary flex gap-2"
                    disabled={isAiLoading}
                >
                    {isAiLoading && currentAiIndex === index ? (
                    <Loader2 size={16} className="animate-spin" />
                    ) : (
                    <Brain className="h-4 w-4" />
                    )}
                    Generate from AI
                </Button>
                </div>
                <Textarea
                name="description"
                onChange={(e) => handleChange(e, index)}
                defaultValue={item?.description}
                />

            </div>
          </div>
        ))}

        <div className="mt-3 flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={addProject} className="text-primary">
              <Plus className="size-4 mr-2" /> Add More
            </Button>
            <Button variant="outline" onClick={removeProject} className="text-primary">
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
                    const newList = [...projectsList];
                    newList[currentAiIndex].description = tip;
                    setProjectsList(newList);
                    handleInputChange({
                    target: {
                        name: "projects",
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


        {aiGeneratedSuggestions.length > 0 && (
            <div className="my-5">
                <h2 className="font-bold text-lg">AI Suggestions</h2>
                {aiGeneratedSuggestions.map((item, index) => (
                <div
                    key={index}
                    onClick={() =>
                      handleChange(
                        {
                          target: {
                            name: "description",
                            value: Array.isArray(item.description)
                              ? item.description.join("\n")
                              : item.description,
                          },
                        },
                        currentAiIndex
                      )
                    }
                    className="p-5 shadow-lg my-4 rounded-lg border-t-2 cursor-pointer"
                >
                    <h3 className="font-semibold text-primary mb-1">Level: {item.activity_level}</h3>
                    <p className="text-gray-600 text-justify">{item.description}</p>
                </div>
                ))}
            </div>
            )}
    </div>
  );
};

export default ProjectsForm;
