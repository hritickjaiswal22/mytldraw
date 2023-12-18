import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { ReactNode } from "react";

interface RadioType {
  id: string;
  value: string;
  content: ReactNode;
  isActive?: boolean;
}

interface StyledRadioGroupPropTypes {
  options: Array<RadioType>;
  onClickHandler: () => void;
}

function StyledRadioGroup({
  options,
  onClickHandler,
}: StyledRadioGroupPropTypes) {
  return (
    <RadioGroup className="pointer-events-auto flex justify-between items-center gap-1">
      {options.map(({ content, value, id, isActive }, i) => (
        <div
          key={id}
          className={`w-[36px] h-[36px] rounded-[10px] flex justify-center items-center bg-[#ececf4] hover:bg-[#f1f0ff] cursor-pointer ${
            isActive ? "bg-[#bebce5]" : ""
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
