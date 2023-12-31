import { getFontSize } from "@/utils/miscellaneous";
import { getFontSizeIndex } from "@/utils/miscellaneous";
// Contexts
import { TextPropertiesContext } from "@/contexts/textProperties";
import { FabricCanvasContext } from "@/contexts/fabricCanvasContext";

// Assests
import Small from "@/assets/icons/SmallFont.svg?react";
import Medium from "@/assets/icons/MediumFont.svg?react";
import Large from "@/assets/icons/Large.svg?react";
import ExtraLarge from "@/assets/icons/ExtraLarge.svg?react";

import PanelColumnHeading from "@/components/panelColumnHeading";
import RadioGroup from "@/components/styledRadioGroup";

import { socket } from "@/socket";
import { ACTIONS } from "@/utils/actions";

import { useContext } from "react";
import { useParams } from "react-router-dom";

function TextControls() {
  const { setTextProperties, textProperties } = useContext(
    TextPropertiesContext
  );
  const { fabricInst } = useContext(FabricCanvasContext);
  const { roomId } = useParams();

  function textSizeChangeHandler(option: number) {
    setTextProperties({
      fontSize: getFontSize(option),
    });

    const activeObject = fabricInst?.getActiveObject();

    if (activeObject && activeObject.type === "i-text") {
      socket.emit(ACTIONS["OBJECT:CHANGED"], {
        roomId,
        objectId: (activeObject as any).id,
        payload: getFontSize(option),
        action: ACTIONS["FONTSIZE:CHANGED"],
      });

      (activeObject as fabric.IText).set({
        fontSize: getFontSize(option),
      });
      fabricInst?.renderAll();
    }
  }

  return (
    <>
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
    </>
  );
}

export default TextControls;
