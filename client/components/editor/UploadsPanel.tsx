"use client";

import { useEditorStore } from "@/store/editorStore";
import { FabricImage } from "fabric";
import { Upload, Plus, Image as ImageIcon, Trash2, Loader2 } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import { useRef, useState } from "react";

export default function UploadsPanel() {
    const { canvas, uploads, addUpload, removeUpload, saveHistory } = useEditorStore();
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { startUpload } = useUploadThing("imageUploader", {
        onClientUploadComplete: (res) => {
            setIsUploading(false);
            if (res && res[0]) {
                addUpload(res[0].url);
            }
        },
        onUploadError: (error) => {
            setIsUploading(false);
            alert(`Upload failed: ${error.message}`);
        },
        onUploadBegin: () => {
            setIsUploading(true);
        },
    });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        startUpload(Array.from(files));
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const addImageToCanvas = async (url: string) => {
        if (!canvas) return;

        try {
            const img = await FabricImage.fromURL(url, {
                crossOrigin: 'anonymous'
            });

            if (img.width! > 400) {
                img.scaleToWidth(400);
            }

            canvas.add(img);
            canvas.centerObject(img);
            canvas.setActiveObject(img);
            canvas.renderAll();

            saveHistory();
            const state = useEditorStore.getState();
            state.setCanvasObjects([...canvas.getObjects()].reverse());
        } catch (error) {
            console.error("Error adding image to canvas:", error);
        }
    };

    return (
        <div className="flex-1 flex flex-col min-h-0 border-t border-neutral-800 mt-6 pt-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-2">
                    <Upload size={18} className="text-blue-500" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Uploads</h3>
                </div>

                <div className="flex items-center">
                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex items-center justify-center p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-900/20 min-w-[36px]"
                        title="Upload Image"
                    >
                        {isUploading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Plus size={18} />
                        )}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                {uploads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-neutral-600 text-center px-4 border-2 border-dashed border-neutral-800 rounded-3xl mt-2">
                        <ImageIcon size={32} className="mb-3 opacity-20" />
                        <p className="text-[11px] font-medium leading-tight">
                            No uploads yet.<br />
                            Click the + button to add one.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {uploads.map((url, index) => (
                            <div
                                key={index}
                                className="group relative aspect-square bg-neutral-800 rounded-xl overflow-hidden border border-neutral-700 hover:border-blue-500/50 transition-all cursor-pointer shadow-lg"
                                onClick={() => addImageToCanvas(url)}
                            >
                                <img
                                    src={url}
                                    alt={`Upload ${index}`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                                    <div className="bg-blue-600 p-2 rounded-full text-white shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-200">
                                        <Plus size={20} strokeWidth={3} />
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeUpload(url);
                                        }}
                                        className="absolute top-1.5 right-1.5 p-1.5 bg-neutral-900/90 hover:bg-red-500 text-neutral-400 hover:text-white rounded-lg transition-all active:scale-90 border border-neutral-800 hover:border-red-400 shadow-lg"
                                        title="Delete Upload"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
