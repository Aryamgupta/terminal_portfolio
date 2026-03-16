"use client";

import { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: ReactNode;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}

export default function Button({
  children,
  loading,
  onClick,
  type = "button",
  className,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={cn(
        "bg-[#FEA55F] text-[#011627] font-semibold px-6 py-3 flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50",
        className
      )}
      style={{padding:'10px',textAlign:"center"}}
    >
      {loading && <Loader2 size={18} className="animate-spin" />}
      {children}
    </button>
  );
}