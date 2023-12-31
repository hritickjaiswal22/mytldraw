// Contexts
import { ObjectPropertiesContext } from "@/contexts/objectProperties";

// Controllers
import StrokeControls from "./strokeControls";
import FillControls from "./fillControls";
import LayerControls from "./layerControls";
import TextControls from "./textControls";
import ActionControls from "./actionControls";

import { ACTIONS } from "@/utils/actions";
import { socket } from "@/socket";
import { setOpacity } from "@/utils/setFunctions";
import PanelColumnHeading from "@/components/panelColumnHeading";

import { useContext } from "react";
import { fabric } from "fabric";
import { useParams } from "react-router-dom";

interface SidebarPropTypes {
  fabricInst: fabric.Canvas;
}

function Sidebar({ fabricInst }: SidebarPropTypes) {
  const { setObjectProperties } = useContext(ObjectPropertiesContext);
  const { roomId } = useParams();

  function opacityChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
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

  return (
    <section className="fixed z-50 bg-white left-4 top-20 p-2 rounded max-h-[782px] boxShadow">
      <FillControls />
      <StrokeControls />
      <TextControls />
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
