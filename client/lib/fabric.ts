import { Canvas } from "fabric";

export function createCanvas(
  el: HTMLCanvasElement
): Canvas {
  return new Canvas(el, {
    width: 900,
    height: 500,
    backgroundColor: "#ffffff",
    preserveObjectStacking: true,
  });
}
