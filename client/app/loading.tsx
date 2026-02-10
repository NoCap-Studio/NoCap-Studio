import { Sparkles, Layout } from "lucide-react";

export default function Loading() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] flex flex-col">
            {/* Skeletal Header */}
            <header className="h-20 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-xl flex items-center justify-between px-8">
                <div className="h-9 w-48 bg-neutral-800 animate-pulse rounded-xl" />
                <div className="flex gap-4">
                    <div className="h-9 w-9 bg-neutral-800 animate-pulse rounded-xl" />
                    <div className="h-9 w-32 bg-neutral-800 animate-pulse rounded-xl" />
                </div>
            </header>

            <div className="flex-1 max-w-7xl mx-auto w-full px-8 py-10">
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="h-10 w-64 bg-neutral-900 animate-pulse rounded-xl mb-3" />
                            <div className="h-4 w-48 bg-neutral-900 animate-pulse rounded-lg" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="h-[280px] bg-neutral-900/50 rounded-3xl animate-pulse border border-neutral-800" />
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-[280px] bg-neutral-900/50 rounded-3xl animate-pulse border border-neutral-800" />
                        ))}
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <Layout size={18} className="text-neutral-700" />
                        <div className="h-4 w-24 bg-neutral-900 animate-pulse rounded-lg" />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-24 bg-neutral-900 animate-pulse rounded-2xl border border-neutral-800" />
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
