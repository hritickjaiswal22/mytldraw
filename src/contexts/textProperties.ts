import { createContext } from "react";

interface TextPropertiesContextTypes {
  textProperties: {
    fontSize: number;
  };
  setTextProperties: any;
}

const TextPropertiesContext = createContext<TextPropertiesContextTypes>({
  textProperties: {
    fontSize: 40,
  },
  setTextProperties: null,
});

export { TextPropertiesContext };
