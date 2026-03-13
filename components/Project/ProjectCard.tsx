import React from "react";
import Link from "next/link";
import { ExternalLink, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  title: string;
  count?: number;
  des?: string;
  imageLink?: string;
  link?: string;
  techStack?: string;
  id: string;
  isAdmin?: boolean;
}

const ProjectCard = ({
  title,
  count,
  des,
  imageLink,
  link,
  techStack,
  id,
  isAdmin = false,
}: ProjectCardProps) => {
  return (
    <div className="w-full max-w-[370px] space-y-4">
      {/* Title with Count */}
      <h3 className="text-[#607B96] text-sm">
        {count && <span className="text-[#5565E8]">Project {count} // </span>}
        {title}
      </h3>

      {/* Card Body */}
      <div className="bg-[#011221] border border-[#1E2D3D] rounded-lg overflow-hidden shadow-xl">
        {/* Project Image */}
        <div className="h-[145px] relative border-b border-[#1E2D3D] bg-black bg-opacity-20 flex items-center justify-center">
          {imageLink ? (
            <img
              src={imageLink}
              alt={title}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-[#1E2D3D] italic uppercase font-bold text-4xl opacity-10 select-none">
              Portfolio
            </div>
          )}
          {isAdmin && (
            <button className="absolute top-4 right-4 text-[#607B96] hover:text-red-500 transition-colors">
              <Trash2 size={20} />
            </button>
          )}
        </div>

        {/* Project Content */}
        <div className="p-6 space-y-4">
          <p className="text-[#607B96] text-sm leading-relaxed line-clamp-3">
            {des}
          </p>

          {techStack && (
            <div className="text-sm">
              <span className="text-[#5565E8]">tech-stack: </span>
              <span className="text-[#607B96]">{techStack}</span>
            </div>
          )}

          {link && (
            <Link
              href={link}
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1C2B3A] text-white rounded-lg text-sm hover:bg-[#263B4E] transition-all border border-transparent hover:border-[#2B3D4F]"
            >
              view-project
              <ExternalLink size={14} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
