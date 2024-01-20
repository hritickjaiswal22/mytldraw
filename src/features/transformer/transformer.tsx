import { useEffect, useRef, useContext } from "react";

import { FabricCanvasContext } from "@/contexts/fabricCanvasContext";
// import { fabric } from "fabric";
import { IEvent } from "fabric/fabric-impl";

function Transformer() {
  const isAltPressed = useRef(false);
  const { fabricInst } = useContext(FabricCanvasContext);

  function setAlt(e: KeyboardEvent) {
    if (e.altKey) isAltPressed.current = true;
  }

  function resetAlt() {
    isAltPressed.current = false;
  }

  // function mouseMoveHandler(e: IEvent<MouseEvent>) {
  //   const P = new fabric.Point(e.pointer?.x, e.pointer?.y);
  //   const newP = fabric.util.transformPoint(P, fabricInst?.viewportTransform);

  //   console.log(newP);
  // }

  function zoom(opt: IEvent<WheelEvent>) {
    if (isAltPressed.current) {
      const delta = opt.e.deltaY;
      let zoom = fabricInst?.getZoom();

      if (zoom !== undefined) {
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        fabricInst?.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      }
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", setAlt);
    document.addEventListener("keyup", resetAlt);
    // fabricInst?.on("mouse:move", mouseMoveHandler);
    fabricInst?.on("mouse:wheel", zoom);

    return () => {
      document.removeEventListener("keydown", setAlt);
      document.removeEventListener("keyup", resetAlt);
      fabricInst?.off("mouse:wheel", zoom as any);
    };
  }, []);

  console.log(fabricInst);

  return <></>;
}

export default Transformer;
