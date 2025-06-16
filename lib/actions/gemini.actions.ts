  "use server";

  import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai";

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    // responseMimeType: "text/plain",
    responseMimeType: "application/json",
  };

  async function askGemini(prompt: string) {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);

    return result.response.text();
  }

  export async function generateSummary(jobTitle: string) {
    const prompt =
      jobTitle && jobTitle !== ""
        ? `Given the job title '${jobTitle}', provide a summary for three experience levels: Senior, Mid Level, and Fresher. Each summary should be 3-4 lines long and include the experience level and the corresponding summary in JSON format. The output should be an array of objects, each containing 'experience_level' and 'summary' fields. Ensure the summaries are tailored to each experience level.`
        : `Create a 3-4 line summary about myself for my resume, emphasizing my personality, social skills, and interests outside of work. The output should be an array of JSON objects, each containing 'experience_level' and 'summary' fields representing Active, Average, and Lazy personality traits. Use example hobbies if needed but do not insert placeholders for me to fill in.`;

    const result = await askGemini(prompt);

    return JSON.parse(result);
  }

  export async function generateEducationDescription(educationInfo: string) {
       const prompt = `Based on my education at ${educationInfo}, generate three levels of professional education descriptions: High Activity, Medium Activity, and Low Activity.

        Each activity level should include approximately 3 bullet points. Each bullet point should:
        - Be a single line starting with "•"
        - Begin with a strong past-tense action verb 
        - Follow the STAR format (Situation, Task, Action, Result) in a compact, one-sentence form
        - Emphasize outcomes and measurable impact where applicable

        
        Use a **different strong action verb for each bullet point** to avoid repetition.

        Your response MUST be in **valid JSON** like:
        [
          {
            "activity_level": "High",
            "description": ["• ...", "• ...", "• ..."]
          },
          {
            "activity_level": "Medium",
            "description": ["• ...", "• ...", "• ..."]
          },
          {
            "activity_level": "Low",
            "description": ["• ...", "• ...", "• ..."]
          }
        ]

        Do NOT include markdown, backticks, comments, explanations, or extra text. Just return the raw JSON only.`;

      const result = await askGemini(prompt);
      console.log("Education Description Result:", result);

      let fixed = result.trim();

      // Handle common Gemini format errors
      try {
        // Case: output is object series, not array (e.g. {...}, {...}, {...})
        if (fixed.startsWith("{") && fixed.includes("},{") && !fixed.startsWith("[")) {
          fixed = `[${fixed}]`;
        }

        // Case: output is wrapped in a top-level object like { activity_levels: [...] }
        const parsed = JSON.parse(fixed);

        const activityLevels = parsed.activity_levels || parsed.activityLevels || (Array.isArray(parsed) ? parsed : null);

        if (!activityLevels || !Array.isArray(activityLevels)) {
          throw new Error("Parsed structure doesn't contain expected 'activity_levels' array.");
        }

        return activityLevels;
      } catch (err) {
        console.error("Failed to parse Gemini response:", err);
        console.log("Raw Gemini response was:", fixed);
        throw new Error("Invalid JSON format returned by Gemini. Try again.");
      }
}


  export async function generateExperienceDescription(experienceInfo: string) {
    const prompt = `Based on my experience at ${experienceInfo}, generate three levels of professional experience descriptions: High Activity, Medium Activity, and Low Activity.

        Each activity level should include approximately 3 bullet points. Each bullet point should:
        - Be a single line starting with "•"
        - Begin with a strong past-tense action verb 
        - Follow the STAR format (Situation, Task, Action, Result) in a compact, one-sentence form
        - Emphasize outcomes and measurable impact where applicable

        Use a **different strong action verb for each bullet point** to avoid repetition.

        Your response MUST be in **valid JSON** like:
        [
          {
            "activity_level": "High",
            "description": ["• ...", "• ...", "• ..."]
          },
          {
            "activity_level": "Medium",
            "description": ["• ...", "• ...", "• ..."]
          },
          {
            "activity_level": "Low",
            "description": ["• ...", "• ...", "• ..."]
          }
        ]

        Do NOT include markdown, backticks, comments, explanations, or extra text. Just return the raw JSON only.`;


    const result = await askGemini(prompt);
    console.log("Experience Description Result:", result);

    let fixed = result.trim();

    try {
      // Handle common malformed JSON structures
      if (fixed.startsWith("{") && fixed.includes("},{") && !fixed.startsWith("[")) {
        fixed = `[${fixed}]`;
      }

      const parsed = JSON.parse(fixed);

      const activityLevels =
        parsed.activity_levels ||
        parsed.activityLevels ||
        (Array.isArray(parsed) ? parsed : null);

      if (!activityLevels || !Array.isArray(activityLevels)) {
        throw new Error("Parsed structure doesn't contain expected 'activity_levels' array.");
      }

      return activityLevels;
    } catch (err) {
      console.error("Failed to parse Gemini response:", err);
      console.log("Raw Gemini response was:", fixed);
      throw new Error("Invalid JSON format returned by Gemini. Try again.");
    }
  }



  export async function generateProjectDescription(projectInfo: string) {
    const prompt = `Based on the project I worked on, which was ${projectInfo}, generate three levels of professional project descriptions: High Activity, Medium Activity, and Low Activity.

      Each activity level should include approximately 3 bullet points. Each bullet point should:
      - Be a single line starting with "•"
      - Begin with a strong past-tense action verb
      - Follow the STAR format (Situation, Task, Action, Result) in a compact, one-sentence form
      - Emphasize measurable outcomes or impact where applicable

      Use a **different strong action verb for each bullet point** to avoid repetition.

      Your response MUST be in **valid JSON** like:
      [
        {
          "activity_level": "High",
          "description": ["• ...", "• ...", "• ..."]
        },
        {
          "activity_level": "Medium",
          "description": ["• ...", "• ...", "• ..."]
        },
        {
          "activity_level": "Low",
          "description": ["• ...", "• ...", "• ..."]
        }
      ]

      Do NOT include markdown, backticks, comments, explanations, or extra text. Just return the raw JSON only.`;

    const result = await askGemini(prompt);
    console.log("Project Description Result:", result);

    let fixed = result.trim();

    try {
      // Handle common malformed JSON structures
      if (fixed.startsWith("{") && fixed.includes("},{") && !fixed.startsWith("[")) {
        fixed = `[${fixed}]`;
      }

      const parsed = JSON.parse(fixed);

      const activityLevels =
        parsed.activity_levels ||
        parsed.activityLevels ||
        (Array.isArray(parsed) ? parsed : null);

      if (!activityLevels || !Array.isArray(activityLevels)) {
        throw new Error("Parsed structure doesn't contain expected 'activity_levels' array.");
      }

      return activityLevels;
    } catch (err) {
      console.error("Failed to parse Gemini response:", err);
      console.log("Raw Gemini response was:", fixed);
      throw new Error("Invalid JSON format returned by Gemini. Try again.");
    }
  }




  export async function generateResumeOptimizationPrompt({
        resumeContent,
        jobDescription,
        jobRequirements
      }: {
        resumeContent: string;
        jobDescription: string;
        jobRequirements: string;
      }) {
      const prompt = `
      You are an expert resume coach helping a user tailor their resume to a job posting.

      **Instructions:**
      1. Carefully analyze the user's resume.
      2. Compare it thoroughly to the job description and requirements.
      3. Identify:
        - Key strengths (where the resume already aligns well).
        - Weak areas (if any parts could be improved).
        - Missing areas (if something important is not included).

      Important Guidelines:
      - Do **not** force suggestions. If the resume already meets the job expectations, do not fabricate improvements or missing elements.
      - Only suggest **improvements** or **missing** if they genuinely help the candidate match the job better.
      - For each **improvement** or **missing** suggestion, clearly state **which resume section** (e.g., "Summary", "Education", "Experience", "Projects", "Skills") should be updated.
      - Suggest **bullet points** to add or specific changes to make, only if necessary.
      - Do **not** use placeholders like "[insert]". Write realistic content in the tone of the resume.

      **Output Format:** A JSON array of objects. Each object must include:
      - category: "strengths" | "improvements" | "missing"
      - section: "Summary" | "Education" | "Experience" | "Projects" | "Skills" | etc.
      - suggestion: <string>

      Resume:
      ${resumeContent}

      Job Description:
      ${jobDescription}

      Job Requirements:
      ${jobRequirements}
      `;

      const result = await askGemini(prompt);
      return JSON.parse(result);
    }


  export async function incorporateSuggestionIntoDescription({
      original,
      suggestion,
    }: {
      original: string;
      suggestion: string;
    }) {
      const prompt = `
    You are a resume expert. Improve the original description by incorporating the suggestion.

    Only return the final improved version as plain text. Do NOT include JSON, labels, or formatting like "improved_description".

    Original:
    ${original}

    Suggestion:
    ${suggestion}
      `.trim();

      const result = await askGemini(prompt);

      // Clean unexpected JSON formats
      try {
        const parsed = JSON.parse(result);

        if (typeof parsed === "object") {
          const extracted =
            parsed["Improved Description"] || parsed["improved_description"];
          if (typeof extracted === "string") {
            return extracted.trim();
          }
        }
      } catch {
        // result is not JSON
      }

      return result.trim();
  }


