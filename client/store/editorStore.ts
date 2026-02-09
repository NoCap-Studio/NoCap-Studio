import { create } from "zustand";
import { Canvas, Point, FabricObject, PencilBrush } from "fabric";
import { updateProject, getProjectById } from "@/app/actions/projects";
import { createAsset, deleteAsset, getAssets } from "@/app/actions/assets";

// Global Fabric config for custom properties
FabricObject.customProperties = ["data"];

declare module "fabric" {
  interface FabricObject {
    data?: { type: string };
  }
}

interface EditorState {
  canvas: Canvas | null;
  setCanvas: (canvas: Canvas | null) => void;
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
  loadProject: (id: string) => Promise<void>;
  // Selection state
  selectedObjects: any[];
  setSelectedObjects: (objects: any[]) => void;
  // Layers state
  canvasObjects: any[];
  setCanvasObjects: (objects: any[]) => void;
  // Assets state
  assets: any[];
  setAssets: (assets: any[]) => void;
  addAsset: (asset: any) => void;
  removeAsset: (id: string) => void;
  // Actions
  clearCanvas: () => void;
  // Drawing mode
  isDrawingMode: boolean;
  setDrawingMode: (isDrawing: boolean) => void;
  // Cloud Project state
  currentProjectId: string | null;
  setCurrentProjectId: (id: string | null) => void;
}

let saveTimeout: NodeJS.Timeout | null = null;

export const useEditorStore = create<EditorState>((set, get) => ({
  // Cloud Project state
  currentProjectId: null,
  setCurrentProjectId: (id) => set({ currentProjectId: id }),

  canvas: null,
  setCanvas: (canvas) => {
    set({ canvas });
    if (!canvas) return;

    // Load from memory state if available
    const state = get();
    if (state.historyIndex >= 0 && state.history[state.historyIndex]) {
      const json = JSON.parse(state.history[state.historyIndex]);
      canvas.loadFromJSON(json).then(() => {
        // SAFETY CHECK: Only render if this canvas is still the active one in the store
        if (canvas === get().canvas) {
          canvas.renderAll();
          set({ canvasObjects: [...canvas.getObjects()].reverse() });
        }
      });
    } else if (!state.currentProjectId) {
      // If no history AND no cloud project, save the initial empty state
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

  // Assets state
  assets: [],
  setAssets: (assets) => set({ assets }),
  addAsset: (asset) => set((state) => ({ assets: [asset, ...state.assets] })),
  removeAsset: (id) => set((state) => ({ assets: state.assets.filter((a) => a.id !== id) })),

  clearCanvas: () => {
    const { canvas, saveHistory } = get();
    if (!canvas) return;

    canvas.clear();
    canvas.set("backgroundColor", "#ffffff");
    canvas.renderAll();

    set({
      history: [],
      historyIndex: -1,
      canvasObjects: [],
      selectedObjects: [],
    });

    if (typeof window !== "undefined") {
      localStorage.removeItem("nocap-history");
      localStorage.removeItem("nocap-history-index");
    }

    saveHistory();
  },

  // Drawing mode
  isDrawingMode: false,
  setDrawingMode: (isDrawing) => {
    const { canvas } = get();
    if (canvas) {
      if (isDrawing) {
        canvas.discardActiveObject();
        // Ensure brush exists if not already set
        if (!canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush = new PencilBrush(canvas);
        }
        canvas.freeDrawingBrush.width = canvas.freeDrawingBrush.width || 3;
        canvas.freeDrawingBrush.color = canvas.freeDrawingBrush.color || "#000000";
        // Enable smoothing/decimation for touch-screen optimization
        if (canvas.freeDrawingBrush instanceof PencilBrush) {
          canvas.freeDrawingBrush.decimate = 2;
        }
      }
      canvas.isDrawingMode = isDrawing;
      canvas.renderAll();
    }
    set({ isDrawingMode: isDrawing });
  },

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
    // Legacy support disabled. Cloud projects take priority.
  },

  loadProject: async (id) => {
    const project = await getProjectById(id);
    if (!project) return;

    const { canvas } = get();
    const json = project.content;

    set({
      history: [json],
      historyIndex: 0,
      currentProjectId: id,
    });

    if (canvas) {
      canvas.loadFromJSON(JSON.parse(json)).then(() => {
        canvas.renderAll();
        set({ canvasObjects: [...canvas.getObjects()].reverse() });
      });
    }
  },

  saveHistory: () => {
    const { canvas, history, historyIndex, currentProjectId } = get();
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

    // Cloud Sync (Debounced)
    if (currentProjectId) {
      if (saveTimeout) clearTimeout(saveTimeout);
      saveTimeout = setTimeout(async () => {
        try {
          await updateProject(currentProjectId, { content: json });
          console.log("Project saved to cloud.");
        } catch (error) {
          console.error("Cloud save failed:", error);
        }
      }, 2000); // 2 second debounce
    }

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
