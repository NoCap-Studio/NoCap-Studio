"use client";

import { Search, Bell, CreditCard, ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function DashboardHeader() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/");
    };

    const handleSignIn = () => {
        // For now, redirect to a simple signup/login flow
        // In a real app, this would open a modal or navigate to /auth
        authClient.signIn.social({
            provider: "github"
        }).catch(() => {
            // Fallback if github is not configured, just show the intent
            console.log("Redirect to sign in");
        });
    };

    return (
        <header className="h-20 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-50">
            <div className="flex items-center gap-8 flex-1">
                {/* Search Bar */}
                <div className="relative w-full max-w-md group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Credits/Plan */}
                <div className="hidden md:flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg">
                    <CreditCard size={14} className="text-blue-500" />
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Pro Plan</span>
                </div>

                {/* Notifications */}
                <button className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-all relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-neutral-900" />
                </button>

                {/* User Profile / Auth */}
                {isPending ? (
                    <div className="h-9 w-24 bg-neutral-800 animate-pulse rounded-lg" />
                ) : session ? (
                    <div className="flex items-center gap-3 pl-6 border-l border-neutral-800 group relative">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full border border-white/20 shadow-lg flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                            {session.user.image ? (
                                <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                            ) : (
                                session.user.name?.charAt(0).toUpperCase() || "U"
                            )}
                        </div>
                        <div className="hidden sm:flex flex-col">
                            <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                                {session.user.name}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-medium">Personal Workspace</span>
                        </div>

                        {/* Dropdown Menu (Simplified for now) */}
                        <div className="absolute top-full right-0 mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all transform translate-y-2 group-hover:translate-y-0 p-1">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                                <LogOut size={16} />
                                Sign Out
                            </button>
                        </div>
                        <ChevronDown size={14} className="text-neutral-500 group-hover:text-white transition-colors" />
                    </div>
                ) : (
                    <button
                        onClick={() => router.push("/auth")}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20"
                    >
                        Sign In
                    </button>
                )}
            </div>
        </header>
    );
}
