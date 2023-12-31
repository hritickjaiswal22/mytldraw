import PanelColumnHeading from "@/components/panelColumnHeading";
import {
  STATIC_BACKGROUND_COLORS,
  STATIC_STROKE_COLORS,
  getFontSizeIndex,
} from "@/utils/miscellaneous";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ObjectPropertiesContext } from "@/contexts/objectProperties";
import { TextPropertiesContext } from "@/contexts/textProperties";
import RadioGroup from "@/components/styledRadioGroup";
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
import Small from "@/assets/icons/SmallFont.svg?react";
import Medium from "@/assets/icons/MediumFont.svg?react";
import Large from "@/assets/icons/Large.svg?react";
import ExtraLarge from "@/assets/icons/ExtraLarge.svg?react";

import { useContext } from "react";

interface SidebarPropTypes {
  fillChangeHandler: any;
  strokeWidthChangeHandler: any;
  strokeColorChangeHandler: any;
  strokeStyleChangeHandler: any;
  opacityChangeHandler: any;
  sendToBackHandler: any;
  sendBackwards: any;
  bringToFront: any;
  bringForward: any;
  deleteSelecedObject: any;
  textSizeChangeHandler: any;
}

function Sidebar({
  bringForward,
  bringToFront,
  deleteSelecedObject,
  fillChangeHandler,
  opacityChangeHandler,
  sendBackwards,
  sendToBackHandler,
  strokeColorChangeHandler,
  strokeStyleChangeHandler,
  strokeWidthChangeHandler,
  textSizeChangeHandler,
}: SidebarPropTypes) {
  const { objectProperties } = useContext(ObjectPropertiesContext);
  const { textProperties } = useContext(TextPropertiesContext);

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
        <PanelColumnHeading>Font size</PanelColumnHeading>
        <RadioGroup
          onClickHandler={textSizeChangeHandler}
          bgColor="bg-[#f1f0ff]"
          options={[
            {
              id: "font-size-1",
              content: <Small width={16} height={16} />,
              value: "font-size-1",
              tooltipText: "Small",
            },
            {
              id: "font-size-2",
              content: <Medium width={16} height={16} />,
              value: "font-size-2",
              tooltipText: "Medium",
            },
            {
              id: "font-size-3",
              content: <Large width={16} height={16} />,
              value: "font-size-3",
              tooltipText: "Large",
            },
            {
              id: "font-size-4",
              content: <ExtraLarge width={16} height={16} />,
              value: "font-size-4",
              tooltipText: "Extra large",
            },
          ]}
          drawOption={getFontSizeIndex(textProperties.fontSize)}
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
