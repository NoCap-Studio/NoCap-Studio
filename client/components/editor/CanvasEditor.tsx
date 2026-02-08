"use client";

import { createCanvas } from "@/lib/fabric";
import { useEditorStore } from "@/store/editorStore";
import { useEffect, useRef } from "react";
import { Point } from "fabric";
import Toolbar from "./Toolbar";
import PropertiesToolbar from "./PropertiesToolbar";

export default function CanvasEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setCanvas, zoom, setZoom, resetView, loadFromLocalStorage, setSelectedObjects } = useEditorStore();

  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = createCanvas(canvasRef.current);
    setCanvas(canvas);

    // Event handlers using getState() to avoid dependency re-renders
    const handleSave = () => {
      const state = useEditorStore.getState();
      state.saveHistory();
      state.setCanvasObjects([...canvas.getObjects()].reverse()); // Reverse to show top-most at top
    };

    const handleSelection = () => {
      setSelectedObjects(canvas.getActiveObjects());
    };

    const handleSelectionCleared = () => {
      setSelectedObjects([]);
    };

    canvas.on("object:added", handleSave);
    canvas.on("object:modified", handleSave);
    canvas.on("object:removed", handleSave);

    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", handleSelectionCleared);

    const handleMouseWheel = (opt: any) => {
      const delta = opt.e.deltaY;
      const state = useEditorStore.getState();
      let newZoom = canvas.getZoom();
      newZoom *= 0.999 ** delta;
      if (newZoom > 5) newZoom = 5;
      if (newZoom < 0.1) newZoom = 0.1;

      canvas.zoomToPoint(new Point(opt.e.offsetX, opt.e.offsetY), newZoom);
      state.setZoom(newZoom);

      opt.e.preventDefault();
      opt.e.stopPropagation();
    };

    canvas.on("mouse:wheel", handleMouseWheel);

    const handleKeyDown = (e: KeyboardEvent) => {
      const { undo, redo, setZoom, zoom: currentZoom } = useEditorStore.getState();

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        if (e.shiftKey) redo(); else undo();
        e.preventDefault();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        redo();
        e.preventDefault();
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === "=" || e.key === "+")) {
        setZoom(currentZoom + 0.1);
        e.preventDefault();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        setZoom(currentZoom - 0.1);
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      canvas.off("object:added", handleSave);
      canvas.off("object:modified", handleSave);
      canvas.off("object:removed", handleSave);
      canvas.off("mouse:wheel", handleMouseWheel);
      window.removeEventListener("keydown", handleKeyDown);
      canvas.dispose();
    };
  }, [setCanvas]); // Only initialize once!

  return (
    <div className="flex-1 bg-[#121212] overflow-hidden relative flex flex-col">
      {/* Workspace Area */}
      <div className="flex-1 relative overflow-auto editor-grid flex items-center justify-center p-20 custom-scrollbar">
        <div className="relative shadow-[0_0_100px_rgba(0,0,0,0.5)] bg-white rounded-sm group translate-z-0">
          <div className="relative z-50">
            <Toolbar />
            <PropertiesToolbar />
          </div>

          {/* Canvas Wrapper for better centering and border */}
          <div className="border border-neutral-800 relative z-10 overflow-hidden rounded-sm">
            <canvas ref={canvasRef} className="block" />
          </div>

          {/* Hover Indicators for the canvas boundary */}
          <div className="absolute inset-0 pointer-events-none border-2 border-transparent group-hover:border-blue-500/10 transition-colors" />
        </div>
      </div>

      {/* Floating Zoom / Viewport Controls */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-neutral-900 border border-neutral-800 p-1.5 rounded-xl shadow-2xl backdrop-blur-md z-[100]">
        <button
          onClick={resetView}
          className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-all active:scale-90 border-r border-neutral-800 pr-3 mr-1"
          title="Reset View (Zoom 100%)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
        </button>
        <div className="px-1 min-w-[50px] text-center text-[10px] font-black text-neutral-400 border-r border-neutral-800 uppercase tracking-tighter">
          {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={() => setZoom(zoom - 0.1)}
          className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-all active:scale-90"
          title="Zoom Out (Ctrl -)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </button>
        <button
          onClick={() => setZoom(zoom + 0.1)}
          className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-all active:scale-90"
          title="Zoom In (Ctrl +)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </button>
      </div>

      {/* Bottom Status Bar */}
      <div className="h-8 bg-neutral-900 border-t border-neutral-800 px-4 flex items-center justify-between text-[10px] font-medium text-neutral-500 uppercase tracking-widest shrink-0">
        <div className="flex items-center gap-4">
          <span>900 x 500 px</span>
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
            Connected
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="cursor-help hover:text-neutral-300 transition-colors">Selection: None</span>
          <span>NoCap v0.1.0</span>
        </div>
      </div>
    </div>
  );
}
