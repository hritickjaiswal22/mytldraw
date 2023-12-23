import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { ReactNode } from "react";

interface RadioType {
  id: string;
  value: string;
  content: ReactNode;
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
    <RadioGroup className="pointer-events-auto flex justify-between items-center gap-1">
      {options.map(({ content, value, id }, i) => (
        <div
          key={id}
          className={`w-[36px] h-[36px] rounded-[10px] flex justify-center items-center hover:bg-[#f1f0ff] cursor-pointer ${
            drawOption === i ? "bg-[#e0dfff]" : "bg-white"
          }`}
          onClick={() => onClickHandler(i)}
        >
          <RadioGroupItem className="hidden" value={value} id={id} />
          <Label className="cursor-pointer" htmlFor={id}>
            {content}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}

export default StyledRadioGroup;
