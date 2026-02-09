import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createProject } from "@/app/actions/projects";
import { useState } from "react";

interface NewProjectCardProps {
    userId?: string;
}

export default function NewProjectCard({ userId }: NewProjectCardProps) {
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = async () => {
        if (!userId || isCreating) return;

        setIsCreating(true);
        try {
            const project = await createProject(userId, "Untitled Project");
            router.push(`/editor?id=${project.id}`);
        } catch (error) {
            console.error("Failed to create project:", error);
            setIsCreating(false);
        }
    };

    return (
        <button
            onClick={handleCreate}
            disabled={!userId || isCreating}
            className="group relative h-[280px] w-full bg-neutral-900 border-2 border-dashed border-neutral-800 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-900/20 transform group-hover:scale-110 group-active:scale-95 transition-all duration-300">
                {isCreating ? <Loader2 className="animate-spin" size={32} strokeWidth={2.5} /> : <Plus size={32} strokeWidth={2.5} />}
            </div>
            <div className="text-center">
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {isCreating ? "Initializing..." : "Create New Project"}
                </h3>
                <p className="text-sm text-neutral-500 mt-1">Start from a blank canvas</p>
            </div>

            {/* Hover Decoration */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-transparent via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </button>
    );
}
