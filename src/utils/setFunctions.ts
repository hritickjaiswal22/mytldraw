import { fabric } from "fabric";

function setStrokeColor(obj: fabric.Object, color: string) {
  console.log(obj);

  if (obj.type === "image") return;

  if ((obj as any)?.id) {
    const arr = (obj as any)?.id.split("-");
    if (Array.isArray(arr) && arr.length && arr[arr.length - 1] === "arrow") {
      return;
    }
  }

  obj.set({
    stroke: color,
  });
  if (obj.type === "i-text")
    obj.set({
      fill: color,
    });
}

export { setStrokeColor };
