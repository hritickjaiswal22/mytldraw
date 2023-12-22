import useWindowResize from "@/hooks/useWindowResize";
import NonInteractiveHeader from "@/layouts/header";
import RadioGroup from "@/components/styledRadioGroup";
import Drawer from "@/features/drawer";
import { socket } from "@/socket";

import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";
import { Circle } from "react-feather";
import { DrawOptions } from "@/utils/drawOptions";

const PRIMARYPURPLE = "#5b57d1";

function Editor() {
  const [fabricInst, setFabricInst] = useState<fabric.Canvas | null>(null);
  const canvasRef = useRef(null);
  const { windowHeight, windowWidth } = useWindowResize();

  const [drawOption, setDrawOption] = useState(0);

  function objectAddHandler() {
    // const obj = fabricInst?.getActiveObject();

    socket.emit(
      "objet:added",
      JSON.stringify(fabricInst?.toDatalessJSON(["id"]))
    );
  }

  useEffect(() => {
    const temp = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
    });
    fabric.Object.prototype.cornerStyle = "circle";
    fabric.Object.prototype.cornerSize = 8;
    fabric.Object.prototype.cornerStrokeColor = PRIMARYPURPLE;
    fabric.Object.prototype.cornerColor = "white";
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.borderColor = PRIMARYPURPLE;
    fabric.Object.prototype.padding = 4;

    temp.freeDrawingBrush.width = 5;
    temp.freeDrawingBrush.color = PRIMARYPURPLE;

    setFabricInst(temp);
  }, []);

  useEffect(() => {
    fabricInst?.setWidth(windowWidth);
    fabricInst?.setHeight(windowHeight);
  }, [windowHeight, windowWidth]);

  useEffect(() => {
    if (fabricInst) {
      socket.on("objet:added", (str) => {
        fabricInst.loadFromJSON(str, () => {
          fabricInst.renderAll();
        });
      });
    }
  }, [fabricInst]);

  useEffect(() => {
    if (fabricInst) {
      fabricInst.on("object:moving", (e: fabric.IEvent<MouseEvent>) => {
        const json = e.target?.toJSON(["id"]);

        socket.emit("moving", json);
      });
    }
  }, [fabricInst]);

  useEffect(() => {
    if (fabricInst) {
      socket.on("moving", (json) => {
        const id = json.id;
        const object = fabricInst._objects.find((obj) => obj.id === id);

        if (object) {
          object.set({
            left: json.left,
            top: json.top,
          });

          object.setCoords();
          fabricInst.renderAll();
        }
      });
    }
  }, [fabricInst]);

  useEffect(() => {
    if (fabricInst) {
      if (drawOption === DrawOptions.FREEHAND) fabricInst.isDrawingMode = true;
      else fabricInst.isDrawingMode = false;
    }
  }, [fabricInst, drawOption]);

  function testHandler(arg) {
    setDrawOption(arg);
  }

  return (
    <>
      <NonInteractiveHeader>
        <RadioGroup
          onClickHandler={testHandler}
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
            {
              id: "4",
              content: <Circle width={10} height={10} />,
              value: "4",
            },
            {
              id: "5",
              content: <Circle width={10} height={10} />,
              value: "5",
            },
            {
              id: "6",
              content: <Circle width={10} height={10} />,
              value: "6",
            },
            {
              id: "7",
              content: <Circle width={10} height={10} />,
              value: "7",
            },
          ]}
        />
      </NonInteractiveHeader>
      <main>
        <Drawer
          objectAddHandler={objectAddHandler}
          drawOption={drawOption}
          fabricInst={fabricInst}
        >
          <canvas ref={canvasRef}></canvas>
        </Drawer>
      </main>
    </>
  );
}

export default Editor;
