import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

const ProjectSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  imageLink: z.string().optional().nullable(),
  imageSvg: z.string().optional().nullable(),
  description: z.string(),
  techStack: z.array(z.string()),
  link: z.string().optional().nullable(),
  date: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  order: z.number().default(0),
  techIds: z.array(z.string()).optional(),
  caseStudy: z.string().optional().nullable(),
  githubUrl: z.string().optional().nullable(),
  githubRepoType: z.string().optional().nullable(),
  customReadme: z.string().optional().nullable(),
});

const ConversionSchema = z.object({
  imageBase64: z.string(), // data:image/...;base64,...
  color: z.string().default("#43D9AD"), // Default green for project icons
});

export const projectRouter = router({
  getAll: protectedProcedure.query(async () => {
    return await prisma.project.findMany({
      orderBy: { order: "asc" },
    });
  }),
  
  upsert: protectedProcedure
    .input(ProjectSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      
      if (id) {
        return await prisma.project.update({
          where: { id },
          data,
        });
      } else {
        return await prisma.project.create({
          data,
        });
      }
    }),

  generateCaseStudy: protectedProcedure
    .input(z.object({
      title: z.string(),
      description: z.string(),
      techStack: z.array(z.string()),
      githubUrl: z.string().optional().nullable(),
      githubRepoType: z.string().optional().nullable(),
      githubToken: z.string().optional().nullable(),
      customReadme: z.string().optional().nullable(),
    }))
    .mutation(async ({ input }) => {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not defined in environment variables. Please add it to your .env file.");
      }

      let readmeText = "";

      if (input.githubRepoType === "EXTERNAL" && input.customReadme) {
        readmeText = input.customReadme;
      } else if (input.githubUrl && input.githubRepoType !== "EXTERNAL") {
        const match = input.githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (match) {
          const owner = match[1];
          const repo = match[2].replace(/\.git$/, "");
          
          if (input.githubRepoType === "PRIVATE") {
            const token = input.githubToken || process.env.GITHUB_PAT;
            if (!token) {
              throw new Error("Missing GitHub token. Please provide a Personal Access Token in the UI or set GITHUB_PAT in .env.");
            }
            try {
              const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/README.md`, {
                headers: {
                  "Accept": "application/vnd.github.v3.raw",
                  "User-Agent": "TerminalPortfolioAgent",
                  "Authorization": `token ${token}`
                }
              });
              if (!res.ok) {
                throw new Error(`GitHub API returned status ${res.status}`);
              }
              readmeText = await res.text();
            } catch (err: any) {
              throw new Error(`Failed to fetch private README.md: ${err.message}`);
            }
          } else {
            // PUBLIC repository
            try {
              let res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`);
              if (!res.ok) {
                res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`);
              }
              if (!res.ok) {
                throw new Error("README.md not found on main or master branches.");
              }
              readmeText = await res.text();
            } catch (err: any) {
              throw new Error(`Failed to fetch public README.md: ${err.message}`);
            }
          }
        }
      }

      let prompt = `You are an expert Software Architect and Technical Writer.
Generate a comprehensive technical case study and codebase documentation JSON for the project: "${input.title}".
Description: ${input.description}
Technologies used: ${input.techStack.join(", ")}
`;

      if (readmeText) {
        prompt += `\nCodebase README.md content for context:\n---\n${readmeText.slice(0, 15000)}\n---\n`;
      }

      prompt += `\nReturn ONLY a single valid JSON object following this EXACT schema, with detailed, professional, and realistic technical contents. No surrounding markdown, no backticks, just raw JSON.
Use the provided README.md content as context to make the generated system architecture, feature breakdown, codebase structure, and technical challenges highly accurate to the actual code.

Schema:
{
  "repoStyleIdentifier": "owner/repo-name (create a realistic github slug)",
  "status": "Production", // or "Active" or "Prototype"
  "type": "Client Project", // or "Commercial" or "Open Source" or "Side Project"
  "visibility": "Private", // or "Public"
  "duration": "Duration (e.g. Jan 2026 - Present)",
  "role": "Role (e.g. Lead Full-Stack Architect)",
  "teamSize": "Team size (e.g. 3 Developers or Solo)",
  "client": "Client or Organization Name",
  "industry": "Industry category",
  "deployment": "Deployment platforms (e.g. Vercel, AWS)",
  "version": "Version string (e.g. v1.0.0)",
  "overview": {
    "mission": "High-level goal or mission statement",
    "businessProblem": "The core problem solved",
    "targetUsers": "Primary user personas",
    "metrics": "Key metric or outcome (e.g. 25% faster sync, 99.9% uptime)"
  },
  "responsibilities": ["List of core engineering/design duties you owned"],
  "architecture": {
    "diagram": "A raw valid SVG string depicting the system architecture (e.g., frontend talking to gateway, database, services). Use styled boxes, text elements, arrows, and dark theme colors fitting #011627 background. Ensure it fits a modern dark-themed editor page.",
    "explanation": "Detailed explanation of data flow, caching layers, database interactions, and key architectural decisions."
  },
  "techStackDetails": [
    {
      "category": "Frontend", // or Backend, Database, DevOps, etc.
      "name": "Technology name (e.g. Next.js)",
      "purpose": "What it was used for",
      "reason": "Technical reason for selecting this tech",
      "alternative": "Alternative tech considered",
      "benefits": "Actual benefits observed in production"
    }
  ],
  "features": [
    {
      "name": "Feature name (e.g. Role-Based Access Control)",
      "description": "Functional description of the feature",
      "implementation": "Technical implementation detail (e.g., custom JWT middleware, Redis rate limiting)",
      "value": "Business or user value provided"
    }
  ],
  "readme": "Markdown content for a standard README.md. Must include: # Overview, ## Technical Architecture, ## Folder Structure, ## Setup & Installation, ## Key Modules.",
  "challenges": [
    {
      "problem": "A real technical challenge faced during development",
      "cause": "Underlying cause or bottleneck",
      "solution": "How you resolved it technically",
      "outcome": "Measurable outcome or benefit after resolving"
    }
  ],
  "performance": {
    "lighthouse": {
      "performance": 95,
      "accessibility": 100,
      "bestPractices": 95,
      "seo": 100
    },
    "metrics": {
      "loadTime": "Load speed (e.g., 0.8s)",
      "bundleSize": "JS Bundle size (e.g., 140kb)",
      "apiLatency": "Average API latency (e.g., 120ms)"
    }
  },
  "security": "Overview of security measures (e.g., HTTPS, encryption, OAuth, CORS)",
  "lessonsLearned": "Detailed explanation of technical or process lessons learned",
  "seo": {
    "title": "Optimized SEO title",
    "description": "Optimized meta description"
  }
}`;

      try {
        const modelsToTry = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-3.1-flash-lite", "gemini-3.5-flash"];
        let lastError: any = null;
        let generatedText = "";

      for (const model of modelsToTry) {
        console.log(`Attempting generation with model: ${model}`);
        let attempt = 0;
        const maxAttempts = 2;

        while (attempt < maxAttempts) {
          attempt++;
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 50000); // 50s timeout per request

            const response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: prompt }] }],
                  generationConfig: {
                    responseMimeType: "application/json"
                  }
                }),
                signal: controller.signal,
              }
            );

            clearTimeout(timeoutId);

            if (!response.ok) {
              const errText = await response.text();
              throw new Error(`HTTP ${response.status}: ${errText}`);
            }

            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) {
              throw new Error("No content generated in response.");
            }

            generatedText = text;
            break;
          } catch (err: any) {
            lastError = err;
            const isTimeout = err.name === "AbortError" || err.message?.includes("timeout") || err.code === "ETIMEDOUT";
            const errMsg = isTimeout ? "Request timed out" : err.message;
            console.warn(`[${model}] Attempt ${attempt}/${maxAttempts} failed: ${errMsg}`);
            
            if (attempt < maxAttempts) {
              await new Promise((resolve) => setTimeout(resolve, 1500));
            }
          }
        }

        if (generatedText) {
          console.log(`Successfully generated case study using model: ${model}`);
          break;
        }
      }

      if (!generatedText) {
        throw new Error(
          `All Gemini model attempts exhausted. Last error: ${lastError ? lastError.message : "Unknown error"}`
        );
      }

      return { caseStudy: generatedText };
      } catch (error: any) {
        console.error("Gemini case study generation error:", error);
        throw new Error(error.message || "Failed to generate case study via Gemini.");
      }
    }),

  convertImage: protectedProcedure
    .input(ConversionSchema)
    .mutation(async ({ input }) => {
      try {
        const { default: Jimp } = await import("jimp");
        const JimpConstructor = Jimp as any;
        const base64Data = input.imageBase64.split(",")[1] || input.imageBase64;
        const buffer = Buffer.from(base64Data, "base64");

        const image = await JimpConstructor.read(buffer);
        const { width, height } = image.bitmap;

        // Wrap the original base64 image in an SVG container 
        // to satisfy "exactly same image" and "no color change"
        // Added preserveAspectRatio="xMidYMid slice" to act like object-fit: cover
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice">
  <image href="${input.imageBase64}" width="${width}" height="${height}"/>
</svg>`;

        return { svg };
      } catch (error: any) {
        console.error("Project image conversion error:", error);
        throw new Error(`Project image conversion failed: ${error.message}`);
      }
    }),
    
  checkApiKeyStatus: protectedProcedure.query(async () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { status: "NO_KEY", message: "GEMINI_API_KEY is not defined in environment variables." };
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "ping" }] }]
          }),
        }
      );

      if (response.status === 200) {
        return { status: "ACTIVE", message: "Gemini 2.5 Flash is active and responding." };
      } else if (response.status === 429) {
        return { status: "EXHAUSTED", message: "API key quota exhausted (Rate limit 429)." };
      } else if (response.status === 400 || response.status === 403) {
        return { status: "INVALID", message: `Invalid API key configuration (HTTP ${response.status}).` };
      } else {
        return { status: "ERROR", message: `Gemini returned status ${response.status}` };
      }
    } catch (err: any) {
      return { status: "NETWORK_ERROR", message: `Connection failed: ${err.message}` };
    }
  }),
    
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return await prisma.project.delete({
        where: { id: input },
      });
    }),
});
