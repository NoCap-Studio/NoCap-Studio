import Sidebar from "@/components/editor/Sidebar";
import Topbar from "@/components/editor/Topbar";
import CanvasEditor from "@/components/editor/CanvasEditor";

export default function Home() {
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
