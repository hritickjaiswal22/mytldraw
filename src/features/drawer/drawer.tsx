import { DrawOptions, DrawOptionsText } from "@/utils/drawOptions";
import { ObjectBaseOptions, BaseTextOptions } from "@/utils/baseObjectOptions";
import { generateUUID } from "@/utils/miscellaneous";
import { ObjectPropertiesContext } from "@/contexts/objectProperties";
import { TextPropertiesContext } from "@/contexts/textProperties";
import { FabricCanvasContext } from "@/contexts/fabricCanvasContext";

import { fabric } from "fabric";
import { ReactNode, useContext, useEffect, useRef } from "react";

interface DrawerPropTypes {
  drawOption: DrawOptions;
  setDrawOption: React.Dispatch<React.SetStateAction<number>>;
  children: ReactNode;
  objectAddHandler?: () => void;
  imageBase64Url: string | null;
  setImageBase64Url: React.Dispatch<React.SetStateAction<string | null>>;
  keepCurrentDrawOption: boolean;
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
  children,
  objectAddHandler,
  imageBase64Url,
  setImageBase64Url,
  keepCurrentDrawOption,
  setDrawOption,
}: DrawerPropTypes) {
  const top = useRef(0);
  const left = useRef(0);
  const isMouseDown = useRef(false);
  const arrowTriangle = useRef<null | fabric.Triangle>(null);
  const arrowDeltaX = useRef(0);
  const arrowDeltaY = useRef(0);

  const { fabricInst } = useContext(FabricCanvasContext);
  const { objectProperties } = useContext(ObjectPropertiesContext);
  const { textProperties } = useContext(TextPropertiesContext);

  // Initialize
  function initializeObject({ e }: fabric.IEvent<MouseEvent>) {
    const pointer = fabricInst?.getPointer(e);
    top.current = pointer?.y;
    left.current = pointer?.x;
    let obj = null;

    switch (drawOption) {
      case DrawOptions.RECTANGLE:
        obj = new fabric.Rect({
          ...ObjectBaseOptions,
          left: pointer?.x,
          top: pointer?.y,
          width: 0,
          height: 0,
          strokeWidth: objectProperties.strokeWidth,
          stroke: objectProperties.stroke,
          fill: objectProperties.fill,
          strokeDashArray: objectProperties.strokeDashArray,
          opacity: objectProperties.opacity,
        });
        Object.assign(obj, {
          id: `${generateUUID()}-${DrawOptionsText.rectangle}`,
        });
        break;

      case DrawOptions.TRIANGLE:
        obj = new fabric.Triangle({
          ...ObjectBaseOptions,
          left: pointer?.x,
          top: pointer?.y,
          width: 0,
          height: 0,
          strokeWidth: objectProperties.strokeWidth,
          stroke: objectProperties.stroke,
          fill: objectProperties.fill,
          strokeDashArray: objectProperties.strokeDashArray,
          opacity: objectProperties.opacity,
        });
        Object.assign(obj, {
          id: `${generateUUID()}-${DrawOptionsText.triangle}`,
        });
        break;

      case DrawOptions.CIRCLE:
        obj = new fabric.Circle({
          ...ObjectBaseOptions,
          left: pointer?.x,
          top: pointer?.y,
          radius: 0,
          originX: "center",
          originY: "center",
          strokeWidth: objectProperties.strokeWidth,
          stroke: objectProperties.stroke,
          fill: objectProperties.fill,
          strokeDashArray: objectProperties.strokeDashArray,
          opacity: objectProperties.opacity,
        });
        Object.assign(obj, {
          id: `${generateUUID()}-${DrawOptionsText.circle}`,
        });
        break;

      case DrawOptions.LINE:
        obj = new fabric.Line(
          [pointer?.x, pointer?.y, pointer?.x, pointer?.y],
          {
            ...ObjectBaseOptions,
            strokeWidth: objectProperties.strokeWidth,
            stroke: objectProperties.stroke,
            strokeDashArray: objectProperties.strokeDashArray,
            opacity: objectProperties.opacity,
          }
        );
        Object.assign(obj, { id: `${generateUUID()}-${DrawOptionsText.line}` });
        break;

      case DrawOptions.TEXT:
        obj = new fabric.IText("Edit Text", {
          ...BaseTextOptions,
          ...textProperties,
          left: pointer?.x,
          top: pointer?.y,
          fill: objectProperties.stroke,
          opacity: objectProperties.opacity,
        });
        Object.assign(obj, { id: `${generateUUID()}-${DrawOptionsText.text}` });
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
    const pointer = fabricInst?.getPointer(e);
    const points = [pointer?.x, pointer?.y, pointer?.x, pointer?.y];
    const line: any = new fabric.Line(points, {
      ...ObjectBaseOptions,
      originX: "center",
      originY: "center",
      strokeWidth: objectProperties.strokeWidth,
      stroke: objectProperties.stroke,
      strokeDashArray: objectProperties.strokeDashArray,
      opacity: objectProperties.opacity,
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
      stroke: objectProperties.stroke,
      fill: objectProperties.stroke,
      opacity: objectProperties.opacity,
    });
    Object.assign(triangle, { id: "arrow_triangle", uuid: line.uuid });
    arrowTriangle.current = triangle;
    arrowDeltaX.current = deltaX;
    arrowDeltaY.current = deltaY;

    fabricInst?.add(line);
    fabricInst?.add(triangle);
    fabricInst?.setActiveObject(line);
    fabricInst?.renderAll();
  }

  const dropImage = ({ e }: fabric.IEvent<MouseEvent>) => {
    if (imageBase64Url) {
      const imgObj = new Image();
      imgObj.src = imageBase64Url;
      const pointer = fabricInst?.getPointer(e);

      imgObj.onload = () => {
        const image = new fabric.Image(imgObj, {
          angle: 0,
          left: pointer?.x,
          top: pointer?.y,
          opacity: objectProperties.opacity,
        });
        Object.assign(image, {
          id: `${generateUUID()}-${DrawOptionsText.image}`,
        });

        fabricInst?.add(image);
        fabricInst?.setActiveObject(image);
        fabricInst?.renderAll();
        setImageBase64Url(null);
      };
    }
  };

  // Resize
  function resizeRect({ e }: fabric.IEvent<MouseEvent>) {
    const rect = fabricInst?.getActiveObject();
    const pointer = fabricInst?.getPointer(e);

    if (rect) {
      if (left.current > pointer?.x) {
        rect.set({ left: Math.abs(pointer?.x) });
      }
      if (top.current > pointer?.y) {
        rect.set({ top: Math.abs(pointer?.y) });
      }

      rect.set({ width: Math.abs(left.current - pointer?.x) });
      rect.set({ height: Math.abs(top.current - pointer?.y) });

      rect.setCoords();
      fabricInst?.renderAll();
    }
  }

  function resizeTriangle({ e }: fabric.IEvent<MouseEvent>) {
    const triangle = fabricInst?.getActiveObject();
    const pointer = fabricInst?.getPointer(e);

    if (triangle) {
      triangle.set({ width: Math.abs(left.current - pointer?.x) });
      triangle.set({ height: Math.abs(top.current - pointer?.y) });

      triangle.setCoords();
      fabricInst?.renderAll();
    }
  }

  function resizeCircle({ e }: fabric.IEvent<MouseEvent>) {
    const circle = fabricInst?.getActiveObject();
    const pointer = fabricInst?.getPointer(e);

    if (circle) {
      const a = Math.abs(left.current - pointer?.x);
      const b = Math.abs(top.current - pointer?.y);

      (circle as fabric.Circle).set({
        radius: Math.sqrt(a * a + b * b) / 2,
      });

      circle.setCoords();
      fabricInst?.renderAll();
    }
  }

  function resizeArrow({ e }: fabric.IEvent<MouseEvent>) {
    const line: any = fabricInst?.getActiveObject();
    const pointer = fabricInst?.getPointer(e);

    if (line) {
      line.set({
        x2: pointer?.x,
        y2: pointer?.y,
      });
      arrowTriangle?.current?.set({
        left: pointer?.x + arrowDeltaX.current,
        top: pointer?.y + arrowDeltaY.current,
        angle: _FabricCalcArrowAngle(line.x1, line.y1, line.x2, line.y2),
      });

      fabricInst?.renderAll();
    }
  }

  function arrowMouseUpHandler() {
    const group = new fabric.Group(
      [(fabricInst as any)?.getActiveObject(), arrowTriangle.current],
      {
        lockScalingFlip: true,
      }
    );
    Object.assign(group, { id: `${generateUUID()}-${DrawOptionsText.arrow}` });
    fabricInst?.remove(
      (fabricInst as any)?.getActiveObject(),
      (arrowTriangle as any).current
    ); // removing old object
    fabricInst?.add(group);
    fabricInst?.setActiveObject(group);
    arrowDeltaX.current = 0;
    arrowDeltaY.current = 0;
    arrowTriangle.current = null;
  }

  function resizeLine({ e }: fabric.IEvent<MouseEvent>) {
    const line: any = fabricInst?.getActiveObject();
    const pointer = fabricInst?.getPointer(e);

    if (line) {
      line.set({
        x2: pointer?.x,
        y2: pointer?.y,
      });

      line.setCoords();
      fabricInst?.renderAll();
    }
  }

  function mouseDownHandler(e: fabric.IEvent<MouseEvent>) {
    if (fabricInst) {
      if (fabricInst?.getActiveObject()) {
        return;
      }

      isMouseDown.current = true;
      fabricInst.selection = false;

      if (drawOption === DrawOptions.ARROW) initializeArrow(e);
      else if (drawOption === DrawOptions.IMAGE) dropImage(e);
      else initializeObject(e);
    }
  }

  function mouseMoveHandler(e: fabric.IEvent<MouseEvent>) {
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
  }

  function mouseUpHandler() {
    if (isMouseDown.current && fabricInst) {
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
      } else if (drawOption === DrawOptions.FREEHAND) {
        const pathObj = fabricInst._objects[fabricInst._objects.length - 1];

        if (pathObj) {
          Object.assign(pathObj, {
            id: `${generateUUID()}-${DrawOptionsText.freehand}`,
          });
          fabricInst.setActiveObject(pathObj);
        }
      }

      isMouseDown.current = false;
      fabricInst.selection = true;

      if (!keepCurrentDrawOption) setDrawOption(0);

      objectAddHandler();
    }
  }

  useEffect(() => {
    if (fabricInst && drawOption !== DrawOptions.NONE) {
      // MouseDown Event Handler
      fabricInst.on("mouse:down", mouseDownHandler);

      // MouseMove Event Handler
      fabricInst.on("mouse:move", mouseMoveHandler);

      // MouseUp Event Handler
      fabricInst.on("mouse:up", mouseUpHandler);
    }

    return () => {
      // fabricInst?.off();
      fabricInst?.off("mouse:down", mouseDownHandler as any);
      fabricInst?.off("mouse:move", mouseMoveHandler as any);
      fabricInst?.off("mouse:up", mouseUpHandler);
    };
  }, [
    fabricInst,
    drawOption,
    imageBase64Url,
    objectProperties,
    textProperties,
    keepCurrentDrawOption,
  ]);

  return <>{children}</>;
}

export default Drawer;
