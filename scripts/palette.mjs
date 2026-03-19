export const palette = {
  gray: {
    400: "#adadb1",
    500: "#8E8E95",
    600: "#84848A",
    700: "#79797F",
    800: "#6C6C71",
  },
  red: { 400: "#ff6762", 600: "#d52c36" },
  orange: { 400: "#ffa359", 600: "#d47628" },
  yellow: { 400: "#ffd452", 600: "#d5a910" },
  green: { 400: "#5ecc71", 600: "#199f43" },
  mint: { 400: "#61d5c0", 600: "#16a994" },
  teal: { 400: "#64d1db", 600: "#17a5af" },
  cyan: { 400: "#68cdf2", 600: "#1ca1c7" },
  blue: { 400: "#69b1ff", 600: "#1a85d4" },
  indigo: { 400: "#9d6afb", 600: "#693acf" },
  purple: { 400: "#d568ea", 600: "#a631be" },
  pink: { 400: "#ff678d", 600: "#d32a61" },
  brown: { 400: "#c3987b", 600: "#956b4f" },
};

export const fill = { dark: palette.gray[400], light: palette.gray[800] };

export function color(hue) {
  return { dark: hue[400], light: hue[600] };
}

export function duoColor(fg, bg) {
  return { fg: color(fg), bg: color(bg) };
}
