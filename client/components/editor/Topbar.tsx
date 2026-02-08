"use client";

import { useEditorStore } from "@/store/editorStore";
import { Undo2, Redo2 } from "lucide-react";

import { useEffect, useState } from "react";

export default function Topbar() {
  const [mounted, setMounted] = useState(false);
  const { undo, redo, canUndo, canRedo } = useEditorStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isUndoDisabled = !mounted || !canUndo();
  const isRedoDisabled = !mounted || !canRedo();

  return (
    <header className="h-14 bg-neutral-900 border-b border-neutral-800 flex items-center px-6 justify-between shrink-0">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white italic">NC</div>
        <h1 className="font-bold text-lg tracking-tight">NoCap Studio</h1>
      </div>

      <div className="flex items-center bg-neutral-800/50 p-1 rounded-xl border border-neutral-800">
        <button
          onClick={undo}
          disabled={isUndoDisabled}
          className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={18} />
        </button>
        <button
          onClick={redo}
          disabled={isRedoDisabled}
          className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={18} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button className="px-4 py-1.5 rounded-lg bg-neutral-800 text-white text-sm font-medium hover:bg-neutral-700 transition-all border border-neutral-700">
          Share
        </button>
        <button className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20">
          Export
        </button>
      </div>
    </header>
  );
}
