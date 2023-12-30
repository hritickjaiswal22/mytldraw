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

enum STROKE_STYLE_OPTIONS {
  SOLID,
  DASHED,
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

function mapIndexToFontSize(option: number) {
  if (option === 0) return 20;
  else if (option === 1) return 40;
  else if (option === 2) return 50;
  else if (option === 3) return 60;
  return 40;
}

export {
  STATIC_STROKE_COLORS,
  STATIC_BACKGROUND_COLORS,
  TooltipDelayDuration,
  generateUUID,
  STROKE_STYLE_OPTIONS,
  getStrokeStyleOption,
  mapIndexToFontSize,
};
