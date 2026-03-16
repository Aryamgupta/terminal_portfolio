export default function MessagesAdminPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Message Inbox</h1>
        <p className="text-[#607B96] text-sm font-mono mt-1">// review incoming transmissions</p>
      </div>

      <div className="bg-[#011221] border border-[#1E2D3D] rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-16 h-16 bg-[#1C2B3A] rounded-2xl flex items-center justify-center text-[#43D9AD] mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
        </div>
        <h3 className="text-xl font-bold text-white">Communications Interface</h3>
        <p className="text-[#607B96] mt-2 max-w-sm">This module is currently offline. Direct messaging synchronization is pending deployment.</p>
        <button className="mt-6 bg-[#43D9AD] text-[#011627] font-bold py-2 px-6 rounded-lg shadow-glow-sm hover:bg-white hover:text-black transition-colors">
          Initialize Module
        </button>
      </div>
    </div>
  );
}
