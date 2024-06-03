// Contexts
import { ObjectPropertiesContext } from "@/contexts/objectProperties";
import { FabricCanvasContext } from "@/contexts/fabricCanvasContext";

// Controllers
import StrokeControls from "./strokeControls";
import FillControls from "./fillControls";
import LayerControls from "./layerControls";
import TextControls from "./textControls";
import ActionControls from "./actionControls";
import ImageOptions from "./imageOptions";

import { ACTIONS } from "@/utils/actions";
import { socket } from "@/socket";
import { setOpacity } from "@/utils/setFunctions";
import PanelColumnHeading from "@/components/panelColumnHeading";
import { DrawOptionsText } from "@/utils/drawOptions";

import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function showFillControl(drawType: string) {
  if (
    drawType === DrawOptionsText.rectangle ||
    drawType === DrawOptionsText.triangle ||
    drawType === DrawOptionsText.circle
  )
    return true;

  return false;
}

function showStrokeControl(drawType: string) {
  if (
    drawType &&
    (drawType === DrawOptionsText.image || drawType === DrawOptionsText.text)
  )
    return false;

  return true;
}

function showTextControl(drawType: string) {
  if (drawType && drawType === DrawOptionsText.text) return true;

  return false;
}

function showImageOptions(drawType: string) {
  if (drawType && drawType === DrawOptionsText.image) return true;

  return false;
}

function Sidebar() {
  const { fabricInst } = useContext(FabricCanvasContext);
  const { setObjectProperties } = useContext(ObjectPropertiesContext);
  const { roomId } = useParams();

  const [showSidebar, setShowSidebar] = useState(false);
  const [drawType, setDrawType] = useState("");

  function getDrawType(e: fabric.IEvent<MouseEvent>) {
    if (e && e.selected && (e.selected[0] as any).id) {
      const id = (e.selected[0] as any).id;

      const arr = id.split("-");
      if (arr.length) return arr[arr.length - 1];
    }

    return "";
  }

  function setSidebar(e: fabric.IEvent<MouseEvent>) {
    setShowSidebar(true);

    if (e.selected) setDrawType(getDrawType(e));
  }

  function selectionClearHandler() {
    setShowSidebar(false);
    setDrawType("");
  }

  useEffect(() => {
    if (fabricInst) {
      fabricInst.on("selection:created", setSidebar);
      fabricInst.on("selection:updated", setSidebar);
      fabricInst.on("selection:cleared", selectionClearHandler);
    }

    return () => {
      fabricInst?.off("selection:created", setSidebar as any);
      fabricInst?.off("selection:updated", setSidebar as any);
      fabricInst?.off("selection:cleared", selectionClearHandler);
    };
  }, []);

  function opacityChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    if (setObjectProperties)
      setObjectProperties((prev) => {
        return {
          ...prev,
          opacity: Number(e.target.value),
        };
      });

    const activeObject = fabricInst?.getActiveObject();

    if (activeObject) {
      socket.emit(ACTIONS["OBJECT:CHANGED"], {
        roomId,
        objectId: (activeObject as any).id,
        payload: Number(e.target.value),
        action: ACTIONS["OPACITY:CHANGED"],
      });

      setOpacity(activeObject, Number(e.target.value));

      fabricInst?.renderAll();
    }
  }

  if (!showSidebar) return null;

  return (
    <section className="fixed z-50 bg-white left-4 top-20 p-2 rounded max-h-[782px] boxShadow">
      {showStrokeControl(drawType) ? <StrokeControls /> : ""}
      {showFillControl(drawType) ? <FillControls /> : ""}
      {showTextControl(drawType) ? <TextControls /> : ""}
      {showImageOptions(drawType) ? <ImageOptions /> : null}

      {/* Always render  */}
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
      <LayerControls />
      <ActionControls />
    </section>
  );
}

export default Sidebar;
