"use client";

interface TextAreaFieldProps {
  label: string;
  value: string;
  rows?: number;
  placeholder?: string;
  onChange: (value: string) => void;
}

export default function TextAreaField({
  label,
  value,
  rows = 6,
  placeholder,
  onChange,
}: TextAreaFieldProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm text-[#607B96] font-medium">
        {label}
      </label>

      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{color:"white",padding:'10px'}}
        className="
          w-full
          bg-[#011221]
          border border-[#1E2D3D]
          rounded-xl
          px-4
          py-4
          text-white
          text-sm
          outline-none
          resize-none
          focus:border-[#FEA55F]
          focus:ring-2
          focus:ring-[#FEA55F]/10
          transition-all
          placeholder:text-[#607B96]/50
        "
      />
    </div>
  );
}