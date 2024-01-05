import { fabric } from "fabric";

const ObjectBaseOptions: fabric.IObjectOptions = {
  fill: "transparent",
  stroke: "black",
  strokeWidth: 2,
  angle: 0,
};

const BaseTextOptions: fabric.ITextOptions = {
  fontFamily: "Virgil",
  textAlign: "left",
};

export { ObjectBaseOptions, BaseTextOptions };
