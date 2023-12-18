import { DrawOptions } from "@/utils/drawOptions";
import { ObjectBaseOptions } from "@/utils/baseObjectOptions";

import { fabric } from "fabric";
import { ReactNode, useEffect, useRef } from "react";

interface DrawerPropTypes {
  fabricInst: fabric.Canvas | null;
  drawOption: DrawOptions;
  children: ReactNode;
}

function Drawer({ drawOption, fabricInst, children }: DrawerPropTypes) {
  const top = useRef(0);
  const left = useRef(0);
  const isMouseDown = useRef(false);

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
        break;

      case DrawOptions.TRIANGLE:
        obj = new fabric.Triangle({
          ...ObjectBaseOptions,
          left: e.x,
          top: e.y,
          width: 0,
          height: 0,
        });
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

  useEffect(() => {
    if (fabricInst && drawOption !== DrawOptions.NONE) {
      // MouseDown Event Handler
      fabricInst.on("mouse:down", (e: fabric.IEvent<MouseEvent>) => {
        if (fabricInst.getActiveObject()) {
          return;
        }

        isMouseDown.current = true;
        fabricInst.selection = false;

        initializeObject(e);
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
          }

          isMouseDown.current = false;
          fabricInst.selection = true;
        }
      });
    }

    return () => {
      fabricInst?.off();
    };
  }, [fabricInst, drawOption]);

  return <>{children}</>;
}

export default Drawer;
