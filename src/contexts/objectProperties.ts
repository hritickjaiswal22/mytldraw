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
    strokeDashArray: undefined | number[];
    opacity: number;
  };
  setObjectProperties: React.Dispatch<
    React.SetStateAction<{
      strokeWidth: number;
      stroke: string;
      fill: string;
      strokeDashArray: undefined | number[];
      opacity: number;
    }>
  >;
}

const ObjectPropertiesContext = createContext<ObjectPropertiesContextType>({
  objectProperties: {
    strokeWidth: 2,
    stroke: STATIC_STROKE_COLORS[0],
    fill: STATIC_BACKGROUND_COLORS[0],
    strokeDashArray: undefined,
    opacity: 1,
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore:next-line
  setObjectProperties: null,
});

export { ObjectPropertiesContext };
