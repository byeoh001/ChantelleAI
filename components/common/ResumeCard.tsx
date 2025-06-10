"use client";

import Link from "next/link";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Building2, Loader2, MoreVertical } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { deleteResume } from "@/lib/actions/resume.actions";
import { useToast } from "../ui/use-toast";
import { usePathname } from "next/navigation";

const ResumeCard = ({
  resume,
  refreshResumes,
}: {
  resume: any;
  refreshResumes: () => void;
}) => {
  if (!resume) {
    return (
      <div className="!bg-slate-200/30 relative aspect-[1/1.2] rounded-lg shadow-lg flex flex-col hover:scale-105 transition-all skeleton">
        <div className="flex-1"></div>
        <div className="border-0 p-3 flex justify-between bg-white/40 rounded-b-lg">
          ‎{" "}
        </div>
      </div>
    );
  }

  const router = useRouter();
  const pathname = usePathname();
  const myResume = JSON.parse(resume);
  const [openAlert, setOpenAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [companyPhoto, setCompanyPhoto] = useState(myResume.companyLogo || null);
  const { toast } = useToast();


  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setCompanyPhoto(imageUrl);
      // Optionally save to localStorage or your preferred storage
      localStorage.setItem(`company-photo-${myResume.resumeId}`, imageUrl);
    }
  };

  const onDelete = async () => {
    setIsLoading(true);

    const result = await deleteResume(myResume.resumeId, pathname);

    setIsLoading(false);
    setOpenAlert(false);

    if (result.success) {
      toast({
        title: "Information saved.",
        description: "Resume deleted successfully.",
        className: "bg-white",
      });

      refreshResumes();
    } else {
      toast({
        title: "Uh Oh! Something went wrong.",
        description: result?.error,
        variant: "destructive",
        className: "bg-white",
      });
    }
  };

  return (
    <div className="relative aspect-[1/1.2] flex flex-col hover:scale-105 transition-all">
      <Link
        href={"/my-resume/" + myResume.resumeId + "/view"}
        className="flex-grow"
      >
        <div
          className="bg-gradient-to-b from-pink-100 via-purple-200 to-blue-200 rounded-t-lg border-t-4 h-full"
          style={{
            borderColor: myResume?.themeColor,
          }}
        >

          <div className="absolute top-3 right-3 z-10">
            <label 
              htmlFor={`photo-${myResume.resumeId}`} 
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <div className="w-12 h-12 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {companyPhoto ? (
                  <img src={companyPhoto} alt="Company" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 hover:text-gray-600">
                    <Building2 className="w-5 h-5" />
                  </div>
                )}
              </div>
            </label>
            <input
              id={`photo-${myResume.resumeId}`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="flex size-full items-center justify-center">
            <img src="/img/blank-cv.png" width={80} height={80} />
          </div>
        </div>
      </Link>

      <div className="border p-3 flex justify-between bg-white rounded-b-lg shadow-lg">
        <h2 className="text-sm font-medium text-slate-700 mr-4 block whitespace-nowrap overflow-hidden text-ellipsis">
          {myResume.title}
        </h2>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical className="h-4 w-4 cursor-pointer" color="#000" />
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() =>
                router.push("/my-resume/" + myResume.resumeId + "/edit")
              }
            >
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                router.push("/my-resume/" + myResume.resumeId + "/view")
              }
            >
              View
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setOpenAlert(true)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={openAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setOpenAlert(false)}
              disabled={isLoading}
              className="no-focus"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> &nbsp; Deleting
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ResumeCard;
