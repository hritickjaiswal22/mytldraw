/// <reference types="vite-plugin-svgr/client" />

import { ObjectPropertiesContext } from "@/contexts/objectProperties";
import { FabricCanvasContext } from "@/contexts/fabricCanvasContext";
import { socket } from "@/socket";
import { ACTIONS } from "@/utils/actions";
import { getStrokeStyleOption } from "@/utils/miscellaneous";
import PanelColumnHeading from "@/components/panelColumnHeading";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { STATIC_STROKE_COLORS } from "@/utils/miscellaneous";
import RadioGroup from "@/components/styledRadioGroup";
import { setStrokeColor, setStrokeStyle } from "@/utils/setFunctions";
// Assests
import Thin from "@/assets/icons/Thin.svg?react";
import Bold from "@/assets/icons/Bold.svg?react";
import ExtraBold from "@/assets/icons/ExtraBold.svg?react";
import Dashed from "@/assets/icons/Dashed.svg?react";
import Solid from "@/assets/icons/Solid.svg?react";

import { useContext } from "react";
import { useParams } from "react-router-dom";

function StrokeControls() {
  const { setObjectProperties, objectProperties } = useContext(
    ObjectPropertiesContext
  );
  const { fabricInst } = useContext(FabricCanvasContext);
  const { roomId } = useParams();

  function strokeWidthChangeHandler(option: number) {
    setObjectProperties((prev) => {
      return {
        ...prev,
        strokeWidth: option,
      };
    });

    const activeObject = fabricInst?.getActiveObject();

    if (activeObject) {
      socket.emit(ACTIONS["OBJECT:CHANGED"], {
        roomId,
        objectId: (activeObject as any).id,
        payload: option,
        action: ACTIONS["STOKEWIDTH:CHANGED"],
      });
      activeObject.set({
        strokeWidth: option,
      });
      fabricInst?.renderAll();
    }
  }

  function strokeColorChangeHandler(color: string) {
    setObjectProperties((prev) => {
      return {
        ...prev,
        stroke: color,
      };
    });
    if (
      fabricInst &&
      fabricInst.freeDrawingBrush &&
      fabricInst.freeDrawingBrush.color
    )
      fabricInst!.freeDrawingBrush!.color = color;

    const activeObject = fabricInst?.getActiveObject();

    if (activeObject) {
      socket.emit(ACTIONS["OBJECT:CHANGED"], {
        roomId,
        objectId: (activeObject as any).id,
        payload: color,
        action: ACTIONS["STOKE:CHANGED"],
      });

      setStrokeColor(activeObject, color);

      fabricInst?.renderAll();
    }
  }

  function strokeStyleChangeHandler(option: number) {
    setObjectProperties((prev) => {
      return {
        ...prev,
        strokeDashArray: getStrokeStyleOption(option),
      };
    });

    const activeObject = fabricInst?.getActiveObject();

    if (activeObject) {
      socket.emit(ACTIONS["OBJECT:CHANGED"], {
        roomId,
        objectId: (activeObject as any).id,
        payload: getStrokeStyleOption(option),
        action: ACTIONS["STROKESTYLE:CHANGED"],
      });
      setStrokeStyle(activeObject, getStrokeStyleOption(option));
      fabricInst?.renderAll();
    }
  }

  return (
    <>
      <div className="mb-3">
        <PanelColumnHeading>Stroke</PanelColumnHeading>
        <div className="flex items-center p-0 py-1 gap-2">
          {STATIC_STROKE_COLORS.map((color, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger>
                  <button
                    key={index}
                    className={`base w-[22px] h-[22px] rounded relative`}
                    style={{ backgroundColor: color }}
                    onClick={() => strokeColorChangeHandler(color)}
                  >
                    <div
                      className={`absolute top-[-2px] left-[-2px] right-[-2px] bottom-[-2px] rounded ${
                        objectProperties.stroke === color ? "block" : "hidden"
                      }`}
                      style={{
                        boxShadow: "0 0 0 1px #4a47b1",
                      }}
                    ></div>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{color}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
          <label
            htmlFor="stroke-color-picker"
            className="base cursor-pointer w-[26px] h-[26px] rounded bg-black"
          >
            <input className="hidden" id="stroke-color-picker" type="color" />
          </label>
        </div>
      </div>

      <div className="mb-3">
        <PanelColumnHeading>Stroke width</PanelColumnHeading>
        <RadioGroup
          onClickHandler={strokeWidthChangeHandler}
          bgColor="bg-[#f1f0ff]"
          options={[
            {
              id: "stroke-width-1",
              content: <Thin width={16} height={16} />,
              value: "stroke-width-1",
              tooltipText: "Thin",
            },
            {
              id: "stroke-width-2",
              content: <Bold width={16} height={16} />,
              value: "stroke-width-2",
              tooltipText: "Bold",
            },
            {
              id: "stroke-width-3",
              content: <ExtraBold width={16} height={16} />,
              value: "stroke-width-3",
              tooltipText: "Extra bold",
            },
          ]}
          drawOption={objectProperties.strokeWidth}
        />
      </div>

      <div className="mb-3">
        <PanelColumnHeading>Stroke Style</PanelColumnHeading>
        <RadioGroup
          onClickHandler={strokeStyleChangeHandler}
          bgColor="bg-[#f1f0ff]"
          options={[
            {
              id: "stroke-style-1",
              content: <Solid width={16} height={16} />,
              value: "stroke-style-1",
              tooltipText: "Solid",
            },
            {
              id: "stroke-style-2",
              content: <Dashed width={16} height={16} />,
              value: "stroke-style-2",
              tooltipText: "Dashed",
            },
          ]}
          drawOption={objectProperties.strokeDashArray ? 1 : 0}
        />
      </div>
    </>
  );
}

export default StrokeControls;
