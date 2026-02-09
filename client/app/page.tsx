"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import NewProjectCard from "@/components/dashboard/NewProjectCard";
import ProjectCard from "@/components/dashboard/ProjectCard";
import { Sparkles, Layout } from "lucide-react";
import { useEffect, useState } from "react";
import { getProjects } from "@/app/actions/projects";
import { getOrCreateDefaultUser } from "@/app/actions/user";

export default function LibraryPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      const dbUser = await getOrCreateDefaultUser();
      if (dbUser) {
        setUser(dbUser);
        const dbProjects = await getProjects(dbUser.id);
        setProjects(dbProjects);
      }
      setIsLoading(false);
    };
    init();
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <DashboardHeader />

      <div className="flex-1 max-w-7xl mx-auto w-full px-8 py-10">
        {/* Welcome Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                Welcome back, {user?.name?.split(' ')[0] || "Designer"} <Sparkles className="text-yellow-500" size={24} />
              </h2>
              <p className="text-neutral-500 mt-2 font-medium">Ready to start another masterpiece?</p>
            </div>

            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 p-1 rounded-xl">
              <button className="px-4 py-2 bg-neutral-800 text-white text-xs font-bold rounded-lg shadow-sm">Grid View</button>
              <button className="px-4 py-2 text-neutral-500 text-xs font-medium rounded-lg hover:text-neutral-300">List View</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <NewProjectCard userId={user?.id} />
            {isLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-[280px] bg-neutral-900/50 rounded-3xl animate-pulse border border-neutral-800" />
              ))
            ) : projects.length > 0 ? (
              projects.map((p) => (
                <ProjectCard key={p.id} id={p.id} name={p.name} updatedAt={new Date(p.updatedAt).toLocaleDateString()} thumbnail={p.thumbnail} />
              ))
            ) : (
              <div className="col-span-full h-40 flex flex-col items-center justify-center border border-neutral-800 border-dashed rounded-3xl text-neutral-500">
                <p>No projects yet. Create your first one!</p>
              </div>
            )}
          </div>
        </section>

        {/* Categories / Quick Start */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Layout size={18} className="text-blue-500" />
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Quick Start</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { label: "Instagram", icon: "📸" },
              { label: "LinkedIn", icon: "💼" },
              { label: "Logo", icon: "🎨" },
              { label: "Posters", icon: "🖼️" },
              { label: "Banners", icon: "🎞️" },
              { label: "Custom", icon: "⚙️" },
            ].map((cat) => (
              <button
                key={cat.label}
                className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl flex flex-col items-center gap-3 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-blue-400 transition-colors">{cat.label}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Floating Status / Help */}
      <div className="fixed bottom-8 left-8 flex items-center gap-4 bg-neutral-900/80 backdrop-blur-md border border-neutral-800 px-4 py-2.5 rounded-2xl shadow-2xl">
        <div className="flex -space-x-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-6 h-6 rounded-full border-2 border-neutral-900 bg-neutral-800 flex items-center justify-center text-[8px] font-bold text-white">
              U{i}
            </div>
          ))}
        </div>
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider underline cursor-pointer hover:text-white">Community Designs</span>
      </div>
    </main>
  );
}
