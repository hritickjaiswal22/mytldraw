/// <reference types="vite-plugin-svgr/client" />

import PanelColumnHeading from "@/components/panelColumnHeading";
import {
  STATIC_BACKGROUND_COLORS,
  STATIC_STROKE_COLORS,
  getStrokeStyleOption,
} from "@/utils/miscellaneous";
import RadioGroup from "@/components/styledRadioGroup";
import { ObjectPropertiesContext } from "@/contexts/objectProperties";
import { ACTIONS } from "@/utils/actions";
import { socket } from "@/socket";
import {
  setFillColor,
  setOpacity,
  setStrokeColor,
  setStrokeStyle,
} from "@/utils/setFunctions";
import Thin from "@/assets/icons/Thin.svg?react";
import Bold from "@/assets/icons/Bold.svg?react";
import ExtraBold from "@/assets/icons/ExtraBold.svg?react";
import Trash from "@/assets/icons/Delete.svg?react";
import Dashed from "@/assets/icons/Dashed.svg?react";
import Solid from "@/assets/icons/Solid.svg?react";
import SendToBack from "@/assets/icons/SendToBack.svg?react";
import SendBackward from "@/assets/icons/SendBackward.svg?react";
import BringToFront from "@/assets/icons/BringToFront.svg?react";
import BringForward from "@/assets/icons/BringForward.svg?react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

  function opacityChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setObjectProperties((prev) => {
      return {
        ...prev,
        opacity: Number(e.target.value),
      };
    });

    const activeObject = fabricInst?.getActiveObject();

    if (activeObject) {
      socket.emit(ACTIONS["OBJECT:CHANGED"], {
        roomId,
        objectId: (activeObject as any).id,
        payload: Number(e.target.value),
        action: ACTIONS["OPACITY:CHANGED"],
      });

      setOpacity(activeObject, Number(e.target.value));

      fabricInst?.renderAll();
    }
  }

  function sendToBackHandler() {
    if (fabricInst) {
      const activeObject = fabricInst?.getActiveObject();

      if (activeObject) {
        socket.emit(ACTIONS["OBJECT:CHANGED"], {
          roomId,
          objectId: (activeObject as any).id,
          payload: "",
          action: ACTIONS.SENDTOBACK,
        });

        fabricInst.sendToBack(activeObject);

        fabricInst?.renderAll();
      }
    }
  }

  function sendBackwards() {
    if (fabricInst) {
      const activeObject = fabricInst?.getActiveObject();

      if (activeObject) {
        socket.emit(ACTIONS["OBJECT:CHANGED"], {
          roomId,
          objectId: (activeObject as any).id,
          payload: "",
          action: ACTIONS.SENDBACKWARD,
        });

        fabricInst.sendToBack(activeObject);

        fabricInst?.renderAll();
      }
    }
  }

  function bringToFront() {
    if (fabricInst) {
      const activeObject = fabricInst?.getActiveObject();

      if (activeObject) {
        socket.emit(ACTIONS["OBJECT:CHANGED"], {
          roomId,
          objectId: (activeObject as any).id,
          payload: "",
          action: ACTIONS.BRINGTOFRONT,
        });

        fabricInst.bringToFront(activeObject);

        fabricInst?.renderAll();
      }
    }
  }

  function bringForward() {
    if (fabricInst) {
      const activeObject = fabricInst?.getActiveObject();

      if (activeObject) {
        socket.emit(ACTIONS["OBJECT:CHANGED"], {
          roomId,
          objectId: (activeObject as any).id,
          payload: "",
          action: ACTIONS.BRINGFORWARD,
        });

        fabricInst.bringForward(activeObject);

        fabricInst?.renderAll();
      }
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

      <div className="mb-3">
        <PanelColumnHeading>Opacity</PanelColumnHeading>
        <input
          step={0.05}
          onChange={opacityChangeHandler}
          type="range"
          name="opacity"
          min="0"
          max="1"
        />
      </div>

      <div className="mb-3">
        <PanelColumnHeading>Layers</PanelColumnHeading>
        <div className="flex items-center gap-1">
          <div className="flex items-center p-0 py-1 gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <button
                    onClick={sendToBackHandler}
                    className={`base w-[32px] h-[32px] bg-[#f1f0ff]`}
                  >
                    <SendToBack width={16} height={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send to back</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center p-0 py-1 gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <button
                    onClick={sendBackwards}
                    className={`base w-[32px] h-[32px] bg-[#f1f0ff]`}
                  >
                    <SendBackward width={16} height={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send backwards</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center p-0 py-1 gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <button
                    onClick={bringToFront}
                    className={`base w-[32px] h-[32px] bg-[#f1f0ff]`}
                  >
                    <BringToFront width={16} height={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Bring to front</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center p-0 py-1 gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <button
                    onClick={bringForward}
                    className={`base w-[32px] h-[32px] bg-[#f1f0ff]`}
                  >
                    <BringForward width={16} height={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Bring forward</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <PanelColumnHeading>Actions</PanelColumnHeading>
        <div className="flex items-center p-0 py-1 gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <button
                  onClick={deleteSelecedObject}
                  className={`base w-[32px] h-[32px]  bg-[#f1f0ff]`}
                >
                  <Trash width={16} height={16} />
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
