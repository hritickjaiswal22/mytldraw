/// <reference types="vite-plugin-svgr/client" />

import { STATIC_TEXT_ALIGN_OPTIONS, getFontSize } from "@/utils/miscellaneous";
import { getFontSizeIndex } from "@/utils/miscellaneous";
// Contexts
import { TextPropertiesContext } from "@/contexts/textProperties";
import { FabricCanvasContext } from "@/contexts/fabricCanvasContext";

// Assests
import Small from "@/assets/icons/SmallFont.svg?react";
import Medium from "@/assets/icons/MediumFont.svg?react";
import Large from "@/assets/icons/Large.svg?react";
import ExtraLarge from "@/assets/icons/ExtraLarge.svg?react";
import Pen from "@/assets/icons/Pen.svg?react";
import Normal from "@/assets/icons/NormalFont.svg?react";
import Code from "@/assets/icons/Code.svg?react";
import Center from "@/assets/icons/Center.svg?react";
import Right from "@/assets/icons/Right.svg?react";
import Left from "@/assets/icons/Left.svg?react";

import PanelColumnHeading from "@/components/panelColumnHeading";
import RadioGroup from "@/components/styledRadioGroup";

import { socket } from "@/socket";
import { ACTIONS } from "@/utils/actions";

import { useContext } from "react";
import { useParams } from "react-router-dom";

function mapIndexToFontFamily(index: number) {
  switch (index) {
    case 0:
      return "systemFont";
      break;

    case 1:
      return "Times New Roman";
      break;

    case 2:
      return "system-ui";
      break;

    default:
      return "Times New Roman";
      break;
  }
}

function mapFontFamilyToIndex(family: string) {
  switch (family) {
    case "systemFont":
      return 0;
      break;

    case "Times New Roman":
      return 1;
      break;

    case "system-ui":
      return 2;
      break;

    default:
      return 0;
      break;
  }
}

function TextControls() {
  const { setTextProperties, textProperties } = useContext(
    TextPropertiesContext
  );
  const { fabricInst } = useContext(FabricCanvasContext);
  const { roomId } = useParams();

  function textSizeChangeHandler(option: number) {
    setTextProperties((prev) => {
      return {
        ...prev,
        fontSize: getFontSize(option),
      };
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

  function fontFamilyChangeHandler(option: number) {
    setTextProperties((prev) => {
      return {
        ...prev,
        fontFamily: mapIndexToFontFamily(option),
      };
    });

    const activeObject = fabricInst?.getActiveObject();

    if (activeObject && activeObject.type === "i-text") {
      socket.emit(ACTIONS["OBJECT:CHANGED"], {
        roomId,
        objectId: (activeObject as any).id,
        payload: mapIndexToFontFamily(option),
        action: ACTIONS["FONTFAMILY:CHANGED"],
      });

      (activeObject as fabric.IText).set({
        fontFamily: mapIndexToFontFamily(option),
      });
      fabricInst?.renderAll();
    }
  }

  function textAlignChangeHandler(option: number) {
    setTextProperties((prev) => {
      return {
        ...prev,
        textAlign: STATIC_TEXT_ALIGN_OPTIONS[option],
      };
    });

    const activeObject = fabricInst?.getActiveObject();

    if (activeObject && activeObject.type === "i-text") {
      socket.emit(ACTIONS["OBJECT:CHANGED"], {
        roomId,
        objectId: (activeObject as any).id,
        payload: STATIC_TEXT_ALIGN_OPTIONS[option],
        action: ACTIONS["TEXTALIGN:CHANGED"],
      });

      (activeObject as fabric.IText).set({
        textAlign: STATIC_TEXT_ALIGN_OPTIONS[option],
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
      <div className="mb-3">
        <PanelColumnHeading>Font Family</PanelColumnHeading>
        <RadioGroup
          onClickHandler={fontFamilyChangeHandler}
          bgColor="bg-[#f1f0ff]"
          options={[
            {
              id: "font-family-1",
              content: <Pen width={16} height={16} />,
              value: "font-family-1",
              tooltipText: "Hand drawn",
            },
            {
              id: "font-family-2",
              content: <Normal width={16} height={16} />,
              value: "font-family-2",
              tooltipText: "Normal",
            },
            {
              id: "font-family-3",
              content: <Code width={16} height={16} />,
              value: "font-family-3",
              tooltipText: "Code",
            },
          ]}
          drawOption={mapFontFamilyToIndex(textProperties.fontFamily)}
        />
      </div>
      <div className="mb-3">
        <PanelColumnHeading>Text Align</PanelColumnHeading>
        <RadioGroup
          onClickHandler={textAlignChangeHandler}
          bgColor="bg-[#f1f0ff]"
          options={[
            {
              id: "text-align-1",
              content: <Left width={16} height={16} />,
              value: "text-align-1",
              tooltipText: "Left",
            },
            {
              id: "text-align-2",
              content: <Center width={16} height={16} />,
              value: "text-align-2",
              tooltipText: "Center",
            },
            {
              id: "text-align-3",
              content: <Right width={16} height={16} />,
              value: "text-align-3",
              tooltipText: "Right",
            },
          ]}
          drawOption={STATIC_TEXT_ALIGN_OPTIONS.findIndex(
            (val) => val === textProperties.textAlign
          )}
        />
      </div>
    </>
  );
}

export default TextControls;
