"use client";

import { useEditorStore } from "@/store/editorStore";
import { Rect, Textbox, Circle, Triangle } from "fabric";
import {
  Type,
  Square,
  Circle as CircleIcon,
  Triangle as TriangleIcon,
  Minus,
  Download,
  MousePointer2,
  Pencil
} from "lucide-react";

export default function Toolbar() {
  const { canvas, isDrawingMode, setDrawingMode } = useEditorStore();

  const addText = () => {
    if (!canvas) return;
    const text = new Textbox("Your text", {
      left: 100,
      top: 100,
      fill: "#000000",
      fontSize: 32,
      fontFamily: "Inter, system-ui, sans-serif",
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const addRect = () => {
    if (!canvas) return;
    const rect = new Rect({
      width: 150,
      height: 150,
      fill: "#3b82f6",
      left: 150,
      top: 150,
      rx: 8,
      ry: 8,
      data: { type: "rect" }
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
  };

  const addCircle = () => {
    if (!canvas) return;
    const circle = new Circle({
      radius: 75,
      fill: "#10b981",
      left: 200,
      top: 200,
    });
    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
  };

  const addTriangle = () => {
    if (!canvas) return;
    const triangle = new Triangle({
      width: 150,
      height: 150,
      fill: "#f59e0b",
      left: 250,
      top: 250,
    });
    canvas.add(triangle);
    canvas.setActiveObject(triangle);
    canvas.renderAll();
  };

  const addLine = () => {
    if (!canvas) return;
    const line = new Rect({
      width: 200,
      height: 4,
      fill: "#6366f1",
      left: 300,
      top: 300,
      rx: 2,
      ry: 2,
      data: { type: "line" }
    });
    canvas.add(line);
    canvas.setActiveObject(line);
    canvas.renderAll();
  };

  const exportPNG = () => {
    if (!canvas) return;

    // Ensure background is white for the export
    canvas.set("backgroundColor", "#ffffff");

    const data = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2,
    });
    const link = document.createElement("a");
    link.href = data;
    link.download = `nocap-design-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-neutral-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-neutral-800 shadow-2xl">
      <div className="flex items-center gap-1 pr-1 border-r border-neutral-800">
        <button
          onClick={() => setDrawingMode(false)}
          className={`p-2.5 rounded-xl transition-all active:scale-95 ${!isDrawingMode ? "bg-blue-600 text-white shadow-sm" : "text-neutral-400 hover:text-white hover:bg-neutral-800"
            }`}
          title="Select"
        >
          <MousePointer2 size={18} />
        </button>
        <button
          onClick={() => setDrawingMode(true)}
          className={`p-2.5 rounded-xl transition-all active:scale-95 ${isDrawingMode ? "bg-blue-600 text-white shadow-sm" : "text-neutral-400 hover:text-white hover:bg-neutral-800"
            }`}
          title="Draw"
        >
          <Pencil size={18} />
        </button>
      </div>

      <div className="flex items-center gap-1 px-1">
        <button
          onClick={addText}
          className="p-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all active:scale-95"
          title="Add Text"
        >
          <Type size={18} />
        </button>
      </div>

      <div className="flex items-center gap-1 px-1 border-l border-neutral-800">
        <button
          onClick={addRect}
          className="p-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all active:scale-95"
          title="Add Rectangle"
        >
          <Square size={18} />
        </button>
        <button
          onClick={addCircle}
          className="p-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all active:scale-95"
          title="Add Circle"
        >
          <CircleIcon size={18} />
        </button>
        <button
          onClick={addTriangle}
          className="p-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all active:scale-95"
          title="Add Triangle"
        >
          <TriangleIcon size={18} />
        </button>
        <button
          onClick={addLine}
          className="p-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all active:scale-95"
          title="Add Line"
        >
          <Minus size={18} className="rotate-45" />
        </button>
      </div>

      <div className="flex items-center gap-1 pl-1 border-l border-neutral-800">
        <button
          onClick={exportPNG}
          className="p-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all active:scale-95"
          title="Export PNG"
        >
          <Download size={18} />
        </button>
      </div>
    </div>
  );
}
