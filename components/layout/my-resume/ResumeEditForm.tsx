"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import PersonalDetailsForm from "./forms/PersonalDetailsForm";
import SummaryForm from "./forms/SummaryForm";
import ExperienceForm from "./forms/ExperienceForm";
import EducationForm from "./forms/EducationForm";
import ProjectForm from "./forms/ProjectsForm"
import SkillsForm from "./forms/SkillsForm";
import ThemeColor from "@/components/layout/ThemeColor";
import { useToast } from "@/components/ui/use-toast";
import { useFormContext } from "@/lib/context/FormProvider";
import {
  addEducationToResume,
  addExperienceToResume,
  addSkillToResume,
  addProjectsToResume,
  updateResume,
} from "@/lib/actions/resume.actions";


type Suggestion = {
  category: string;
  suggestion: string;
  section: string;
};


const ResumeEditForm = ({
  params,
  userId,
}: {
  params: { id: string };
  userId: string | undefined;
}) => {
  if (!userId) {
    return null;
  }

  const router = useRouter();
  const { toast } = useToast();
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { formData } = useFormContext();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    async function fetchSuggestions() {
      const res = await fetch(`/api/optimize-resume?id=${params.id}`);
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    }

    fetchSuggestions();
  }, [params.id]);





  return (
    <div>
    <div className="flex flex-col gap-5">
      <div className="flex justify-between">
        <ThemeColor params={params} />
        <div className="flex gap-2">
          {activeFormIndex > 1 && (
            <Button
              className="flex gap-2 bg-primary-700 hover:bg-primary-800 text-white"
              size="sm"
              onClick={() => setActiveFormIndex(activeFormIndex - 1)}
            >
              <ArrowLeft /> Prev
            </Button>
          )}
          <Button
            className="flex gap-2 bg-primary-700 hover:bg-primary-800 text-white"
            size="sm"
            disabled={isLoading}
            onClick={async () => {
              if (activeFormIndex != 6) {
                setActiveFormIndex(activeFormIndex + 1);
              } else {
                setIsLoading(true);

                const updates = {
                  firstName: formData?.firstName,
                  lastName: formData?.lastName,
                  jobTitle: formData?.jobTitle,
                  address: formData?.address,
                  phone: formData?.phone,
                  email: formData?.email,
                  summary: formData?.summary,
                  experience: formData?.experience,
                  education: formData?.education,
                  project: formData?.projects,
                  skills: formData?.skills,
                };

                const updateResult = await updateResume({
                  resumeId: params.id,
                  updates: {
                    firstName: updates.firstName,
                    lastName: updates.lastName,
                    jobTitle: updates.jobTitle,
                    address: updates.address,
                    phone: updates.phone,
                    email: updates.email,
                    summary: updates.summary,
                  },
                });

                const educationResult = await addEducationToResume(
                  params.id,
                  updates.education
                );

                const experienceResult = await addExperienceToResume(
                  params.id,
                  updates.experience
                );

                const projectsResult = await addProjectsToResume(
                  params.id, 
                  updates.project
                );

                const skillsResult = await addSkillToResume(
                  params.id,
                  updates.skills
                );

                setIsLoading(false);

                if (
                  updateResult.success &&
                  experienceResult.success &&
                  educationResult.success &&
                  projectsResult.success &&
                  skillsResult.success
                ) {
                  router.push("/my-resume/" + params.id + "/view");
                } else {
                  toast({
                    title: "Uh Oh! Something went wrong.",
                    description:
                      updateResult?.error ||
                      experienceResult?.error ||
                      educationResult?.error ||
                      projectsResult?.error ||
                      skillsResult?.error,
                    variant: "destructive",
                    className: "bg-white",
                  });
                }
              }
            }}
          >
            {activeFormIndex == 6 ? (
              <>
                {isLoading ? (
                  <>
                    Finishing &nbsp; <Loader2 className="size-5 animate-spin" />
                  </>
                ) : (
                  <>
                    Finish <CheckCircle2 className="size-5" />
                  </>
                )}
              </>
            ) : (
              <>
                Next <ArrowRight />
              </>
            )}
          </Button>
        </div>
      </div>

      {activeFormIndex == 1 ? (
        <PersonalDetailsForm params={params} />
      ) : activeFormIndex == 2 ? (
        <SummaryForm params={params} />
      ) : activeFormIndex == 3 ? (
        <EducationForm params={params} />
      ) : activeFormIndex == 4 ? (
        <ExperienceForm params={params} />
      ) : activeFormIndex == 5 ? (
        <ProjectForm params={params} />
      ) : activeFormIndex == 6 ? (
        <SkillsForm params={params} />
      ) : activeFormIndex == 7 ? (
        redirect("/my-resume/" + params.id + "/view")
      ) : null}

    </div>

    <div className="p-4 mt-4 rounded-lg bg-white shadow-md border">
        <h3 className="text-base font-semibold text-gray-700 mb-2 border-b pb-1 text-center">
          🧠 ChantelleAI's Analysis 🧠
        </h3>

        <div className="max-h-40 overflow-y-auto pr-2 min-h-[168px]">
          {suggestions.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 leading-relaxed">
              {suggestions.map((sugg, index) => (
                <li key={index}>
                  <strong className="capitalize">{sugg.category}:</strong> {sugg.suggestion}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 italic text-center">No suggestions available.</p>
          )}
        </div>
      </div>
    </div>

    
  );
};

export default ResumeEditForm;
