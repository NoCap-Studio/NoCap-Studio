"use client";

import Sidebar from "@/components/editor/Sidebar";
import Topbar from "@/components/editor/Topbar";
import CanvasEditor from "@/components/editor/CanvasEditor";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { useEditorStore } from "@/store/editorStore";

function EditorContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { setCurrentProjectId } = useEditorStore();

  useEffect(() => {
    if (id) {
      setCurrentProjectId(id);
    }
  }, [id, setCurrentProjectId]);

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
