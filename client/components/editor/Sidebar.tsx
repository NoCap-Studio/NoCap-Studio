"use client"

import { LayoutTemplate, Type, Component, Upload, Layers } from "lucide-react";
import LayersPanel from "./LayersPanel";
import UploadsPanel from "./UploadsPanel";
import { useState } from "react";

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState("Layers");

  const menuItems = [
    { icon: Layers, label: "Layers" },
    { icon: Upload, label: "Uploads" },
    { icon: LayoutTemplate, label: "Templates" },
    { icon: Type, label: "Text" },
    { icon: Component, label: "Elements" },
  ];

  return (
    <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col h-screen overflow-hidden">
      <div className="p-6 flex flex-col h-full overflow-hidden">
        <h2 className="text-xl font-bold text-white mb-6">Explore</h2>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium group ${activeTab === item.label
                ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800 border border-transparent"
                }`}
            >
              <item.icon size={18} className={`transition-transform ${activeTab === item.label ? "scale-110" : "group-hover:scale-110"}`} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {activeTab === "Layers" && <LayersPanel />}
          {activeTab === "Uploads" && <UploadsPanel />}

          {(activeTab === "Templates" || activeTab === "Text" || activeTab === "Elements") && (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-neutral-600 text-center px-4 border-t border-neutral-800 mt-6 pt-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">{activeTab}</h3>
              <p className="text-[11px] font-medium leading-tight opacity-40">Coming soon in the next update!</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
