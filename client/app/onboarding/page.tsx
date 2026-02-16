"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Sparkles, Building, Hash, ArrowRight, Loader2, LogOut, Users, Ticket } from "lucide-react";

export default function OnboardingPage() {
    const [mode, setMode] = useState<"create" | "join">("create");
    const [orgName, setOrgName] = useState("");
    const [inviteId, setInviteId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleCreateOrg = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const { data: newOrg, error: createError } = await authClient.organization.create({
                name: orgName,
                slug: orgName.toLowerCase().replace(/\s+/g, '-'),
            });

            if (createError) throw new Error(createError.message);

            if (newOrg) {
                // Ensure the organization is set as active
                await authClient.organization.setActive({
                    organizationId: newOrg.id
                });
                router.push("/");
            }
        } catch (err: any) {
            setError(err.message || "Failed to create organization");
        } finally {
            setIsLoading(false);
        }
    };

    const handleJoinOrg = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const { data: result, error: joinError } = await authClient.organization.acceptInvitation({
                invitationId: inviteId
            });

            if (joinError) throw new Error(joinError.message);

            if (result) {
                // Set active organization if successful
                await authClient.organization.setActive({
                    organizationId: result.invitation.organizationId
                });
                router.push("/");
            }
        } catch (err: any) {
            setError(err.message || "Failed to join organization. Please check your Invite ID.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/auth");
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent)]">
            <div className="w-full max-w-xl">
                {/* Logo Area */}
                <div className="flex flex-col items-center mb-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-2xl flex items-center justify-center text-white mb-6 transform hover:scale-105 transition-transform">
                        <Sparkles size={32} />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight text-center">
                        Your Studio <span className="text-blue-500">Identity</span>
                    </h1>
                    <p className="text-neutral-500 mt-3 font-medium text-center">Set up your workspace or join an existing one.</p>
                </div>

                <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-[32px] p-2 shadow-2xl relative overflow-hidden flex flex-col gap-8">
                    {/* Tab Switcher */}
                    <div className="flex p-1 bg-black/40 rounded-2xl mx-6 mt-6">
                        <button
                            onClick={() => setMode("create")}
                            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${mode === "create" ? "bg-neutral-800 text-white shadow-lg" : "text-neutral-500 hover:text-white"}`}
                        >
                            <Building size={14} />
                            Create New
                        </button>
                        <button
                            onClick={() => setMode("join")}
                            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${mode === "join" ? "bg-neutral-800 text-white shadow-lg" : "text-neutral-500 hover:text-white"}`}
                        >
                            <Ticket size={14} />
                            Join Team
                        </button>
                    </div>

                    <div className="px-8 pb-8">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl mb-6 font-medium">
                                {error}
                            </div>
                        )}

                        {mode === "create" ? (
                            <form onSubmit={handleCreateOrg} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-neutral-500 ml-1">Workspace Name</label>
                                    <div className="relative">
                                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                                        <input
                                            required
                                            type="text"
                                            value={orgName}
                                            onChange={(e) => setOrgName(e.target.value)}
                                            placeholder="NoCap Studio Team"
                                            className="w-full bg-neutral-800/50 border border-neutral-700/50 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={isLoading || !orgName}
                                    type="submit"
                                    className="w-full bg-white hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-600 text-black font-black py-4 rounded-2xl transition-all shadow-xl shadow-white/5 active:scale-[0.98] flex items-center justify-center gap-3"
                                >
                                    {isLoading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            Initialize Studio <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleJoinOrg} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-neutral-500 ml-1">Invitation Link / ID</label>
                                    <div className="relative">
                                        <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                                        <input
                                            required
                                            type="text"
                                            value={inviteId}
                                            onChange={(e) => setInviteId(e.target.value)}
                                            placeholder="Enter invite code..."
                                            className="w-full bg-neutral-800/50 border border-neutral-700/50 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={isLoading || !inviteId}
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-800 disabled:text-neutral-600 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-500/10 active:scale-[0.98] flex items-center justify-center gap-3"
                                >
                                    {isLoading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            Join Workplace <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Ask your team owner for an invite identifier.</p>
                            </form>
                        )}
                    </div>
                </div>

                <div className="mt-12 flex justify-center">
                    <button
                        onClick={handleSignOut}
                        className="text-neutral-500 hover:text-white flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
