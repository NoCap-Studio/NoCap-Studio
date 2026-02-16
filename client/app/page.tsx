import DashboardHeader from "@/components/dashboard/DashboardHeader";
import NewProjectCard from "@/components/dashboard/NewProjectCard";
import ProjectCard from "@/components/dashboard/ProjectCard";
import { Sparkles, Layout, Camera, Briefcase, Palette, Image, Film, Settings } from "lucide-react";
import { getProjects } from "@/app/actions/projects";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function LibraryPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/auth");
  }

  // Redirect to onboarding if the user has no active organization
  let activeOrgId = session.session.activeOrganizationId;

  if (!activeOrgId) {
    // Check if the user has any organizations
    const memberships = await prisma.member.findMany({
      where: { userId: session.user.id },
      take: 1
    });

    if (memberships.length === 0) {
      redirect("/onboarding");
    } else {
      // Fallback to the first organization found
      activeOrgId = memberships[0].organizationId;
    }
  }

  let projects: any[] = [];
  try {
    if (activeOrgId) {
      projects = await getProjects(activeOrgId);
    }
  } catch (error) {
    console.error("Failed to fetch projects server-side:", error);
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <DashboardHeader />

      <div className="flex-1 max-w-7xl mx-auto w-full px-8 py-10">
        {/* Welcome Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                Welcome back, {session.user.name?.split(' ')[0] || "Designer"} <Sparkles className="text-yellow-500" size={24} />
              </h2>
              <p className="text-neutral-500 mt-2 font-medium">Ready to start another masterpiece?</p>
            </div>

            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 p-1 rounded-xl">
              <button className="px-4 py-2 bg-neutral-800 text-white text-xs font-bold rounded-lg shadow-sm">Grid View</button>
              <button className="px-4 py-2 text-neutral-500 text-xs font-medium rounded-lg hover:text-neutral-300">List View</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <NewProjectCard userId={session.user.id} organizationId={activeOrgId ?? undefined} />
            {projects.length > 0 ? (
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
              { label: "Instagram", icon: "Camera", color: "text-pink-500", bg: "bg-pink-500/10" },
              { label: "LinkedIn", icon: "Briefcase", color: "text-blue-500", bg: "bg-blue-500/10" },
              { label: "Logo", icon: "Palette", color: "text-purple-500", bg: "bg-purple-500/10" },
              { label: "Posters", icon: "Image", color: "text-orange-500", bg: "bg-orange-500/10" },
              { label: "Banners", icon: "Film", color: "text-red-500", bg: "bg-red-500/10" },
              { label: "Custom", icon: "Settings", color: "text-neutral-500", bg: "bg-neutral-500/10" },
            ].map((cat) => {
              const IconComponent = require("lucide-react")[cat.icon];
              return (
                <button
                  key={cat.label}
                  className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col items-center gap-4 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all group relative overflow-hidden active:scale-95"
                >
                  <div className={`w-12 h-12 ${cat.bg} rounded-xl flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-blue-400 transition-colors">{cat.label}</span>

                  {/* Subtle hover glow */}
                  <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })}
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
