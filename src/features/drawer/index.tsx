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

  function initializeRect({ e }: fabric.IEvent<MouseEvent>) {
    top.current = e.y;
    left.current = e.x;

    const rect = new fabric.Rect({
      ...ObjectBaseOptions,
      left: e.x,
      top: e.y,
      width: 0,
      height: 0,
    });

    fabricInst?.add(rect);
    fabricInst?.setActiveObject(rect);
    fabricInst?.renderAll();
  }

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

  useEffect(() => {
    if (fabricInst && drawOption !== DrawOptions.NONE) {
      // MouseDown Event Handler
      fabricInst.on("mouse:down", (e: fabric.IEvent<MouseEvent>) => {
        if (fabricInst.getActiveObject()) {
          return;
        }

        isMouseDown.current = true;

        switch (drawOption) {
          case DrawOptions.RECTANGLE:
            initializeRect(e);
            break;

          default:
            break;
        }
      });

      // MouseMove Event Handler
      fabricInst.on("mouse:move", (e: fabric.IEvent<MouseEvent>) => {
        if (isMouseDown.current) {
          switch (drawOption) {
            case DrawOptions.RECTANGLE:
              resizeRect(e);
              break;

            default:
              break;
          }
        }
      });

      // MouseUp Event Handler
      fabricInst.on("mouse:up", () => {
        isMouseDown.current = false;
      });
    }
  }, [fabricInst, drawOption]);

  return <>{children}</>;
}

export default Drawer;
