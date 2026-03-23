"use client";

import React from "react";
import { trpc } from "@/utils/trpc";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  iconId?: string;
  size?: number | string;
  color?: string;
}

/**
 * Reusable CustomIcon component that renders SVG from the database.
 * Usage: <CustomIcon name="react" size={24} color="#61DAFB" />
 */
export default function CustomIcon({ name, iconId, size = 20, color, style, ...props }: Props) {
  const { data: icons } = trpc.customIcon.getAll.useQuery();

  const icon = icons?.find((i: { id: string; name: string; svg: string }) => (iconId ? i.id === iconId : i.name === name));

  if (!icon) {
    return (
      <div 
        style={{ 
          width: size, 
          height: size, 
          display: "inline-flex", 
          alignItems: "center", 
          justifyContent: "center",
          color: color || "inherit",
          ...style 
        }} 
        {...props}
      >
        <span style={{ fontSize: "10px" }}>?</span>
      </div>
    );
  }

  // Inject current color if requested and handle sizing
  const svgWithColor = color 
    ? icon.svg.replace(/fill="[^"]*"/g, `fill="${color}"`).replace(/stroke="[^"]*"/g, `stroke="${color}"`)
    : icon.svg;

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: color || "inherit",
        ...style
      }}
      className="custom-icon-container [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current"
      dangerouslySetInnerHTML={{ __html: svgWithColor }}
      {...props}
    />
  );
}
