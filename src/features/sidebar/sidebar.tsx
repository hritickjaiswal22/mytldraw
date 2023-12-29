import PanelColumnHeading from "@/components/panelColumnHeading";
import {
  STATIC_BACKGROUND_COLORS,
  STATIC_STROKE_COLORS,
} from "@/utils/miscellaneous";
import RadioGroup from "@/components/styledRadioGroup";
import { ObjectPropertiesContext } from "@/contexts/objectProperties";
import { ACTIONS } from "@/utils/actions";
import { socket } from "@/socket";
import { setFillColor, setStrokeColor } from "@/utils/setFunctions";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Bold, Trash2 } from "react-feather";
import { useContext } from "react";
import { fabric } from "fabric";
import { useParams } from "react-router-dom";

interface SidebarPropTypes {
  fabricInst: fabric.Canvas;
}

function Sidebar({ fabricInst }: SidebarPropTypes) {
  const { objectProperties, setObjectProperties } = useContext(
    ObjectPropertiesContext
  );
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

  function deleteSelecedObject() {
    if (fabricInst) {
      const activeObject = fabricInst?.getActiveObject();

      if (activeObject) {
        fabricInst.remove(activeObject);
      }
    }
  }

  return (
    <section className="fixed z-50 bg-white left-4 top-20 p-2 rounded max-h-[782px] boxShadow">
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

      <div className="mb-3">
        <PanelColumnHeading>Stroke width</PanelColumnHeading>
        <RadioGroup
          onClickHandler={strokeWidthChangeHandler}
          bgColor="bg-[#f1f0ff]"
          options={[
            {
              id: "stroke-width-1",
              content: <Bold width={16} height={16} />,
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
              content: <Bold width={16} height={16} />,
              value: "stroke-width-3",
              tooltipText: "Extra bold",
            },
          ]}
          drawOption={objectProperties.strokeWidth}
        />
      </div>

      <div className="mb-3">
        <PanelColumnHeading>Actions</PanelColumnHeading>
        <div className="flex items-center p-0 py-1 gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <button
                  onClick={deleteSelecedObject}
                  className={`base w-[22px] h-[22px] rounded`}
                >
                  <Trash2 width={16} height={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </section>
  );
}

export default Sidebar;
