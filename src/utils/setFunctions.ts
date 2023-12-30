import { fabric } from "fabric";

function setStrokeColor(obj: fabric.Object, color: string) {
  if (obj.type === "image") return;

  if ((obj as any)?.id) {
    const arr = (obj as any)?.id.split("-");
    if (Array.isArray(arr) && arr.length && arr[arr.length - 1] === "arrow") {
      (obj as fabric.Group)._objects.forEach((obj) => {
        obj.set({
          fill: color,
          stroke: color,
        });
      });
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

function setFillColor(obj: fabric.Object, color: string) {
  if (obj.type === "image" || obj.type === "line") return;

  if ((obj as any)?.id) {
    const arr = (obj as any)?.id.split("-");
    if (Array.isArray(arr) && arr.length && arr[arr.length - 1] === "arrow") {
      (obj as fabric.Group)._objects.forEach((obj) => {
        obj.set({
          fill: color,
          stroke: color,
        });
      });
      return;
    }
  }

  obj.set({
    fill: color,
  });
  if (obj.type === "i-text")
    obj.set({
      fill: color,
    });
}

function setStrokeStyle(obj: fabric.Object, style: undefined | number[]) {
  if (obj.type === "image" || obj.type === "i-text") return;

  if ((obj as any)?.id) {
    const arr = (obj as any)?.id.split("-");

    if (Array.isArray(arr) && arr.length && arr[arr.length - 1] === "arrow") {
      (obj as fabric.Group)._objects[0].set({
        strokeDashArray: style,
      });
      return;
    }
  }

  obj.set({
    strokeDashArray: style,
  });
}

function setOpacity(obj: fabric.Object, opacity: number) {
  obj.set({
    opacity,
  });
}

export { setStrokeColor, setFillColor, setStrokeStyle, setOpacity };
