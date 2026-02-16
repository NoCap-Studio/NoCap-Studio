"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import {
    Users,
    Settings,
    CreditCard,
    ArrowLeft,
    Building,
    Hash,
    Save,
    Loader2,
    UserPlus,
    Shield,
    Trash2,
    Mail,
    Check
} from "lucide-react";

export default function WorkspaceSettingsPage() {
    const { data: session } = authClient.useSession();
    const { data: activeOrg, isPending: isOrgPending } = authClient.useActiveOrganization();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<"general" | "members" | "billing">("general");
    const [orgName, setOrgName] = useState("");
    const [orgSlug, setOrgSlug] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (activeOrg) {
            setOrgName(activeOrg.name);
            setOrgSlug(activeOrg.slug || "");
        }
    }, [activeOrg]);

    const handleUpdateOrg = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const { error } = await authClient.organization.update({
                name: orgName,
                slug: orgSlug,
            });

            if (error) throw new Error(error.message);

            setSuccessMessage("Workspace updated successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err: any) {
            setErrorMessage(err.message || "Failed to update workspace");
        } finally {
            setIsLoading(false);
        }
    };

    if (isOrgPending) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    if (!activeOrg) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
                <p className="text-neutral-500 font-medium">No active workspace found.</p>
                <button
                    onClick={() => router.push("/")}
                    className="text-white bg-blue-600 px-6 py-2 rounded-xl font-bold text-sm"
                >
                    Back to Library
                </button>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#0a0a0a] flex flex-col">
            <DashboardHeader />

            <div className="flex-1 max-w-7xl mx-auto w-full px-8 py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-700 transition-all"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tight">Workspace Settings</h1>
                            <p className="text-neutral-500 font-medium text-sm mt-1">Manage your team and workspace preferences.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Tabs */}
                    <div className="lg:col-span-1 border-r border-neutral-800 pr-8 space-y-2">
                        {[
                            { id: "general", label: "General", icon: Settings },
                            { id: "members", label: "Members", icon: Users },
                            { id: "billing", label: "Plans & Billing", icon: CreditCard },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === tab.id ? "bg-blue-600 text-white shadow-xl shadow-blue-500/10" : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900"}`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3 space-y-8">
                        {activeTab === "general" && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-[32px] p-8">
                                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                        <Building className="text-blue-500" size={20} />
                                        Workspace Profile
                                    </h2>

                                    <form onSubmit={handleUpdateOrg} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-black tracking-widest text-neutral-500 ml-1">Workspace Name</label>
                                                <div className="relative">
                                                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                                                    <input
                                                        required
                                                        type="text"
                                                        value={orgName}
                                                        onChange={(e) => setOrgName(e.target.value)}
                                                        className="w-full bg-neutral-800/30 border border-neutral-700/50 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-black tracking-widest text-neutral-500 ml-1">Workspace URL Segment (Slug)</label>
                                                <div className="relative">
                                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                                                    <input
                                                        required
                                                        type="text"
                                                        value={orgSlug}
                                                        onChange={(e) => setOrgSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                                        className="w-full bg-neutral-800/30 border border-neutral-700/50 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                                            <div className="flex flex-col">
                                                {successMessage && <p className="text-green-500 text-xs font-bold flex items-center gap-2"><Check size={14} /> {successMessage}</p>}
                                                {errorMessage && <p className="text-red-500 text-xs font-bold">{errorMessage}</p>}
                                            </div>
                                            <button
                                                disabled={isLoading || (orgName === activeOrg.name && orgSlug === activeOrg.slug)}
                                                type="submit"
                                                className="bg-white hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-600 text-black px-8 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all active:scale-95 shadow-xl shadow-white/5"
                                            >
                                                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Save Changes</>}
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                <div className="bg-red-500/5 border border-red-500/10 rounded-[32px] p-8">
                                    <h2 className="text-xl font-bold text-red-500 mb-2">Danger Zone</h2>
                                    <p className="text-neutral-500 text-sm mb-6 font-medium">Once you delete a workspace, there is no going back. All projects will be permanently removed.</p>
                                    <button
                                        className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
                                    >
                                        Delete Workspace
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === "members" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center justify-between bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-[32px] p-8">
                                    <div>
                                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                            <Users className="text-blue-500" size={20} />
                                            Team Directory
                                        </h2>
                                        <p className="text-neutral-500 text-sm mt-1 font-medium">Manage members and invitations for {activeOrg.name}.</p>
                                    </div>
                                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all active:scale-95 shadow-xl shadow-blue-500/20">
                                        <UserPlus size={18} />
                                        Invite Member
                                    </button>
                                </div>

                                <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-[32px] overflow-hidden">
                                    <div className="p-8 border-b border-neutral-800/50 flex justify-between items-center">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Member List</p>
                                        <div className="flex gap-2">
                                            <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-1 rounded-md font-bold border border-blue-500/20">PRO</span>
                                        </div>
                                    </div>
                                    <div className="p-4 space-y-2">
                                        {/* Simplified Member List UI */}
                                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border border-white/20 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                    {session?.user.name?.charAt(0) || "U"}
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold">{session?.user.name} <span className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded ml-2 uppercase tracking-widest">You</span></p>
                                                    <p className="text-neutral-500 text-xs font-medium">{session?.user.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-1">
                                                        <Shield size={10} /> Owner
                                                    </span>
                                                    <span className="text-neutral-500 text-[10px] font-medium italic mt-0.5">Joined recently</span>
                                                </div>
                                                <button className="p-2 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Invitation Placeholder */}
                                        <div className="flex items-center justify-center py-12 border-2 border-dashed border-neutral-800 rounded-[32px] text-neutral-600 bg-neutral-900/20">
                                            <div className="flex flex-col items-center gap-3">
                                                <Mail size={32} className="opacity-20" />
                                                <p className="text-xs font-bold uppercase tracking-widest text-neutral-700">No Pending Invitations</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "billing" && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-[32px] overflow-hidden">
                                    <div className="p-8 border-b border-neutral-800/50 flex justify-between items-center">
                                        <div>
                                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                                <CreditCard className="text-yellow-500" size={20} />
                                                Plan Overview
                                            </h2>
                                            <p className="text-neutral-500 text-sm mt-1 font-medium">Currently on the <span className="text-white">Pro Trial</span> plan.</p>
                                        </div>
                                        <button className="bg-white text-black px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all active:scale-95 shadow-xl shadow-white/5 hover:bg-neutral-200">
                                            Upgrade Plan
                                        </button>
                                    </div>
                                    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { label: "Storage Used", value: "2.4 GB / 10 GB", percent: 24, color: "bg-blue-500" },
                                            { label: "Project Slots", value: "12 / 50", percent: 24, color: "bg-indigo-500" },
                                            { label: "Collaborators", value: "1 / 5", percent: 20, color: "bg-emerald-500" },
                                        ].map((stat) => (
                                            <div key={stat.label} className="bg-black/20 p-6 rounded-2xl border border-white/5 space-y-4">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{stat.label}</p>
                                                <p className="text-lg font-bold text-white">{stat.value}</p>
                                                <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                                                    <div className={`h-full ${stat.color} transition-all duration-1000`} style={{ width: `${stat.percent}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
