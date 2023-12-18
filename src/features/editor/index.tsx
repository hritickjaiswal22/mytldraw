import useWindowResize from "@/hooks/useWindowResize";
import NonInteractiveHeader from "@/layouts/header";
import RadioGroup from "@/components/styledRadioGroup";
import Drawer from "@/features/drawer";

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
    // For REFRENCE
    // fabric.Object.prototype.transparentCorners = false;
    // fabric.Object.prototype.cornerColor = "white";

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
        <Drawer drawOption={1} fabricInst={fabricInst}>
          <canvas ref={canvasRef}></canvas>
        </Drawer>
      </main>
    </>
  );
}

export default Editor;
