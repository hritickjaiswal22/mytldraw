import useWindowResize from "@/hooks/useWindowResize";
import NonInteractiveHeader from "@/layouts/Header";
import { ObjectBaseOptions } from "@/utils/baseObjectOptions";
import { socket } from "@/socket";

import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";

function Editor() {
  const [fabricInst, setFabricInst] = useState<fabric.Canvas | null>(null);
  const canvasRef = useRef(null);
  const { windowHeight, windowWidth } = useWindowResize();

  useEffect(() => {
    const temp = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
    });

    setFabricInst(temp);
  }, []);

  useEffect(() => {
    fabricInst?.setWidth(windowWidth);
    fabricInst?.setHeight(windowHeight);
  }, [windowHeight, windowWidth]);

  useEffect(() => {
    if (fabricInst) {
      const rect = new fabric.Rect({
        ...ObjectBaseOptions,
        top: 0,
        left: 0,
        width: 100,
        height: 100,
      });

      fabricInst.add(rect);
    }
  }, [fabricInst]);

  useEffect(() => {
    if (fabricInst) {
      fabricInst?.on("object:moving", (e) => {
        socket.emit("moving", {
          left: e.target?.left,
          top: e.target?.top,
        });
      });
    }
  }, [fabricInst]);

  useEffect(() => {
    if (fabricInst) {
      socket.on("moving", (val) => {
        fabricInst._objects[0].set({
          left: val.left,
          top: val.top,
        });
        fabricInst._objects[0].setCoords();

        fabricInst.renderAll();
      });
    }
  }, [fabricInst]);

  return (
    <>
      <NonInteractiveHeader>{null}</NonInteractiveHeader>
      <main>
        <canvas ref={canvasRef}></canvas>
      </main>
    </>
  );
}

export default Editor;
