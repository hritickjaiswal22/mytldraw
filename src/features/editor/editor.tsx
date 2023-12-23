import useWindowResize from "@/hooks/useWindowResize";
import NonInteractiveHeader from "@/layouts/header";
import RadioGroup from "@/components/styledRadioGroup";
import Drawer from "@/features/drawer";
import { DrawOptions } from "@/utils/drawOptions";
import { BaseTextOptions } from "@/utils/baseObjectOptions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Dispatcher from "@/features/dispatcher";
import Receiver from "@/features/receiver";
import PanelColumnHeading from "@/components/panelColumnHeading";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";
import {
  Menu,
  Image,
  Trash2,
  MousePointer,
  Square,
  Triangle,
  Circle,
  ArrowRight,
  Minus,
  Edit2,
  Type,
  Bold,
} from "react-feather";
import imageCompression from "browser-image-compression";
import { Label } from "@/components/ui/label";
import {
  STATIC_BACKGROUND_COLORS,
  STATIC_STROKE_COLORS,
  TooltipDelayDuration,
} from "@/utils/miscellaneous";

const PRIMARYPURPLE = "#5b57d1";

function Editor() {
  const [fabricInst, setFabricInst] = useState<fabric.Canvas | null>(null);
  const canvasRef = useRef(null);
  const { windowHeight, windowWidth } = useWindowResize();

  const [drawOption, setDrawOption] = useState(0);
  const [imageBase64Url, setImageBase64Url] = useState<string | null>(null);

  async function onImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    setImageBase64Url(null);
    const imageFile = (e as any).target.files[0];
    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 720,
      useWebWorker: true,
    };

    if (fabricInst) {
      try {
        fabricInst.defaultCursor = "wait";
        const compressedFile = await imageCompression(imageFile, options);
        const reader = new FileReader();

        reader.onload = function (event) {
          setImageBase64Url((event as any).target.result);
          setDrawOption(DrawOptions.IMAGE);
          fabricInst.defaultCursor = "default";
        };

        reader.readAsDataURL(compressedFile);
      } catch (error) {
        fabricInst.defaultCursor = "default";
        console.log(error);
      }
    }
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
    temp.freeDrawingBrush.color = "#000";

    // To load "Virgil" font without installing fontFaceObserver
    const dummyText = new fabric.Text("", {
      ...BaseTextOptions,
      fontSize: 0,
    });
    temp.add(dummyText);
    temp.renderAll();
    temp.remove(dummyText);

    setFabricInst(temp);
  }, []);

  useEffect(() => {
    fabricInst?.setWidth(windowWidth);
    fabricInst?.setHeight(windowHeight);
  }, [windowHeight, windowWidth]);

  useEffect(() => {
    if (fabricInst) {
      if (drawOption === DrawOptions.FREEHAND) fabricInst.isDrawingMode = true;
      else fabricInst.isDrawingMode = false;
    }
  }, [fabricInst, drawOption]);

  function optionHandler(option: number) {
    setDrawOption(option);
  }

  function strokeWidthChangeHandler(option: number) {
    console.log(option);
  }

  return (
    <>
      {/* Header */}
      <NonInteractiveHeader>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="pointer-events-auto w-[36px] h-[36px] rounded-[10px] p-[10px] flex justify-center items-center bg-[#ececf4] hover:bg-[#f1f0ff]"
              variant="outline"
            >
              <Menu width={16} height={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 translate-x-4 border-0 border-none boxShadow">
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex gap-3 font-normal cursor-pointer hover:bg-[#f1f0ff] text-xs">
                <Image width={16} height={16} />
                Export image
              </DropdownMenuItem>
              <DropdownMenuItem className="flex gap-3 font-normal cursor-pointer hover:bg-[#f1f0ff] text-xs">
                <Trash2 width={16} height={16} />
                Reset the canvas
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="pointer-events-none flex items-center gap-1 p-1 rounded bg-white boxShadow">
          <RadioGroup
            onClickHandler={optionHandler}
            options={[
              {
                id: "1",
                content: <MousePointer width={16} height={16} />,
                value: "1",
                tooltipText: "Selection",
              },
              {
                id: "2",
                content: <Square width={16} height={16} />,
                value: "2",
                tooltipText: "Rectangle",
              },
              {
                id: "3",
                content: <Triangle width={16} height={16} />,
                value: "3",
                tooltipText: "Triangle",
              },
              {
                id: "4",
                content: <Circle width={16} height={16} />,
                value: "4",
                tooltipText: "Circle",
              },
              {
                id: "5",
                content: <ArrowRight width={16} height={16} />,
                value: "5",
                tooltipText: "Arrow",
              },
              {
                id: "6",
                content: <Minus width={16} height={16} />,
                value: "6",
                tooltipText: "Line",
              },
              {
                id: "7",
                content: <Edit2 width={16} height={16} />,
                value: "7",
                tooltipText: "Draw",
              },
              {
                id: "8",
                content: <Type width={16} height={16} />,
                value: "8",
                tooltipText: "Text",
              },
            ]}
            drawOption={drawOption}
          />
          <TooltipProvider delayDuration={TooltipDelayDuration}>
            <Tooltip>
              <TooltipTrigger>
                <div className="pointer-events-auto">
                  <input
                    className="hidden"
                    onChange={onImageUpload}
                    type="file"
                    accept="image/png, image/gif, image/jpeg"
                    id="image-upload"
                  />
                  <Label
                    htmlFor="image-upload"
                    className={`base bg-white hover:bg-[#f1f0ff] cursor-pointer ${
                      drawOption === DrawOptions.IMAGE
                        ? "bg-[#bebce5]"
                        : "bg-white"
                    }`}
                  >
                    <Image width={16} height={16} />
                  </Label>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Insert image</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div></div>
      </NonInteractiveHeader>

      {/* Main Canvas */}
      <main>
        <Receiver fabricInst={fabricInst}>
          {/* Dispatcher must be the direct parent of Drawer as it is passing down
          objectAddHandler as props to Drawer */}
          <Dispatcher fabricInst={fabricInst}>
            <Drawer
              drawOption={drawOption}
              fabricInst={fabricInst}
              imageBase64Url={imageBase64Url}
              setImageBase64Url={setImageBase64Url}
            >
              <canvas ref={canvasRef}></canvas>
            </Drawer>
          </Dispatcher>
        </Receiver>
      </main>

      {/* Options Sidebar */}
      <section className="fixed z-50 left-4 top-20 p-2 rounded max-h-[782px] boxShadow">
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
                    >
                      <div
                        className={`absolute top-[-2px] left-[-2px] right-[-2px] bottom-[-2px] rounded hidden`}
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
                    >
                      <div
                        className={`absolute top-[-2px] left-[-2px] right-[-2px] bottom-[-2px] rounded hidden`}
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
            drawOption={0}
          />
        </div>
      </section>
    </>
  );
}

export default Editor;
