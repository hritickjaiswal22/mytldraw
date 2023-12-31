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
import { DrawOptions } from "@/utils/drawOptions";

interface HeaderPropTypes {
  optionHandler: (option: number) => void;
  drawOption: number;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Header({ drawOption, onImageUpload, optionHandler }: HeaderPropTypes) {
  return (
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
  );
}

export default Header;
