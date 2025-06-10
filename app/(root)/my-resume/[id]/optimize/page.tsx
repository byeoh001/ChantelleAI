import { fetchResume } from "@/lib/actions/resume.actions";
import ResumePreview from "@/components/layout/my-resume/ResumePreview";
import { FormProvider } from "@/lib/context/FormProvider";
import Header from "@/components/layout/Header"; 

export default async function OptimizeResumePage({ params }: { params: { id: string } }) {
  const resumeJson = await fetchResume(params.id);
  const resume = JSON.parse(resumeJson);

  return (
    <FormProvider params={params}>
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">

        <div className="px-6 pt-4">
          <Header />
        </div>

        {/* Page content */}
        <div className="py-6 px-4">
          <h1 className="text-3xl font-bold text-center text-primary-700 mb-6">
            ✨ Optimize Your Resume ✨ <br/> <span className="text-base text-xl text-gray-600">With Just One Click Away</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Left: Form */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 h-[600px] flex flex-col justify-between">
              <div className="space-y-4 overflow-y-auto pr-1">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">Job Description</label>
                  <textarea
                    rows={4}
                    placeholder="Insert job description here in bullet-point format..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">Job Requirements</label>
                  <textarea
                    rows={4}
                    placeholder="Insert job requirements here in bullet-point format..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="pt-4">
                    <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">
                    Optimize Now
                    </button>
                </div>

              </div>
              
            </div>

            {/* Right: Resume Preview */}
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
