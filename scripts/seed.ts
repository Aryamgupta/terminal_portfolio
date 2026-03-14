import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import path from "path";

config({ path: path.join(process.cwd(), ".env.local") });

async function seed() {
  const prisma = new PrismaClient();

  try {
    console.log("Seeding database...");

    // 1. Personal Info
    await prisma.personalInfo.deleteMany();
    await prisma.personalInfo.create({
      data: {
        name: "Aryam Gupta",
        role: ["Full Stack Developer", "Competitive Programmer"],
        bio: [
          "/**",
          " * About me",
          " *",
          " * I am a full-stack developer with a passion for",
          " * building beautiful and performant web apps.",
          " * I have hands-on experience with modern JavaScript",
          " * frameworks, RESTful APIs, and NoSQL databases.",
          " *",
          " * I love clean code, thoughtful architecture, and",
          " * turning complex problems into elegant solutions.",
          " * When I'm not coding, I'm exploring open-source,",
          " * gaming, or learning something new.",
          " */"
        ],
        interests: [
          "/**",
          " * Interests",
          " *",
          " * - Full-stack web development",
          " * - Open-source contribution",
          " * - CLI tooling & automation",
          " * - AI / ML integrations",
          " * - Gaming & indie dev",
          " */"
        ],
        email: "aryamgupta8750@gmail.com",
        phone: "+91 8750XXXXXX",
        location: "New Delhi, India 🇮🇳",
        githubLink: "https://github.com/aryam-gupta",
        linkedinLink: "https://linkedin.com/in/aryam-gupta",
        twitterLink: "https://twitter.com/aryam_gupta"
      }
    });

    // 2. Education
    await prisma.education.deleteMany();
    await prisma.education.createMany({
      data: [
        {
          name: "12th",
          institution: "Jingle Bells Public School (Bareilly)",
          percentage: "93.20%",
          year: "2019",
          type: "high-school"
        },
        {
          name: "B.Tech (Computer Science)",
          institution: "JSS Academy of Technical Education (Noida)",
          percentage: "8.40",
          year: "2020-24",
          type: "university"
        }
      ]
    });

    // 3. Certificates
    await prisma.certificate.deleteMany();
    await prisma.certificate.createMany({
      data: [
        {
          name: "Full Stack Web Development",
          issuer: "Coursera / Meta",
          link: "https://coursera.org/verify/example1",
          img: "https://via.placeholder.com/150",
          date: "2023"
        },
        {
          name: "Advanced React Patterns",
          issuer: "Frontend Masters",
          link: "https://frontendmasters.com/certificates/example2",
          img: "https://via.placeholder.com/150",
          date: "2023"
        },
        {
          name: "Mobile App Development",
          issuer: "Google",
          link: "https://example.com/verify/mobile",
          img: "https://via.placeholder.com/150",
          date: "2022"
        }
      ]
    });

    // 4. Tech Icons
    await prisma.techIcon.deleteMany();
    await prisma.techIcon.createMany({
      data: [
        { name: "React", icon: "⚛" },
        { name: "Next.js", icon: "△" },
        { name: "Node.js", icon: "⬡" },
        { name: "MongoDB", icon: "🍃" },
        { name: "TypeScript", icon: "TS" },
        { name: "Vue", icon: "∨" },
        { name: "HTML", icon: "📄" },
        { name: "CSS", icon: "🎨" },
        { name: "Angular", icon: "🅐" },
        { name: "Gatsby", icon: "💜" },
        { name: "Flutter", icon: "🐦" },
        { name: "Express", icon: "⬡" },
        { name: "JavaScript", icon: "JS" }
      ]
    });

    // 5. Skill Categories
    await prisma.skillCategory.deleteMany();
    await prisma.skillCategory.createMany({
      data: [
        { name: "Frontend", skills: ["React", "Next.js", "Vue", "HTML", "CSS", "Tailwind"] },
        { name: "Backend", skills: ["Node.js", "Express", "MongoDB", "SQL", "REST API"] },
        { name: "Languages", skills: ["TypeScript", "JavaScript", "Python", "C++"] },
        { name: "Tools", skills: ["Git", "Docker", "VS Code", "Vercel"] }
      ]
    });

    // 6. Projects
    await prisma.project.deleteMany();
    await prisma.project.createMany({
      data: [
        {
          title: "Project 1",
          description: "A cool project description",
          techStack: ["React", "Node.js", "MongoDB"],
          featured: true,
          order: 1
        },
        {
          title: "Project 2",
          description: "Another cool project",
          techStack: ["Next.js", "Tailwind"],
          featured: true,
          order: 2
        }
      ]
    });

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
