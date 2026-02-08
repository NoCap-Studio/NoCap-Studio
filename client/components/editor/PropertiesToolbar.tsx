"use client";

import { useEditorStore } from "@/store/editorStore";
import { useState, useEffect } from "react";
import { Palette, Baseline, Type as TypeIcon, Trash2 } from "lucide-react";

export default function PropertiesToolbar() {
    const { canvas, selectedObjects, saveHistory } = useEditorStore();
    const [fill, setFill] = useState("#000000");
    const [fontSize, setFontSize] = useState("32");
    const [fontFamily, setFontFamily] = useState("Inter");

    // Sync state with selected object
    useEffect(() => {
        if (selectedObjects.length === 1) {
            const obj = selectedObjects[0];
            setFill(obj.get("fill") as string || "#000000");
            if (obj.type === "textbox" || obj.type === "i-text") {
                setFontSize(Math.round(obj.get("fontSize") as number).toString());
                setFontFamily(obj.get("fontFamily") as string || "Inter");
            }
        }
    }, [selectedObjects]);

    if (selectedObjects.length === 0) return null;

    const updateProperty = (key: string, value: any) => {
        if (!canvas) return;
        const activeObjects = canvas.getActiveObjects();
        activeObjects.forEach((obj) => {
            obj.set(key as any, value);
        });
        canvas.renderAll();
        saveHistory();
    };

    const deleteSelected = () => {
        if (!canvas) return;
        const activeObjects = canvas.getActiveObjects();
        canvas.discardActiveObject();
        canvas.remove(...activeObjects);
        canvas.renderAll();
        saveHistory();
    };

    const colors = [
        "#000000", "#ffffff", "#ef4444", "#f97316", "#f59e0b",
        "#10b981", "#3b82f6", "#6366f1", "#8b5cf6", "#d946ef"
    ];

    const fonts = ["Inter", "Arial", "Times New Roman", "Courier New", "Georgia"];

    return (
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-neutral-900/90 backdrop-blur-md p-2 rounded-2xl border border-neutral-800 shadow-2xl z-[60] min-w-max animate-in fade-in slide-in-from-top-4 duration-200">

            {/* Color Picker Section */}
            <div className="flex items-center gap-1.5 px-2 border-r border-neutral-800">
                <Palette size={14} className="text-neutral-500 mr-1" />
                <div className="flex gap-1">
                    {colors.map((c) => (
                        <button
                            key={c}
                            onClick={() => {
                                setFill(c);
                                updateProperty("fill", c);
                            }}
                            className={`w-6 h-6 rounded-md border border-white/10 transition-transform active:scale-90 ${fill === c ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-neutral-900 border-white/40' : 'hover:scale-110'}`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                    <input
                        type="color"
                        value={fill}
                        onChange={(e) => {
                            setFill(e.target.value);
                            updateProperty("fill", e.target.value);
                        }}
                        className="w-6 h-6 rounded-md bg-transparent border-none cursor-pointer p-0 overflow-hidden"
                    />
                </div>
            </div>

            {/* Text Properties Section */}
            {selectedObjects.some(obj => obj.type === 'textbox' || obj.type === 'i-text') && (
                <div className="flex items-center gap-3 px-2 border-r border-neutral-800">
                    <div className="flex items-center gap-2">
                        <Baseline size={14} className="text-neutral-500" />
                        <select
                            value={fontFamily}
                            onChange={(e) => {
                                setFontFamily(e.target.value);
                                updateProperty("fontFamily", e.target.value);
                            }}
                            className="bg-neutral-800 text-[11px] text-white rounded-lg px-2 py-1 outline-none border border-neutral-700 hover:border-neutral-500 transition-colors"
                        >
                            {fonts.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <TypeIcon size={14} className="text-neutral-500" />
                        <input
                            type="number"
                            value={fontSize}
                            onChange={(e) => {
                                setFontSize(e.target.value);
                                updateProperty("fontSize", parseInt(e.target.value));
                            }}
                            className="w-12 bg-neutral-800 text-[11px] text-white rounded-lg px-2 py-1 outline-none border border-neutral-700 hover:border-neutral-500 transition-colors"
                        />
                    </div>
                </div>
            )}

            {/* Action Section */}
            <div className="px-1 flex items-center">
                <button
                    onClick={deleteSelected}
                    className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all active:scale-95"
                    title="Delete Selection"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
}
