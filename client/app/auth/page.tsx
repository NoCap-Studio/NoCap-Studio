"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, User, Github } from "lucide-react";

export default function AuthPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            if (isSignUp) {
                await authClient.signUp.email({
                    email,
                    password,
                    name,
                });
            } else {
                await authClient.signIn.email({
                    email,
                    password,
                });
            }
            router.push("/");
        } catch (err: any) {
            setError(err.message || "Authentication failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGithubSignIn = async () => {
        await authClient.signIn.social({
            provider: "github",
        });
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent)]">
            <div className="w-full max-w-md">
                {/* Logo Area */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-2xl flex items-center justify-center text-white mb-6 transform hover:scale-105 transition-transform">
                        <Sparkles size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">
                        NoCap <span className="text-blue-500">Studio</span>
                    </h1>
                    <p className="text-neutral-500 mt-2 font-medium">Design without limits.</p>
                </div>

                {/* Auth Card */}
                <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 shadow-2xl overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />

                    <h2 className="text-xl font-bold text-white mb-6">
                        {isSignUp ? "Create your account" : "Welcome back"}
                    </h2>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl mb-6 font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleAuth} className="space-y-4">
                        {isSignUp && (
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-black tracking-widest text-neutral-500 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                                    <input
                                        required
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Wick"
                                        className="w-full bg-neutral-800/50 border border-neutral-700/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-black tracking-widest text-neutral-500 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="wick@nocap.studio"
                                    className="w-full bg-neutral-800/50 border border-neutral-700/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-black tracking-widest text-neutral-500 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                                <input
                                    required
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-neutral-800/50 border border-neutral-700/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        <button
                            disabled={isLoading}
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] mt-4"
                        >
                            {isLoading ? "Authenticating..." : isSignUp ? "Create Account" : "Sign In"}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-neutral-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#121212] px-2 text-neutral-500 font-bold">Or continue with</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGithubSignIn}
                        className="w-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                        <Github size={20} />
                        GitHub
                    </button>

                    <p className="text-center text-neutral-500 text-xs mt-8 font-medium">
                        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-blue-500 hover:underline font-bold"
                        >
                            {isSignUp ? "Sign In" : "Sign Up"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
