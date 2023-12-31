import { FabricCanvasContext } from "@/contexts/fabricCanvasContext";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PanelColumnHeading from "@/components/panelColumnHeading";

// Assests
import Trash from "@/assets/icons/Delete.svg?react";

import { useContext } from "react";

function ActionControls() {
  const { fabricInst } = useContext(FabricCanvasContext);

  function deleteSelecedObject() {
    if (fabricInst) {
      const activeObject = fabricInst?.getActiveObject();

      if (activeObject) {
        fabricInst.remove(activeObject);
      }
    }
  }

  return (
    <>
      <div className="mb-3">
        <PanelColumnHeading>Actions</PanelColumnHeading>
        <div className="flex items-center p-0 py-1 gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <button
                  onClick={deleteSelecedObject}
                  className={`base w-[32px] h-[32px]  bg-[#f1f0ff]`}
                >
                  <Trash width={16} height={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  );
}

export default ActionControls;
