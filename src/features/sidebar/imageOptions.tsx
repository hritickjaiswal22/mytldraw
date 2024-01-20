/// <reference types="vite-plugin-svgr/client" />

import { FabricCanvasContext } from "@/contexts/fabricCanvasContext";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PanelColumnHeading from "@/components/panelColumnHeading";

import { downloadImageFromBase64 } from "@/utils/miscellaneous";

// Assests
import Download from "@/assets/icons/Download.svg?react";

import { useContext } from "react";

function ImageOptions() {
  const { fabricInst } = useContext(FabricCanvasContext);

  function downloadImage() {
    if (fabricInst) {
      const src = (fabricInst?.getActiveObject() as any)?._originalElement
        ?.currentSrc;

      if (src) {
        downloadImageFromBase64(src);
      }
    }
  }

  return (
    <>
      <div className="mb-3">
        <PanelColumnHeading>Download</PanelColumnHeading>
        <div className="flex items-center p-0 py-1 gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <button
                  onClick={downloadImage}
                  className={`base w-[32px] h-[32px]  bg-[#f1f0ff]`}
                >
                  <Download width={16} height={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  );
}

export default ImageOptions;
