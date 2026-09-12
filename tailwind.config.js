/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        custom: "700px",
      },
      fontFamily: {
        chinese: ["SongTi", "Arial", "sans-serif"],
        cjk: [
          "Helvetica",
          "Arial",
          "STHeiti",
          "Microsoft Yahei New",
          "Microsoft Yahei",
          "微軟正黑體",
          "微软雅黑体",
          "宋体",
          "SimSun",
          "STXihei",
          "sans-serif",
        ],
        nav: ["SimSun"],
      },
    },
  },
  plugins: [],
};
