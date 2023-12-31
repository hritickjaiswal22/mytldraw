/// <reference types="vite-plugin-svgr/client" />

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { socket } from "@/socket";
import { ACTIONS } from "@/utils/actions";
import { Label } from "@/components/ui/label";
import {
  FONT_SIZE_OPTIONS,
  STATIC_BACKGROUND_COLORS,
  STATIC_STROKE_COLORS,
  TooltipDelayDuration,
  getFontSize,
} from "@/utils/miscellaneous";
// Contexts
import { ObjectPropertiesContext } from "@/contexts/objectProperties";
import { TextPropertiesContext } from "@/contexts/textProperties";
import { FabricCanvasContext } from "@/contexts/fabricCanvasContext";
import OptionsSidebar from "@/features/sidebar";
import Menu from "@/assets/icons/Hamburger.svg?react";
import Image from "@/assets/icons/Image.svg?react";
import Trash from "@/assets/icons/Delete.svg?react";
import MousePointer from "@/assets/icons/Pointer.svg?react";
import Square from "@/assets/icons/Rect.svg?react";
import Triangle from "@/assets/icons/Triangle.svg?react";
import Circle from "@/assets/icons/Circle.svg?react";
import Arrow from "@/assets/icons/Arrow.svg?react";
import Line from "@/assets/icons/Line.svg?react";
import Pen from "@/assets/icons/Pen.svg?react";
import Text from "@/assets/icons/Text.svg?react";

import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const PRIMARYPURPLE = "#5b57d1";

interface ActiveUserType {
  username: string;
  socketId: string;
}

function Editor() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [fabricInst, setFabricInst] = useState<fabric.Canvas | null>(null);
  const canvasRef = useRef(null);
  const { windowHeight, windowWidth } = useWindowResize();
  const [activeUsers, setActiveUsers] = useState<Array<ActiveUserType>>([]);

  const [drawOption, setDrawOption] = useState(0);
  const [imageBase64Url, setImageBase64Url] = useState<string | null>(null);

  const [objectProperties, setObjectProperties] = useState({
    strokeWidth: 2,
    stroke: STATIC_STROKE_COLORS[0],
    fill: STATIC_BACKGROUND_COLORS[0],
    strokeDashArray: undefined,
    opacity: 1,
  });
  const [textProperties, setTextProperties] = useState({
    fontSize: getFontSize(FONT_SIZE_OPTIONS.MEDIUM),
  });

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
    function initConnection() {
      socket.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socket.on(ACTIONS.NEWUSERJOINED, ({ clients, username }) => {
        console.log(`User ${username} joined`);

        setActiveUsers(clients);
      });

      socket.on(ACTIONS.DISCONNECTED, ({ username, socketId }) => {
        console.log(`User ${username} left`);
        setActiveUsers((prev) =>
          prev.filter((activeUser) => activeUser.socketId !== socketId)
        );
      });
    }

    if (location.state && location.state?.username) initConnection();
    else navigate("/");

    return () => {
      socket.off(ACTIONS.NEWUSERJOINED);
      socket.off(ACTIONS.DISCONNECTED);
      socket.disconnect();
    };
  }, []);

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
    fabric.Object.prototype.strokeUniform = true;

    temp.freeDrawingBrush.width = 5;
    temp.freeDrawingBrush.color = "#000";

    temp.preserveObjectStacking = true;

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

  // Contexts Value
  const objectPropertiesContextValue = {
    objectProperties,
    setObjectProperties,
  };

  const textPropertiesContextValue = {
    textProperties,
    setTextProperties,
  };

  const fabricCanvasContextValue = {
    fabricInst,
  };

  return (
    <FabricCanvasContext.Provider value={fabricCanvasContextValue}>
      {/* Header */}
      <NonInteractiveHeader>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="pointer-events-auto w-[32px] h-[32px] rounded-[10px] p-[10px] flex justify-center items-center bg-[#ececf4] hover:bg-[#f1f0ff]"
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
                <Trash width={16} height={16} />
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
                content: <Arrow width={16} height={16} />,
                value: "5",
                tooltipText: "Arrow",
              },
              {
                id: "6",
                content: <Line width={16} height={16} />,
                value: "6",
                tooltipText: "Line",
              },
              {
                id: "7",
                content: <Pen width={16} height={16} />,
                value: "7",
                tooltipText: "Draw",
              },
              {
                id: "8",
                content: <Text width={16} height={16} />,
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

      <TextPropertiesContext.Provider value={textPropertiesContextValue}>
        <ObjectPropertiesContext.Provider value={objectPropertiesContextValue}>
          {/* Main Canvas */}
          <main>
            <Receiver>
              {/* Dispatcher must be the direct parent of Drawer as it is passing down
                objectAddHandler as props to Drawer */}
              <Dispatcher>
                <Drawer
                  drawOption={drawOption}
                  imageBase64Url={imageBase64Url}
                  setImageBase64Url={setImageBase64Url}
                >
                  <canvas ref={canvasRef}></canvas>
                </Drawer>
              </Dispatcher>
            </Receiver>
          </main>
          {/* Options Sidebar */}
          {fabricInst && <OptionsSidebar />}
        </ObjectPropertiesContext.Provider>
      </TextPropertiesContext.Provider>
    </FabricCanvasContext.Provider>
  );
}

export default Editor;
