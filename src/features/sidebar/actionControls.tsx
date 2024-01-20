/// <reference types="vite-plugin-svgr/client" />

import { FabricCanvasContext } from "@/contexts/fabricCanvasContext";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PanelColumnHeading from "@/components/panelColumnHeading";
import { generateUUID } from "@/utils/miscellaneous";
import { socket } from "@/socket";
import { ACTIONS } from "@/utils/actions";

// Assests
import Trash from "@/assets/icons/Delete.svg?react";
import Duplicate from "@/assets/icons/Duplicate.svg?react";

import { useContext } from "react";
import { useParams } from "react-router-dom";

function ActionControls() {
  const { fabricInst } = useContext(FabricCanvasContext);
  const { roomId } = useParams();

  function deleteSelecedObject() {
    if (fabricInst) {
      const activeObject = fabricInst?.getActiveObject();

      if (activeObject) {
        fabricInst.remove(activeObject);
      }
    }
  }

  function duplicate() {
    if (fabricInst) {
      const activeObject = fabricInst?.getActiveObject();

      if (activeObject && (activeObject as any).id) {
        const arr = (activeObject as any).id.split("-");
        activeObject.clone((clonedObj: fabric.Object) =>
          paste(clonedObj, arr[arr.length - 1])
        );
      }
    }
  }

  function paste(clonedObj: fabric.Object, type: string) {
    fabricInst?.discardActiveObject();

    clonedObj.set({
      left: (clonedObj.left || 0) + 10,
      top: (clonedObj.top || 0) + 10,
    });
    Object.assign(clonedObj, { id: `${generateUUID()}-${type}` });

    emitToOtherClients(clonedObj);
    fabricInst?.add(clonedObj);
    fabricInst?.setActiveObject(clonedObj);
    fabricInst?.renderAll();
  }

  function emitToOtherClients(obj: fabric.Object) {
    if (obj) {
      const json = obj.toJSON(["id"]);

      socket.emit(ACTIONS["OBJECT:ADDED"], { roomId, json });
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
                  onClick={duplicate}
                  className={`base w-[32px] h-[32px]  bg-[#f1f0ff]`}
                >
                  <Duplicate width={16} height={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Duplicate</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

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
