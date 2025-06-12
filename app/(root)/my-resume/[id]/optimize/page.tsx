// import { fetchResume } from "@/lib/actions/resume.actions";
// import ResumePreview from "@/components/layout/my-resume/ResumePreview";
// import { FormProvider } from "@/lib/context/FormProvider";
// import Header from "@/components/layout/Header"; 
// import BulletGenerator from "@/components/common/BulletPointGenerator";


// export default async function OptimizeResumePage({ params }: { params: { id: string } }) {
//   const resumeJson = await fetchResume(params.id);
//   const resume = JSON.parse(resumeJson);

//   const suggestions = [
//     "Improve summary to emphasize leadership experie    nce.",
//     "Highlight relevant technologies for frontend roles (e.g., React, TypeScript).",
//     "Add quantifiable achievements in past roles.",
//     "Improve summary to emphasize leadership experience.",
//     "Highlight relevant technologies for frontend roles (e.g., React, TypeScript).",
//     "Add quantifiable achievements in past roles.",
//     "Optimize skill section for ATS readability."
//     ];


//   return (
//     <FormProvider params={params}>
//       <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">

//         <div className="px-6 pt-4">
//           <Header />
//         </div>

//         {/* Page content */}
//         <div className="py-6 px-4">
//           <h1 className="text-3xl font-bold text-center text-primary-700 mb-6">
//             ✨ Optimize Your Resume ✨ <br/> <span className="text-base text-xl text-gray-600">With Just One Click Away</span>
//           </h1>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
//             {/* Left: Form and Suggestions split vertically */}
//             <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200 h-[600px] flex flex-col space-y-4">
            
//             {/* Top Half: Form */}
//             <div className="flex-3 space-y-3">
//                 <div className="relative mb-2">
//                     <label className="block text-base font-semibold text-gray-700 text-center">
//                         Job Description
//                     </label>
//                     <div className="absolute top-0 right-0">
//                         <BulletGenerator targetId="jobDescription"/>
//                     </div>
//                 <textarea
//                     id = "jobDescription"
//                     rows={3}
//                     placeholder="Insert job description here in bullet-point format..."
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
//                 />
//                 </div>
//                 <div>
//                     <div className="relative mb-2">
//                         <label className="block text-base font-semibold text-gray-700 text-center">
//                             Job Requirements
//                         </label>
//                         <div className="absolute top-0 right-0">
//                             <BulletGenerator targetId="jobRequirements"/>
//                         </div>
//                     </div>

//                     <textarea
//                     id="jobRequirements"
//                     rows={3}
//                     placeholder="Insert job requirements here in bullet-point format..."
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
//                     />
//                 </div>
//                 <div>
//                 <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
//                     Optimize Now
//                 </button>
//                 </div>
//             </div>
            
//             {/* Suggestions Section */}
//             <div className="p-4 mt-4 rounded-lg bg-white shadow-md border max-h-60 overflow-y-auto">
//             <h3 className="text-base font-semibold text-gray-700 mb-2 border-b pb-1 text-center">
//                 🧠 ChantelleAI Suggestions 🧠
//             </h3>
//             <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 leading-relaxed">
//                 {suggestions.map((suggestion, index) => (
//                 <li key={index}>{suggestion}</li>
//                 ))}
//             </ul>
//             </div>


//             </div>


//             {/* Right: Resume Preview */}
//             <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200 h-[600px] overflow-y-auto">
//               <div className="scale-[0.8] origin-top">
//                 <ResumePreview />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </FormProvider>
//   );
// }

import ResumePreview from "@/components/layout/my-resume/ResumePreview";
import ResumeOptimizerClient from "@/components/layout/my-resume/ResumeOptimizerClient";
import { fetchResume } from "@/lib/actions/resume.actions";
import { FormProvider } from "@/lib/context/FormProvider";
import Header from "@/components/layout/Header";

export default async function OptimizeResumePage({ params }: { params: { id: string } }) {
  const resumeJson = await fetchResume(params.id);
  const resume = JSON.parse(resumeJson);

  const resumeContent = JSON.stringify(resume, null, 2); // OR write a cleaner extractor

  return (
    <FormProvider params={params}>
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <div className="px-6 pt-4">
          <Header />
        </div>

        <div className="py-6 px-4">
          <h1 className="text-3xl font-bold text-center text-primary-700 mb-6">
            ✨ Optimize Your Resume ✨ <br />
            <span className="text-base text-xl text-gray-600">With Just One Click Away</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200 h-[600px] overflow-y-auto">
              <ResumeOptimizerClient resumeContent={resumeContent} resumeId={params.id}/>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200 h-[600px] overflow-y-auto">
              <div className="scale-[0.8] origin-top">
                <ResumePreview />
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}

