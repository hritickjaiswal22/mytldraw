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
    fabric.Object.prototype.cornerStyle = "circle";
    fabric.Object.prototype.cornerSize = 8;
    fabric.Object.prototype.cornerStrokeColor = "#5b57d1";
    fabric.Object.prototype.cornerColor = "white";
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.borderColor = "#5b57d1";
    fabric.Object.prototype.padding = 4;

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
