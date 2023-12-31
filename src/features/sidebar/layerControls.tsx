/// <reference types="vite-plugin-svgr/client" />

import PanelColumnHeading from "@/components/panelColumnHeading";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { socket } from "@/socket";
import { ACTIONS } from "@/utils/actions";

// Contexts
import { FabricCanvasContext } from "@/contexts/fabricCanvasContext";

// Assests
import SendToBack from "@/assets/icons/SendToBack.svg?react";
import SendBackward from "@/assets/icons/SendBackward.svg?react";
import BringToFront from "@/assets/icons/BringToFront.svg?react";
import BringForward from "@/assets/icons/BringForward.svg?react";

import { useContext } from "react";
import { useParams } from "react-router-dom";

function LayerControls() {
  const { fabricInst } = useContext(FabricCanvasContext);
  const { roomId } = useParams();

  function sendToBackHandler() {
    if (fabricInst) {
      const activeObject = fabricInst?.getActiveObject();

      if (activeObject) {
        socket.emit(ACTIONS["OBJECT:CHANGED"], {
          roomId,
          objectId: (activeObject as any).id,
          payload: "",
          action: ACTIONS.SENDTOBACK,
        });

        fabricInst.sendToBack(activeObject);

        fabricInst?.renderAll();
      }
    }
  }

  function sendBackwards() {
    if (fabricInst) {
      const activeObject = fabricInst?.getActiveObject();

      if (activeObject) {
        socket.emit(ACTIONS["OBJECT:CHANGED"], {
          roomId,
          objectId: (activeObject as any).id,
          payload: "",
          action: ACTIONS.SENDBACKWARD,
        });

        fabricInst.sendToBack(activeObject);

        fabricInst?.renderAll();
      }
    }
  }

  function bringToFront() {
    if (fabricInst) {
      const activeObject = fabricInst?.getActiveObject();

      if (activeObject) {
        socket.emit(ACTIONS["OBJECT:CHANGED"], {
          roomId,
          objectId: (activeObject as any).id,
          payload: "",
          action: ACTIONS.BRINGTOFRONT,
        });

        fabricInst.bringToFront(activeObject);

        fabricInst?.renderAll();
      }
    }
  }

  function bringForward() {
    if (fabricInst) {
      const activeObject = fabricInst?.getActiveObject();

      if (activeObject) {
        socket.emit(ACTIONS["OBJECT:CHANGED"], {
          roomId,
          objectId: (activeObject as any).id,
          payload: "",
          action: ACTIONS.BRINGFORWARD,
        });

        fabricInst.bringForward(activeObject);

        fabricInst?.renderAll();
      }
    }
  }

  return (
    <>
      <div className="mb-3">
        <PanelColumnHeading>Layers</PanelColumnHeading>
        <div className="flex items-center gap-1">
          <div className="flex items-center p-0 py-1 gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <button
                    onClick={sendToBackHandler}
                    className={`base w-[32px] h-[32px] bg-[#f1f0ff]`}
                  >
                    <SendToBack width={16} height={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send to back</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center p-0 py-1 gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <button
                    onClick={sendBackwards}
                    className={`base w-[32px] h-[32px] bg-[#f1f0ff]`}
                  >
                    <SendBackward width={16} height={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send backwards</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center p-0 py-1 gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <button
                    onClick={bringToFront}
                    className={`base w-[32px] h-[32px] bg-[#f1f0ff]`}
                  >
                    <BringToFront width={16} height={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Bring to front</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center p-0 py-1 gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <button
                    onClick={bringForward}
                    className={`base w-[32px] h-[32px] bg-[#f1f0ff]`}
                  >
                    <BringForward width={16} height={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Bring forward</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </>
  );
}

export default LayerControls;
