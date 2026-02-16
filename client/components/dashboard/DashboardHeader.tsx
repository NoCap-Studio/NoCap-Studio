"use client";

import { Search, Bell, CreditCard, ChevronDown, LogOut, User as UserIcon, Users, Settings, Sparkles } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function DashboardHeader() {
    const { data: session, isPending } = authClient.useSession();
    const { data: activeOrg } = authClient.useActiveOrganization();
    const router = useRouter();

    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/auth");
    };

    const handleSignIn = () => {
        router.push("/auth");
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
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full border border-white/20 shadow-lg flex items-center justify-center text-white font-bold text-sm overflow-hidden active:scale-95 transition-transform">
                            {session.user.image ? (
                                <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                            ) : (
                                session.user.name?.charAt(0).toUpperCase() || "U"
                            )}
                        </div>
                        <div className="hidden sm:flex flex-col">
                            <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors max-w-[120px] truncate">
                                {session.user.name}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-medium max-w-[120px] truncate">
                                {activeOrg?.name || "No Workplace"}
                            </span>
                        </div>

                        {/* Dropdown Menu (Premium UI) */}
                        <div className="absolute top-full right-0 mt-3 w-64 bg-neutral-900/90 backdrop-blur-2xl border border-neutral-800 rounded-[24px] shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 p-2 z-[60] before:content-[''] before:absolute before:-top-3 before:left-0 before:w-full before:h-3">
                            {/* User Header Insight */}
                            <div className="px-4 py-3 mb-2 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-1">Active Session</p>
                                <p className="text-xs font-bold text-white truncate">{session.user.email}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="px-3 pt-2 pb-1 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-600">Workplace</p>
                                <button className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold text-neutral-300 hover:text-white hover:bg-white/5 rounded-xl transition-all group/item">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover/item:scale-110 transition-transform">
                                            <Users size={16} />
                                        </div>
                                        <span>Manage Team</span>
                                    </div>
                                    <ChevronDown size={14} className="-rotate-90 opacity-0 group-hover/item:opacity-100 transition-all" />
                                </button>
                                <button
                                    onClick={() => router.push("/settings/workspace")}
                                    className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold text-neutral-300 hover:text-white hover:bg-white/5 rounded-xl transition-all group/item"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover/item:scale-110 transition-transform">
                                            <Settings size={16} />
                                        </div>
                                        <span>Workspace Settings</span>
                                    </div>
                                    <ChevronDown size={14} className="-rotate-90 opacity-0 group-hover/item:opacity-100 transition-all" />
                                </button>
                            </div>

                            <div className="my-2 border-t border-neutral-800/50" />

                            <div className="space-y-1">
                                <p className="px-3 pt-2 pb-1 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-600">Account</p>
                                <button className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold text-neutral-300 hover:text-white hover:bg-white/5 rounded-xl transition-all group/item">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover/item:scale-110 transition-transform">
                                            <UserIcon size={16} />
                                        </div>
                                        <span>Personal Profile</span>
                                    </div>
                                </button>
                                <button className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold text-neutral-300 hover:text-white hover:bg-white/5 rounded-xl transition-all group/item">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500 group-hover/item:scale-110 transition-transform">
                                            <Sparkles size={16} />
                                        </div>
                                        <span>Subscription Plan</span>
                                    </div>
                                </button>
                            </div>

                            <div className="mt-4 pt-1">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-3 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-colors active:scale-[0.98]"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                                        <LogOut size={16} />
                                    </div>
                                    Sign Out from Studio
                                </button>
                            </div>
                        </div>
                        <ChevronDown size={14} className="ml-1 text-neutral-500 group-hover:text-white transition-colors group-hover:rotate-180 duration-300" />
                    </div>
                ) : (
                    <button
                        onClick={() => router.push("/auth")}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                        Sign In
                    </button>
                )}
            </div>
        </header>
    );
}
