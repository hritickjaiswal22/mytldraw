import React, { useEffect, useRef, useContext } from "react";

import { FabricCanvasContext } from "@/contexts/fabricCanvasContext";
// import { fabric } from "fabric";
import { IEvent } from "fabric/fabric-impl";

function Transformer() {
  const isAltPressed = useRef(false);
  const isPanning = useRef(false);
  const lastPosX = useRef(0);
  const lastPosY = useRef(0);
  const { fabricInst } = useContext(FabricCanvasContext);

  function setAlt(e: KeyboardEvent) {
    if (e.altKey) isAltPressed.current = true;
  }

  function resetAlt() {
    isAltPressed.current = false;
  }

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

  function setPan({ e }: IEvent<MouseEvent>) {
    if (isAltPressed.current && fabricInst) {
      isPanning.current = true;
      lastPosX.current = e.clientX;
      lastPosY.current = e.clientY;
      fabricInst.selection = false;
    }
  }

  function pan({ e }: IEvent<MouseEvent>) {
    if (isPanning.current && fabricInst) {
      const vpt = fabricInst.viewportTransform;
      if (vpt) {
        vpt[4] += e.clientX - lastPosX.current;
        vpt[5] += e.clientY - lastPosY.current;
        fabricInst.requestRenderAll();
        lastPosX.current = e.clientX;
        lastPosY.current = e.clientY;

        fabricInst.setCursor("grabbing");
      }
    }
  }

  function unsetPan() {
    if (fabricInst) {
      fabricInst.setViewportTransform(fabricInst.viewportTransform as any);
      isPanning.current = false;
      fabricInst.selection = true;

      fabricInst.setCursor("auto");
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", setAlt);
    document.addEventListener("keyup", resetAlt);
    // fabricInst?.on("mouse:move", mouseMoveHandler);
    fabricInst?.on("mouse:wheel", zoom);
    fabricInst?.on("mouse:down", setPan);
    fabricInst?.on("mouse:move", pan);
    fabricInst?.on("mouse:up", unsetPan);

    return () => {
      document.removeEventListener("keydown", setAlt);
      document.removeEventListener("keyup", resetAlt);
      fabricInst?.off("mouse:wheel", zoom as any);
      fabricInst?.off("mouse:down", setPan as any);
      fabricInst?.off("mouse:move", pan as any);
      fabricInst?.off("mouse:up", unsetPan);
    };
  }, []);

  console.log(fabricInst);

  return <></>;
}

export default React.memo(Transformer);
