import { LayoutTemplate, Type, Component, Upload } from "lucide-react";
import LayersPanel from "./LayersPanel";

export default function Sidebar() {
  const menuItems = [
    { icon: LayoutTemplate, label: "Templates" },
    { icon: Type, label: "Text" },
    { icon: Component, label: "Elements" },
    { icon: Upload, label: "Uploads" },
  ];

  return (
    <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col h-screen overflow-hidden">
      <div className="p-6 flex flex-col h-full overflow-hidden">
        <h2 className="text-xl font-bold text-white mb-6">Explore</h2>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all text-sm font-medium group"
            >
              <item.icon size={18} className="group-hover:scale-110 transition-transform" />
              {item.label}
            </button>
          ))}
        </nav>

        <LayersPanel />
      </div>
    </aside>
  );
}
