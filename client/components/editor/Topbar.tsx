"use client";

import { useEditorStore } from "@/store/editorStore";
import { Undo2, Redo2, Trash2 } from "lucide-react";

import { useEffect, useState } from "react";

export default function Topbar() {
  const [mounted, setMounted] = useState(false);
  const { undo, redo, canUndo, canRedo, clearCanvas } = useEditorStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isUndoDisabled = !mounted || !canUndo();
  const isRedoDisabled = !mounted || !canRedo();

  return (
    <header className="h-14 bg-neutral-900 border-b border-neutral-800 flex items-center px-6 justify-between shrink-0">
      <div className="flex items-center gap-4 group cursor-pointer">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full group-hover:bg-blue-400/30 transition-all duration-500" />
          <img
            src="/logo.png"
            alt="NoCap Studio Logo"
            className="w-10 h-10 object-contain relative z-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
          />
        </div>
        <div className="flex flex-col select-none">
          <h1 className="font-bold text-lg tracking-tight leading-none text-white drop-shadow-sm group-hover:text-blue-50 transition-colors">
            NoCap
          </h1>
          <div className="flex items-center gap-1.5 mt-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">
              Studio
            </span>
          </div>
        </div>
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

        <div className="w-[1px] h-4 bg-neutral-800 mx-1" />

        <button
          onClick={() => {
            if (confirm("Are you sure you want to clear the entire canvas? This will also wipe your undo history.")) {
              clearCanvas();
            }
          }}
          className="p-1.5 hover:bg-red-500/10 rounded-lg text-neutral-400 hover:text-red-400 transition-all"
          title="Clear Canvas"
        >
          <Trash2 size={18} />
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
