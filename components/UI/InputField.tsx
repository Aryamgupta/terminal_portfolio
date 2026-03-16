"use client";

import { LucideIcon } from "lucide-react";

interface InputFieldProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  placeholder?: string;
  type?: string;
  onChange: (value: string) => void;
}

export default function InputField({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm text-[#607B96] font-medium" style={{padding:"8px"}}>
        {label}
      </label>

      <div className="relative w-full" style={{padding:"10px"}}>
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full
            bg-[#011221]
            border border-[#1E2D3D]
            rounded-xl
            text-white
            text-sm
            outline-none
            focus:border-[#FEA55F]
            focus:ring-2
            focus:ring-[#FEA55F]/10
            transition-all
            placeholder:text-[#607B96]/50
          `}
          style={{padding:'5px',color:"white"}}
        />
      </div>
    </div>
  );
}