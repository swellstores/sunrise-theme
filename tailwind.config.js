/** @type {import('tailwindcss').Config} */

const spacing = {
  0: "0",
  1: "0.1rem",
  2: "0.2rem",
  3: "0.3rem",
  4: "0.4rem",
  6: "0.6rem",
  8: "0.8rem",
  10: "1rem",
  12: "1.2rem",
  14: "1.4rem",
  16: "1.6rem",
  18: "1.8rem",
  20: "2rem",
  22: "2.2rem",
  24: "2.4rem",
  28: "2.8rem",
  30: "3rem",
  32: "3.2rem",
  40: "4rem",
  44: "4.4rem",
  48: "4.8rem",
  50: "5rem",
  60: "6rem",
  64: "6.4rem",
  70: "7rem",
  80: "8rem",
  92: "9.2rem",
  96: "9.6rem",
  100: "10rem",
  110: "11rem",
  120: "12rem",
  128: "12.8rem",
  140: "14rem",
  160: "16rem",
  192: "19.2rem",
  200: "20rem",
  224: "22.4rem",
  240: "24rem",
  250: "25rem",
  264: "26.4rem",
  275: "27.5rem",
  300: "30rem",
  330: "33rem",
  338: "33.8rem",
  340: "34rem",
  354: "35.4rem",
  360: "36rem",
  384: "38.4rem",
  400: "40rem",
  432: "43.2rem",
  450: "45rem",
  480: "48rem",
  500: "50rem",
  512: "51.2rem",
  550: "55rem",
  600: "60rem",
  620: "62rem",
  640: "64rem",
  700: "70rem",
  720: "72rem",
  766: "76.6rem",
  800: "80rem",
  840: "84rem",
  960: "96rem",
  content: "120rem",
  container: "144rem",
};

module.exports = {
  content: ["./theme/**/*.{html,js,liquid}", "./src/**/*.{js,css}"],
  darkMode: "false",
  theme: {
    extend: {
      colors: {
        black: "#222222",
      },
      fontFamily: {
        display: ["sans-serif"],
      },
      screens: {
        "min-960": "960px",
      },
      spacing,
      width: spacing,
      height: spacing,
      minWidth: spacing,
      maxWidth: spacing,
      maxHeight: spacing,
      padding: spacing,
      margin: spacing,
      gap: spacing,
      size: spacing,
      inset: spacing,
      top: spacing,
      right: spacing,
      bottom: spacing,
      left: spacing,
      borderRadius: spacing,
    },
  },
  safelist: [
    "sm:grid-cols-2",
    "sm:grid-cols-3",
    "sm:grid-cols-4",
    "sm:grid-cols-5",
    "sm:grid-cols-6",
    "sm:grid-cols-7",
    "md:grid-cols-5",
    "lg:grid-cols-5",
    "lg:grid-cols-2",
    "xl:grid-cols-3",
    "xl:grid-cols-4",
    "xl:grid-cols-5",
    { pattern: /^border-b-\w+/ }, // Matches 'border-b-*' classes
    { pattern: /^m(\w?)-/ }, // Matches 'm-*' margin classes, excludes negative spacing values
    { pattern: /^-(mt|mb)-/ }, // Matches '-mt-*' and '-mb-*' margin classes, excludes other negative spacing values
    { pattern: /^p(\w?)-/ }, // Matches 'p-*' padding classes, excludes negative spacing values
    { pattern: /^text-(left|right|center)$/ }, // Matches 'text-*' alignment classes
    { pattern: /^items-(start|center|end)$/ }, // Matches 'items-*' alignment classes
    { pattern: /^justify-(start|center|end)$/ }, // Matches 'justify-*' alignment classes
    {
      pattern:
        /^text-(xxs|xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)(\/(none|tight|snug|normal|loose|relaxed|[3-9]|10))?$/, // Matches 'text-*' size classes
    },
    {
      pattern: /^font-(light|normal|medium|semibold|bold)$/, // Matches 'font-*' font weight classes
    },
    {
      pattern: /grid-cols-\d+/, // regex for grid columns
    },
    {
      pattern: /gap-\d+/, // regex for column gaps
    },
    {
      pattern: /col-span-\d+/, // regex for column spans
    },
  ],
  plugins: [
    require("tailwindcss-fluid-type")({
      values: {
        xxs: [-3, 1.6],
        xxxs: [-5, 1.6],
      },
    }),
    function ({ addBase, addUtilities }) {
      addBase({
        html: { fontSize: "62.5%" }, // 1rem = 10px
        body: { fontSize: "1.6rem" }, // 16px
      });
      addUtilities({
        ".rounded": {
          "border-radius": "calc(1rem * var(--border-radius))",
        },
      });
    },
  ],
};
