/// <reference types="vite-plugin-svgr/client" />

import NonInteractiveHeader from "@/layouts/header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import RadioGroup from "@/components/styledRadioGroup";
import { TooltipDelayDuration } from "@/utils/miscellaneous";
import { Label } from "@/components/ui/label";
import Snapper from "@/features/snapper";
import Transformer from "@/features/transformer";
import { FabricCanvasContext } from "@/contexts/fabricCanvasContext";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ActiveUserType } from "@/features/editor/editor";

// Assets
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
import Lock from "@/assets/icons/Lock.svg?react";
import Snap from "@/assets/icons/columns.svg?react";

import { DrawOptions } from "@/utils/drawOptions";

import { useState, useContext } from "react";

interface HeaderPropTypes {
  optionHandler: (option: number) => void;
  drawOption: number;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  keepCurrentDrawOption: boolean;
  setKeepCurrentDrawOption: React.Dispatch<React.SetStateAction<boolean>>;
  activeUsers: Array<ActiveUserType>;
}

function Header({
  drawOption,
  onImageUpload,
  optionHandler,
  keepCurrentDrawOption,
  setKeepCurrentDrawOption,
  activeUsers,
}: HeaderPropTypes) {
  const [snap, setSnap] = useState(false);
  const { fabricInst } = useContext(FabricCanvasContext);

  function resetCanvas() {
    if (fabricInst) {
      fabricInst.clear();
    }
  }

  return (
    <>
      <Snapper snap={snap} />
      {fabricInst ? <Transformer /> : null}
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
              <DropdownMenuItem
                onClick={resetCanvas}
                className="flex gap-3 font-normal cursor-pointer hover:bg-[#f1f0ff] text-xs"
              >
                <Trash width={16} height={16} />
                Reset the canvas
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="pointer-events-none flex items-center gap-1 p-1 rounded bg-white boxShadow">
          <TooltipProvider delayDuration={TooltipDelayDuration}>
            <Tooltip>
              <TooltipTrigger
                onClick={() => setKeepCurrentDrawOption((prev) => !prev)}
              >
                <div
                  className={`pointer-events-auto base bg-white hover:bg-[#f1f0ff] cursor-pointer`}
                  style={{
                    backgroundColor: keepCurrentDrawOption ? "#e0dfff" : "#fff",
                  }}
                >
                  <Lock width={16} height={16} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Keep selected tool active after drawing</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="w-[1px] h-6 bg-gray-200 my-0 mx-1"></div>
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
          <div className="w-[1px] h-6 bg-gray-200 my-0 mx-1"></div>
          <TooltipProvider delayDuration={TooltipDelayDuration}>
            <Tooltip>
              <TooltipTrigger onClick={() => setSnap((prev) => !prev)}>
                <div
                  className="pointer-events-auto base bg-white hover:bg-[#f1f0ff] cursor-pointer"
                  style={{
                    backgroundColor: snap ? "#e0dfff" : "#fff",
                  }}
                >
                  <Snap width={16} height={16} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle snap</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="pointer-events-auto flex gap-1">
          {activeUsers.map(({ socketId, username }) => (
            <HoverCard key={socketId} openDelay={200}>
              <HoverCardTrigger>
                <Avatar className="cursor-pointer">
                  <AvatarFallback className="bg-yellow-200">
                    {username[0].toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </HoverCardTrigger>
              <HoverCardContent className="w-25 whitespace-nowrap overflow-hidden text-ellipsis text-center bg-green-400 text-gray-950 p-2">
                <p className="text-base">{username}</p>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </NonInteractiveHeader>
    </>
  );
}

export default Header;
