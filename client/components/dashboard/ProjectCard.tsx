"use client";

import { MoreHorizontal, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ProjectCardProps {
    id: string;
    name: string;
    thumbnail?: string;
    updatedAt: string;
}

export default function ProjectCard({ id, name, thumbnail, updatedAt }: ProjectCardProps) {
    return (
        <div className="group bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden hover:border-neutral-700 transition-all duration-300 shadow-lg hover:shadow-2xl">
            {/* Preview Area */}
            <div className="relative h-[180px] bg-[#1a1a1a] overflow-hidden">
                {thumbnail ? (
                    <img src={thumbnail} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                        <div className="w-24 h-24 border-4 border-white/5 rounded-2xl" />
                    </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                    <Link
                        href={`/editor?id=${id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-500 active:scale-95 transition-all"
                    >
                        Edit Project <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            {/* Info Area */}
            <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white truncate max-w-[150px] group-hover:text-blue-400 transition-colors">{name}</h3>
                    <button className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg transition-all">
                        <MoreHorizontal size={18} />
                    </button>
                </div>

                <div className="flex items-center gap-2 text-neutral-500">
                    <Calendar size={14} />
                    <span className="text-xs font-medium">Updated {updatedAt}</span>
                </div>
            </div>
        </div>
    );
}
