import {
  STATIC_BACKGROUND_COLORS,
  STATIC_STROKE_COLORS,
} from "@/utils/miscellaneous";

import { createContext } from "react";

const ObjectPropertiesContext = createContext({
  strokeWidth: 2,
  stroke: STATIC_STROKE_COLORS[0],
  fill: STATIC_BACKGROUND_COLORS[0],
});

export { ObjectPropertiesContext };
