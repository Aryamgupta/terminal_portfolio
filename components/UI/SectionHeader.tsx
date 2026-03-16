import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  icon?: LucideIcon;
}

export default function SectionHeader({ title, icon: Icon }: Props) {
  return (
    <div className="flex items-center gap-3 border-b border-[#1E2D3D] pb-2">
      {Icon && <Icon size={18} className="text-[#FEA55F]" />}
      <h2 className="text-lg font-semibold text-white">
        {title}
      </h2>
    </div>
  );
}