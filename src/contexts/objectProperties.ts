import {
  STATIC_BACKGROUND_COLORS,
  STATIC_STROKE_COLORS,
} from "@/utils/miscellaneous";

import { createContext } from "react";

interface ObjectPropertiesContextType {
  objectProperties: {
    strokeWidth: number;
    stroke: string;
    fill: string;
  };
  setObjectProperties: React.Dispatch<
    React.SetStateAction<{
      strokeWidth: number;
      stroke: string;
      fill: string;
    }>
  >;
}

const ObjectPropertiesContext = createContext<ObjectPropertiesContextType>({
  objectProperties: {
    strokeWidth: 2,
    stroke: STATIC_STROKE_COLORS[0],
    fill: STATIC_BACKGROUND_COLORS[0],
  },
  setObjectProperties: null,
});

export { ObjectPropertiesContext };
