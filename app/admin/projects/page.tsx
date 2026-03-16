export default function ProjectsAdminPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Project Management</h1>
        <p className="text-[#607B96] text-sm font-mono mt-1">// add, edit, or remove portfolio projects</p>
      </div>

      <div className="bg-[#011221] border border-[#1E2D3D] rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-16 h-16 bg-[#1C2B3A] rounded-2xl flex items-center justify-center text-[#FEA55F] mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5Z"/><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2Z"/><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0Z"/><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0Z"/><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5Z"/></svg>
        </div>
        <h3 className="text-xl font-bold text-white">Project Interface Module</h3>
        <p className="text-[#607B96] mt-2 max-w-sm">This module is designated for future deployment. Content management features will be synchronized soon.</p>
        <button className="mt-6 bg-[#FEA55F] text-[#011627] font-bold py-2 px-6 rounded-lg shadow-glow-sm hover:bg-white hover:text-black transition-colors">
          Initialize Module
        </button>
      </div>
    </div>
  );
}
