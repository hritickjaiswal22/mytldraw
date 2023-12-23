import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipDelayDuration } from "@/utils/miscellaneous";

import { ReactNode } from "react";

interface RadioType {
  id: string;
  value: string;
  content: ReactNode;
  tooltipText?: string;
}

interface StyledRadioGroupPropTypes {
  options: Array<RadioType>;
  onClickHandler: (index: number) => void;
  drawOption: number;
}

function StyledRadioGroup({
  options,
  onClickHandler,
  drawOption,
}: StyledRadioGroupPropTypes) {
  return (
    <RadioGroup className="pointer-events-auto flex items-center gap-1">
      {options.map(({ content, value, id, tooltipText = "Tooltip" }, i) => (
        <TooltipProvider key={id} delayDuration={TooltipDelayDuration}>
          <Tooltip>
            <TooltipTrigger>
              <div
                key={id}
                className={`base hover:bg-[#f1f0ff] cursor-pointer ${
                  drawOption === i ? "bg-[#e0dfff]" : "bg-white"
                }`}
                onClick={() => onClickHandler(i)}
              >
                <RadioGroupItem className="hidden" value={value} id={id} />
                <Label className="cursor-pointer" htmlFor={id}>
                  {content}
                </Label>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltipText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </RadioGroup>
  );
}

export default StyledRadioGroup;
