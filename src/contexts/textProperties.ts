import { FONT_SIZE_OPTIONS, getFontSize } from "@/utils/miscellaneous";

import { createContext } from "react";

interface TextPropertiesContextType {
  textProperties: {
    fontSize: number;
  };
  setTextProperties: React.Dispatch<
    React.SetStateAction<{
      fontSize: number;
    }>
  >;
}

const TextPropertiesContext = createContext<TextPropertiesContextType>({
  textProperties: {
    fontSize: getFontSize(FONT_SIZE_OPTIONS.MEDIUM),
  },
  setTextProperties: null,
});

export { TextPropertiesContext };
