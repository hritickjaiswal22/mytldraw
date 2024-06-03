import {
  FONT_SIZE_OPTIONS,
  STATIC_TEXT_ALIGN_OPTIONS,
  getFontSize,
} from "@/utils/miscellaneous";

import { createContext } from "react";

interface TextPropertiesContextType {
  textProperties: {
    fontSize: number;
    fontFamily: string;
    textAlign: string;
  };
  setTextProperties: React.Dispatch<
    React.SetStateAction<{
      fontSize: number;
      fontFamily: string;
      textAlign: string;
    }>
  >;
}

const TextPropertiesContext = createContext<TextPropertiesContextType>({
  textProperties: {
    fontSize: getFontSize(FONT_SIZE_OPTIONS.MEDIUM),
    fontFamily: "systemFont",
    textAlign: STATIC_TEXT_ALIGN_OPTIONS[0],
  },
  setTextProperties: null,
});

export { TextPropertiesContext };
