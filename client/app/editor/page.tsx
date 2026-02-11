"use client";

import Sidebar from "@/components/editor/Sidebar";
import Topbar from "@/components/editor/Topbar";
import CanvasEditor from "@/components/editor/CanvasEditor";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { useEditorStore } from "@/store/editorStore";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

function EditorContent() {
  const { data: session, isPending } = authClient.useSession();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { setCurrentProjectId } = useEditorStore();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth");
      return;
    }

    if (session && !session.session.activeOrganizationId) {
      router.push("/onboarding");
      return;
    }

    if (id) {
      setCurrentProjectId(id);
    }
  }, [id, setCurrentProjectId, session, isPending, router]);

  if (isPending) {
    return <div className="h-screen w-screen bg-[#0a0a0a] flex items-center justify-center text-white font-bold text-xs uppercase tracking-widest">Verifying Session...</div>;
  }

  if (!session) return null;

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <CanvasEditor />
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-[#0a0a0a] flex items-center justify-center text-white">Loading Editor...</div>}>
      <EditorContent />
    </Suspense>
  );
}
