"use client";

import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { FormProvider, useFormContext } from "@/lib/context/FormProvider";
import { RWebShare } from "react-web-share";
import React, { useState } from "react";
import ResumePreview from "@/components/layout/my-resume/ResumePreview";
import { usePathname } from "next/navigation";
import PageWrapper from "@/components/common/PageWrapper";
import { DownloadIcon, Share2Icon } from "lucide-react";
import { useRouter } from "next/navigation";


const FinalResumeView = ({
  params,
  isOwnerView,
}: {
  params: { id: string };
  isOwnerView: boolean;
}) => {
  const path = usePathname();
  const { formData } = useFormContext();

  const router = useRouter();
  const resumeId = params.id;

  const handleDownload = () => {
    window.print();
  };

  return (
    <PageWrapper>
      <FormProvider params={params}>
        <div id="no-print">
          <Header />
          <div className="my-10 mx-10 md:mx-20 lg:mx-36">
            {isOwnerView ? (
              <>
                <h2 className="text-center text-2xl font-bold">
                  Congrats! Your resume is ready!
                </h2>
                <p className="text-center text-gray-600">
                  You can now optimize, download or share your resume with its unique URL.
                </p>
                <p className="text-center text-sm text-gray-500 font-light">
                  For better print quality, adjust your browser's print
                  settings: save as PDF, disable headers and footers, set
                  margins to none, and enable background graphics.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-center text-2xl font-bold">
                  Resume Preview
                </h2>
                <p className="text-center text-gray-600">
                  You are currently viewing a preview of someone else's resume.
                </p>
                <p className="text-center text-sm text-gray-500 font-light">
                  For the ultimate experience, create your own AI-generated
                  resume.
                </p>
              </>
            )}

            <div className="flex flex-wrap justify-center gap-4 my-10 items-center">

              <Button
                className="flex px-8 py-6 gap-2 rounded-full bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-700/30 text-white"
                onClick={() => router.push(`/my-resume/${resumeId}/optimize`)}
              >
                ✨ Optimize Resume
              </Button>


              <Button
                className="flex px-12 py-6 gap-2 rounded-full bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-700/30 text-white"
                onClick={handleDownload}
              >
                <DownloadIcon className="size-6" /> Download
              </Button>

              <RWebShare
                data={{
                  text: "Hello everyone, check out my resume by clicking the link!",
                  url: `${process.env.BASE_URL}/${path}`,
                  title: `${formData?.firstName} ${formData?.lastName}'s Resume`,
                }}
                onClick={() => console.log("Shared successfully!")}
              >
                <Button className="flex px-12 py-6 gap-2 rounded-full bg-slate-200 hover:bg-primary-700/20 focus:ring-4 focus:ring-primary-700/30 text-black">
                  <Share2Icon className="size-6" /> Share
                </Button>
              </RWebShare>

              
            </div>

          </div>
        </div>
        <div className="px-10 pt-4 pb-16 max-sm:px-5 max-sm:pb-8 print:p-0">
          <div id="print-area">
            <ResumePreview />
          </div>
        </div>
      </FormProvider>
    </PageWrapper>
  );
};

export default FinalResumeView;
