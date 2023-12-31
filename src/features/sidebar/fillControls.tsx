/// <reference types="vite-plugin-svgr/client" />

import { ObjectPropertiesContext } from "@/contexts/objectProperties";
import { FabricCanvasContext } from "@/contexts/fabricCanvasContext";
import { socket } from "@/socket";
import { ACTIONS } from "@/utils/actions";
import PanelColumnHeading from "@/components/panelColumnHeading";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { STATIC_BACKGROUND_COLORS } from "@/utils/miscellaneous";
import { setFillColor } from "@/utils/setFunctions";

import { useContext } from "react";
import { useParams } from "react-router-dom";

function FillControls() {
  const { setObjectProperties, objectProperties } = useContext(
    ObjectPropertiesContext
  );
  const { fabricInst } = useContext(FabricCanvasContext);
  const { roomId } = useParams();

  function fillChangeHandler(color: string) {
    setObjectProperties((prev) => {
      return {
        ...prev,
        fill: color,
      };
    });

    const activeObject = fabricInst?.getActiveObject();

    if (activeObject) {
      socket.emit(ACTIONS["OBJECT:CHANGED"], {
        roomId,
        objectId: (activeObject as any).id,
        payload: color,
        action: ACTIONS["FILL:CHANGED"],
      });

      setFillColor(activeObject, color);

      fabricInst?.renderAll();
    }
  }

  return (
    <>
      <div className="mb-3">
        <PanelColumnHeading>Background</PanelColumnHeading>
        <div className="flex items-center p-0 py-1 gap-2">
          {STATIC_BACKGROUND_COLORS.map((color, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger>
                  <button
                    key={index}
                    className={`base w-[22px] h-[22px] rounded relative`}
                    style={{ backgroundColor: color }}
                    onClick={() => fillChangeHandler(color)}
                  >
                    <div
                      className={`absolute top-[-2px] left-[-2px] right-[-2px] bottom-[-2px] rounded ${
                        objectProperties.fill === color ? "block" : "hidden"
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
    </>
  );
}

export default FillControls;
