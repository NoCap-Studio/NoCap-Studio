"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Sparkles, Building, Hash, ArrowRight, Loader2, LogOut } from "lucide-react";

export default function OnboardingPage() {
    const [orgName, setOrgName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleCreateOrg = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            await authClient.organization.create({
                name: orgName,
                slug: orgName.toLowerCase().replace(/\s+/g, '-'),
            });
            router.push("/");
        } catch (err: any) {
            setError(err.message || "Failed to create organization");
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
                        Almost <span className="text-blue-500">There</span>
                    </h1>
                    <p className="text-neutral-500 mt-3 font-medium text-center">Every great studio starts with a solid foundation.</p>
                </div>

                <div className="grid md:grid-cols-1 gap-8">
                    {/* Create Org Card */}
                    <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-[32px] p-10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600" />

                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-white mb-2">Create your workspace</h2>
                            <p className="text-neutral-500 text-sm font-medium">This will be the home for your team and projects.</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl mb-6 font-medium">
                                {error}
                            </div>
                        )}

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
                                        Get Started <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>
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
