"use client";

import { useEditorStore } from "@/store/editorStore";
import {
    Layers,
    Square,
    Circle as CircleIcon,
    Triangle as TriangleIcon,
    Type,
    Minus,
    ChevronUp,
    ChevronDown,
    Eye,
    EyeOff,
    MousePointer2,
    Image as ImageIcon,
    Pencil
} from "lucide-react";

export default function LayersPanel() {
    const { canvas, canvasObjects, selectedObjects, saveHistory, setCanvasObjects } = useEditorStore();

    const getIcon = (obj: any) => {
        // Line uses a Rect under the hood, so we check our custom data tag first
        const type = obj.data?.type || obj.type;
        switch (type) {
            case "rect": return <Square size={14} />;
            case "line": return <Minus size={14} className="rotate-45" />;
            case "circle": return <CircleIcon size={14} />;
            case "triangle": return <TriangleIcon size={14} />;
            case "image": return <ImageIcon size={14} />;
            case "path": return <Pencil size={14} />;
            case "textbox":
            case "i-text": return <Type size={14} />;
            default: return <Layers size={14} />;
        }
    };

    const selectObject = (obj: any) => {
        if (!canvas) return;
        canvas.discardActiveObject();
        canvas.setActiveObject(obj);
        canvas.renderAll();
    };

    const moveObject = (obj: any, direction: 'up' | 'down') => {
        if (!canvas) return;
        if (direction === 'up') {
            canvas.bringObjectForward(obj);
        } else {
            canvas.sendObjectBackwards(obj);
        }
        canvas.renderAll();
        saveHistory();
        setCanvasObjects([...canvas.getObjects()].reverse());
    };

    const toggleVisibility = (obj: any) => {
        if (!canvas) return;
        obj.set("visible", !obj.visible);
        canvas.renderAll();
        saveHistory();
        setCanvasObjects([...canvas.getObjects()].reverse());
    };

    return (
        <div className="flex-1 flex flex-col min-h-0 border-t border-neutral-800 mt-6 pt-6 overflow-hidden">
            <div className="flex items-center gap-2 mb-4 px-2">
                <Layers size={18} className="text-blue-500" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Layers</h3>
                <span className="ml-auto text-[10px] font-black bg-neutral-800 px-2 py-0.5 rounded-full text-neutral-400">
                    {canvasObjects.length}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-1">
                {canvasObjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-neutral-600 text-center px-4">
                        <MousePointer2 size={24} className="mb-2 opacity-20" />
                        <p className="text-[11px] font-medium leading-tight">No objects on canvas.<br />Add some shapes to start!</p>
                    </div>
                ) : (
                    canvasObjects.map((obj, index) => {
                        const isSelected = selectedObjects.includes(obj);
                        const type = obj.data?.type || obj.type;
                        const label = type === 'textbox' || type === 'i-text'
                            ? (obj.text?.substring(0, 15) || 'Text')
                            : type.charAt(0).toUpperCase() + type.slice(1);

                        return (
                            <div
                                key={index}
                                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer border ${isSelected ? 'bg-blue-600/10 border-blue-500/50 text-white' : 'hover:bg-neutral-800 border-transparent text-neutral-400'}`}
                                onClick={() => selectObject(obj)}
                            >
                                <div className={`${isSelected ? 'text-blue-400' : 'text-neutral-500 group-hover:text-neutral-300'}`}>
                                    {getIcon(obj)}
                                </div>

                                <span className="flex-1 text-[11px] font-semibold truncate">
                                    {label}
                                </span>

                                <div className={`flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? 'opacity-100' : ''}`}>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleVisibility(obj); }}
                                        className="p-1 hover:bg-neutral-700 rounded-md transition-colors"
                                    >
                                        {obj.visible ? <Eye size={12} /> : <EyeOff size={12} className="text-red-500" />}
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); moveObject(obj, 'up'); }}
                                        disabled={index === 0}
                                        className="p-1 hover:bg-neutral-700 rounded-md transition-colors disabled:opacity-20"
                                    >
                                        <ChevronUp size={12} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); moveObject(obj, 'down'); }}
                                        disabled={index === canvasObjects.length - 1}
                                        className="p-1 hover:bg-neutral-700 rounded-md transition-colors disabled:opacity-20"
                                    >
                                        <ChevronDown size={12} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
