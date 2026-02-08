# 🎨 NoCap Studio

**NoCap Studio** is a high-performance, premium web-based canvas editor built for creators. It combines the power of **Fabric.js v7** with a modern, glassmorphism-inspired interface to provide a seamless design experience.

![Premium UI](https://img.shields.io/badge/UI-Premium_Dark-blueviolet)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Fabric.js](https://img.shields.io/badge/Fabric.js-v7-orange)
![Zustand](https://img.shields.io/badge/State-Zustand-blue)

---

## ✨ Features

### 🛠️ Professional Workspace
- **Premium Dark Mode**: A sleek, focused environment with a professional editor grid.
- **Floating Toolbars**: Interaction-focused UI using glassmorphism (`backdrop-blur`) and smooth transitions.
- **Dynamic Viewport**: Context-aware zooming (10% to 500%) relative to the mouse pointer, with a one-click "Reset View" safety button.

### 📜 Creative Tools
- **Rich Shape Library**: Add Rectangles, Circles, Triangles, and Lines with built-in metadata detection.
- **Advanced Text Engine**: Interactive text boxes with customizable fonts (Inter, Arial, etc.) and sizes.
- **Contextual Properties Menu**: A smart menu that appears upon selection to edit colors, sizes, and font properties in real-time.

### 🗂️ Layer Management
- **Layers Panel**: A dedicated sidebar to view, select, and reorder objects.
- **Depth Control**: Easily bring objects forward or send them to the back.
- **Visibility Toggle**: Hide/Show layers instantly without deleting them.

### 🚀 Power User Capabilities
- **Undo/Redo System**: Full history snapshots with keyboard shortcuts (`Ctrl+Z`, `Ctrl+Shift+Z` / `Ctrl+Y`).
- **Full Persistence**: Your designs are automatically saved to `localStorage`. Refresh or close your browser, and your work stays exactly where you left it.
- **High-Res Export**: Download your finished designs as high-resolution PNGs (2x multiplier) with a clean white background.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Canvas Engine**: [Fabric.js v7](http://fabricjs.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/nocap-studio.git
   cd nocap-studio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎹 Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + Z` | Undo |
| `Ctrl + Shift + Z` / `Ctrl + Y` | Redo |
| `Ctrl + +` / `Ctrl + =` | Zoom In |
| `Ctrl + -` | Zoom Out |
| `Mouse Wheel` | Zoom (Relative to Cursor) |

---

## 🏗️ Architecture

- **`client/store/editorStore.ts`**: The central brain of the app. Manages canvas state, history snapshots, zoom levels, and object persistence.
- **`client/components/editor/`**: Contains the modular UI components:
  - `CanvasEditor.tsx`: Core initialization and event handling.
  - `Toolbar.tsx`: Main creation tools.
  - `PropertiesToolbar.tsx`: Contextual attribute editing.
  - `LayersPanel.tsx`: Object management and reordering.

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Developed with ❤️ by the NoCap Team.
