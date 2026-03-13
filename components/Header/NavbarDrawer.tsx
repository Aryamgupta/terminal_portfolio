"use client";

import { useState } from "react";
import Link from "next/link";

export default function NavbarDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center p-2"
      >
        {/* {!open ? <OpenMenuIcon /> : <CloseModalIconn />} */}
      </button>

      {/* Drawer */}
      {open && (
        <div className="absolute right-4 top-[66px] w-[250px] bg-[#1E2D3D] border border-[#1E2D3D] rounded-md z-50">

          <nav className="flex flex-col text-white">

            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="border-b border-[#1E2D3D] p-3 hover:bg-[#011627]"
            >
              _hello
            </Link>

            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="border-b border-[#1E2D3D] p-3 hover:bg-[#011627]"
            >
              _about
            </Link>

            <Link
              href="/projects"
              onClick={() => setOpen(false)}
              className="border-b border-[#1E2D3D] p-3 hover:bg-[#011627]"
            >
              _projects
            </Link>

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="border-b border-[#1E2D3D] p-3 hover:bg-[#011627]"
            >
              _contact-me
            </Link>

          </nav>

        </div>
      )}
    </>
  );
}