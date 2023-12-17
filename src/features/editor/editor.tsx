import useWindowResize from "@/hooks/useWindowResize";
import NonInteractiveHeader from "@/layouts/Header";
import RadioGroup from "@/components/styled-radio-group";

import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";
import { Circle } from "react-feather";

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
      <NonInteractiveHeader>
        <RadioGroup
          options={[
            {
              id: "1",
              content: <Circle width={10} height={10} />,
              value: "1",
            },
            {
              id: "2",
              content: <Circle width={10} height={10} />,
              value: "2",
            },
            {
              id: "3",
              content: <Circle width={10} height={10} />,
              value: "3",
            },
          ]}
        />
      </NonInteractiveHeader>
      <main>
        <canvas ref={canvasRef}></canvas>
      </main>
    </>
  );
}

export default Editor;
