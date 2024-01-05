const STATIC_STROKE_COLORS = [
  "#1e1e1e",
  "#e03131",
  "#2f9e44",
  "#1971c2",
  "#f08c00",
];

const STATIC_BACKGROUND_COLORS = [
  "transparent",
  "#ffc9c9",
  "#b2f2bb",
  "#a5d8ff",
  "#ffec99",
];

const STATIC_TEXT_ALIGN_OPTIONS = ["left", "center", "right"];

enum STROKE_STYLE_OPTIONS {
  SOLID,
  DASHED,
}

enum FONT_SIZE_OPTIONS {
  SMALL,
  MEDIUM,
  LARGE,
  EXTRALARGE,
}

const TooltipDelayDuration = 400;

function generateUUID() {
  let d = new Date().getTime();
  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now(); //use high-precision timer if available
  }
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}

function getStrokeStyleOption(option: number) {
  if (option === STROKE_STYLE_OPTIONS.SOLID) return undefined;
  if (option === STROKE_STYLE_OPTIONS.DASHED) return [4, 2];
}

function getFontSize(option: number) {
  switch (option) {
    case FONT_SIZE_OPTIONS.SMALL:
      return 25;
      break;

    case FONT_SIZE_OPTIONS.MEDIUM:
      return 40;
      break;

    case FONT_SIZE_OPTIONS.LARGE:
      return 50;
      break;

    case FONT_SIZE_OPTIONS.EXTRALARGE:
      return 60;
      break;

    default:
      return 40;
      break;
  }
}

function getFontSizeIndex(option: number) {
  switch (option) {
    case 25:
      return FONT_SIZE_OPTIONS.SMALL;
      break;

    case 40:
      return FONT_SIZE_OPTIONS.MEDIUM;
      break;

    case 50:
      return FONT_SIZE_OPTIONS.LARGE;
      break;

    case 60:
      return FONT_SIZE_OPTIONS.EXTRALARGE;
      break;

    default:
      return FONT_SIZE_OPTIONS.MEDIUM;
      break;
  }
}

export {
  STATIC_STROKE_COLORS,
  STATIC_BACKGROUND_COLORS,
  TooltipDelayDuration,
  generateUUID,
  STROKE_STYLE_OPTIONS,
  getStrokeStyleOption,
  FONT_SIZE_OPTIONS,
  getFontSize,
  getFontSizeIndex,
  STATIC_TEXT_ALIGN_OPTIONS,
};
