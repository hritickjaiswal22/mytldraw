import useWindowResize from "@/hooks/useWindowResize";
import NonInteractiveHeader from "@/layouts/Header";

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
