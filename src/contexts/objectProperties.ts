import {
  STATIC_BACKGROUND_COLORS,
  STATIC_STROKE_COLORS,
} from "@/utils/miscellaneous";

import { createContext } from "react";

interface ObjectPropertiesTypes {
  strokeWidth: number;
  stroke: string;
  fill: string;
  strokeDashArray: undefined | number[];
  opacity: number;
}

interface ObjectPropertiesContextType {
  objectProperties: ObjectPropertiesTypes;
  setObjectProperties: null | React.Dispatch<
    React.SetStateAction<ObjectPropertiesTypes>
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
  setObjectProperties: null,
});

export { ObjectPropertiesContext };

export type { ObjectPropertiesTypes, ObjectPropertiesContextType };
