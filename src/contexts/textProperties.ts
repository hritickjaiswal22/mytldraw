import { FONT_SIZE_OPTIONS, getFontSize } from "@/utils/miscellaneous";

import { createContext } from "react";

interface TextPropertiesContextType {
  textProperties: {
    fontSize: number;
    fontFamily: string;
  };
  setTextProperties: React.Dispatch<
    React.SetStateAction<{
      fontSize: number;
      fontFamily: string;
    }>
  >;
}

const TextPropertiesContext = createContext<TextPropertiesContextType>({
  textProperties: {
    fontSize: getFontSize(FONT_SIZE_OPTIONS.MEDIUM),
    fontFamily: "Virgil",
  },
  setTextProperties: null,
});

export { TextPropertiesContext };
