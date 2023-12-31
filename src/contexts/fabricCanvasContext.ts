import { createContext } from "react";

interface FabricCanvasContextType {
  fabricInst: fabric.Canvas | null;
}

const FabricCanvasContext = createContext<FabricCanvasContextType>({
  fabricInst: null,
});

export { FabricCanvasContext };
