import { create } from "zustand";
import { Canvas, Point, FabricObject } from "fabric";

// Global Fabric config for custom properties
FabricObject.customProperties = ["data"];

declare module "fabric" {
  interface FabricObject {
    data?: { type: string };
  }
}

interface EditorState {
  canvas: Canvas | null;
  setCanvas: (canvas: Canvas) => void;
  // Undo/Redo state
  history: string[];
  historyIndex: number;
  saveHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  // Zoom state
  zoom: number;
  setZoom: (zoom: number) => void;
  resetView: () => void;
  loadFromLocalStorage: () => void;
  // Selection state
  selectedObjects: any[];
  setSelectedObjects: (objects: any[]) => void;
  // Layers state
  canvasObjects: any[];
  setCanvasObjects: (objects: any[]) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  canvas: null,
  setCanvas: (canvas) => {
    set({ canvas });

    // Load from memory state if available
    const state = get();
    if (state.historyIndex >= 0 && state.history[state.historyIndex]) {
      const json = JSON.parse(state.history[state.historyIndex]);
      canvas.loadFromJSON(json).then(() => {
        canvas.renderAll();
        set({ canvasObjects: [...canvas.getObjects()].reverse() });
      });
    } else {
      // If no history, save the initial empty state
      state.saveHistory();
      set({ canvasObjects: [] });
    }
  },

  // Selection state
  selectedObjects: [],
  setSelectedObjects: (objects) => set({ selectedObjects: objects }),

  // Layers state
  canvasObjects: [],
  setCanvasObjects: (objects) => set({ canvasObjects: objects }),

  // Zoom logic
  zoom: 1,
  setZoom: (zoom) => {
    const { canvas } = get();
    if (!canvas) return;

    // Clamp zoom between 0.1 and 5
    const clampedZoom = Math.min(Math.max(zoom, 0.1), 5);

    // Zoom from center
    const center = canvas.getCenterPoint();
    canvas.zoomToPoint(new Point(center.x, center.y), clampedZoom);

    set({ zoom: clampedZoom });
  },

  resetView: () => {
    const { canvas } = get();
    if (!canvas) return;

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    canvas.setZoom(1);
    canvas.renderAll();
    set({ zoom: 1 });
  },

  // Undo/Redo logic
  history: [],
  historyIndex: -1,

  loadFromLocalStorage: () => {
    if (typeof window === "undefined") return;
    try {
      const history = JSON.parse(localStorage.getItem("nocap-history") || "[]");
      const historyIndex = parseInt(localStorage.getItem("nocap-history-index") || "-1");
      set({ history, historyIndex });
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
    }
  },

  saveHistory: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas) return;

    // Fabric.js 7: toJSON() no longer accepts arguments. 
    // We use toObject(['data']) to include our custom line metadata.
    const json = JSON.stringify(canvas.toObject(['data']));

    const newHistory = history.slice(0, historyIndex + 1);

    if (newHistory.length > 0 && newHistory[newHistory.length - 1] === json) {
      return;
    }

    const updatedHistory = [...newHistory, json];
    const updatedIndex = updatedHistory.length - 1;

    set({
      history: updatedHistory,
      historyIndex: updatedIndex,
    });

    // Persist to local storage
    if (typeof window !== "undefined") {
      localStorage.setItem("nocap-history", JSON.stringify(updatedHistory));
      localStorage.setItem("nocap-history-index", updatedIndex.toString());
    }
  },

  undo: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas || historyIndex <= 0) return;

    const newIndex = historyIndex - 1;
    const json = JSON.parse(history[newIndex]);

    canvas.loadFromJSON(json).then(() => {
      canvas.renderAll();
      set({ historyIndex: newIndex });
      localStorage.setItem("nocap-history-index", newIndex.toString());
    });
  },

  redo: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas || historyIndex >= history.length - 1) return;

    const newIndex = historyIndex + 1;
    const json = JSON.parse(history[newIndex]);

    canvas.loadFromJSON(json).then(() => {
      canvas.renderAll();
      set({ historyIndex: newIndex });
      localStorage.setItem("nocap-history-index", newIndex.toString());
    });
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,
}));
