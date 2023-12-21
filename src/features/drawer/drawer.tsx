import { DrawOptions } from "@/utils/drawOptions";
import { ObjectBaseOptions } from "@/utils/baseObjectOptions";
import { generateUUID } from "@/utils/generateUUID";

import { fabric } from "fabric";
import { ReactNode, useEffect, useRef } from "react";

interface DrawerPropTypes {
  fabricInst: fabric.Canvas | null;
  drawOption: DrawOptions;
  children: ReactNode;
  objectAddHandler: () => void;
}

const _FabricCalcArrowAngle = function (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  let angle = 0;
  const x = x2 - x1;
  const y = y2 - y1;
  if (x === 0) {
    angle = y === 0 ? 0 : y > 0 ? Math.PI / 2 : (Math.PI * 3) / 2;
  } else if (y === 0) {
    angle = x > 0 ? 0 : Math.PI;
  } else {
    angle =
      x < 0
        ? Math.atan(y / x) + Math.PI
        : y < 0
        ? Math.atan(y / x) + 2 * Math.PI
        : Math.atan(y / x);
  }
  return (angle * 180) / Math.PI + 90;
};

function Drawer({
  drawOption,
  fabricInst,
  children,
  objectAddHandler,
}: DrawerPropTypes) {
  const top = useRef(0);
  const left = useRef(0);
  const isMouseDown = useRef(false);
  const arrowTriangle = useRef(null);
  const arrowDeltaX = useRef(0);
  const arrowDeltaY = useRef(0);

  // Initialize
  function initializeObject({ e }: fabric.IEvent<MouseEvent>) {
    top.current = e.y;
    left.current = e.x;
    let obj = null;

    switch (drawOption) {
      case DrawOptions.RECTANGLE:
        obj = new fabric.Rect({
          ...ObjectBaseOptions,
          left: e.x,
          top: e.y,
          width: 0,
          height: 0,
        });
        Object.assign(obj, { id: `${generateUUID()}-rectangle` });
        break;

      case DrawOptions.TRIANGLE:
        obj = new fabric.Triangle({
          ...ObjectBaseOptions,
          left: e.x,
          top: e.y,
          width: 0,
          height: 0,
        });
        Object.assign(obj, { id: `${generateUUID()}-triangle` });
        break;

      case DrawOptions.CIRCLE:
        obj = new fabric.Circle({
          ...ObjectBaseOptions,
          left: e.x,
          top: e.y,
          radius: 0,
          originX: "center",
          originY: "center",
        });
        Object.assign(obj, { id: `${generateUUID()}-circle` });
        break;

      case DrawOptions.LINE:
        obj = new fabric.Line([e.x, e.y, e.x, e.y], {
          ...ObjectBaseOptions,
        });
        Object.assign(obj, { id: `${generateUUID()}-line` });
        break;

      default:
        break;
    }

    if (obj) {
      fabricInst?.add(obj);
      fabricInst?.setActiveObject(obj);
      fabricInst?.renderAll();
    }
  }

  function initializeArrow({ e }: fabric.IEvent<MouseEvent>) {
    const points = [e.x, e.y, e.x, e.y];
    const line = new fabric.Line(points, {
      ...ObjectBaseOptions,
      originX: "center",
      originY: "center",
      // type: "arrow",
    });

    const centerX = (line.x1 + line.x2) / 2;
    const centerY = (line.y1 + line.y2) / 2;
    const deltaX = line.left - centerX;
    const deltaY = line.top - centerY;

    const triangle = new fabric.Triangle({
      left: line.get("x1") + deltaX,
      top: line.get("y1") + deltaY,
      originX: "center",
      originY: "center",
      selectable: false,
      // pointType: 'arrow_start',
      angle: -45,
      width: 20,
      height: 20,
      id: "arrow_triangle",
      uuid: line.uuid,
    });
    arrowTriangle.current = triangle;
    arrowDeltaX.current = deltaX;
    arrowDeltaY.current = deltaY;

    fabricInst?.add(line);
    fabricInst?.add(triangle);
    fabricInst?.setActiveObject(line);
    fabricInst?.renderAll();
  }

  // Resize
  function resizeRect({ e }: fabric.IEvent<MouseEvent>) {
    const rect = fabricInst?.getActiveObject();

    if (rect) {
      if (left.current > e.x) {
        rect.set({ left: Math.abs(e.x) });
      }
      if (top.current > e.y) {
        rect.set({ top: Math.abs(e.y) });
      }

      rect.set({ width: Math.abs(left.current - e.x) });
      rect.set({ height: Math.abs(top.current - e.y) });

      rect.setCoords();
      fabricInst?.renderAll();
    }
  }

  function resizeTriangle({ e }: fabric.IEvent<MouseEvent>) {
    const triangle = fabricInst?.getActiveObject();

    if (triangle) {
      triangle.set({ width: Math.abs(left.current - e.x) });
      triangle.set({ height: Math.abs(top.current - e.y) });

      triangle.setCoords();
      fabricInst?.renderAll();
    }
  }

  function resizeCircle({ e }: fabric.IEvent<MouseEvent>) {
    const circle = fabricInst?.getActiveObject();

    if (circle) {
      const a = Math.abs(left.current - e.x);
      const b = Math.abs(top.current - e.y);

      (circle as fabric.Circle).set({
        radius: Math.sqrt(a * a + b * b) / 2,
      });

      circle.setCoords();
      fabricInst?.renderAll();
    }
  }

  function resizeArrow({ e }: fabric.IEvent<MouseEvent>) {
    const line = fabricInst?.getActiveObject();

    if (line) {
      line.set({
        x2: e.x,
        y2: e.y,
      });
      arrowTriangle.current.set({
        left: e.x + arrowDeltaX.current,
        top: e.y + arrowDeltaY.current,
        angle: _FabricCalcArrowAngle(line.x1, line.y1, line.x2, line.y2),
      });

      fabricInst?.renderAll();
    }
  }

  function arrowMouseUpHandler() {
    const group = new fabric.Group(
      [fabricInst?.getActiveObject(), arrowTriangle.current],
      {
        lockScalingFlip: true,
      }
    );
    Object.assign(group, { id: `${generateUUID()}-arrow` });
    fabricInst?.remove(fabricInst?.getActiveObject(), arrowTriangle.current); // removing old object
    fabricInst?.add(group);
    fabricInst?.setActiveObject(group);
    arrowDeltaX.current = 0;
    arrowDeltaY.current = 0;
    arrowTriangle.current = null;
  }

  function resizeLine({ e }: fabric.IEvent<MouseEvent>) {
    const line: fabric.Line = fabricInst?.getActiveObject();

    if (line) {
      line.set({
        x2: e.x,
        y2: e.y,
      });

      line.setCoords();
      fabricInst?.renderAll();
    }
  }

  useEffect(() => {
    if (fabricInst && drawOption !== DrawOptions.NONE) {
      // MouseDown Event Handler
      fabricInst.on("mouse:down", (e: fabric.IEvent<MouseEvent>) => {
        if (fabricInst.getActiveObject()) {
          return;
        }

        isMouseDown.current = true;
        fabricInst.selection = false;

        if (drawOption === DrawOptions.ARROW) initializeArrow(e);
        else initializeObject(e);
      });

      // MouseMove Event Handler
      fabricInst.on("mouse:move", (e: fabric.IEvent<MouseEvent>) => {
        if (isMouseDown.current) {
          switch (drawOption) {
            case DrawOptions.RECTANGLE:
              resizeRect(e);
              break;

            case DrawOptions.TRIANGLE:
              resizeTriangle(e);
              break;

            case DrawOptions.CIRCLE:
              resizeCircle(e);
              break;

            case DrawOptions.ARROW:
              resizeArrow(e);
              break;

            case DrawOptions.LINE:
              resizeLine(e);
              break;

            default:
              break;
          }
        }
      });

      // MouseUp Event Handler
      fabricInst.on("mouse:up", () => {
        if (isMouseDown.current) {
          if (drawOption === DrawOptions.CIRCLE) {
            const circle = fabricInst.getActiveObject();
            const left = (circle as any)?.left - (circle as any).radius;
            const top = (circle as any)?.top - (circle as any).radius;

            circle?.set({
              originX: "left",
              originY: "top",
              left,
              top,
            });
          } else if (drawOption === DrawOptions.ARROW) {
            arrowMouseUpHandler();
          }

          isMouseDown.current = false;
          fabricInst.selection = true;
          objectAddHandler();
        }
      });
    }

    return () => {
      // fabricInst?.off();
      fabricInst?.off("mouse:down");
      fabricInst?.off("mouse:move");
      fabricInst?.off("mouse:up");
    };
  }, [fabricInst, drawOption]);

  return <>{children}</>;
}

export default Drawer;
