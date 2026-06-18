import localFont from "next/font/local";

// const sansFont = localFont({
//   src: [
//     {
//       path: "/fonts/iransans_ultra_light.ttf",
//       weight: "100",
//       style: "normal",
//     },
//     {
//       path: "/fonts/iransans_light.ttf",
//       weight: "200",
//       style: "normal",
//     },
//     {
//       path: "/fonts/iransans_medium.ttf",
//       weight: "400",
//       style: "normal",
//     },
//     {
//       path: "/fonts/iransans_bold.ttf",
//       weight: "500",
//       style: "normal",
//     },
//     {
//       path: "/fonts/iransans_black.ttf",
//       weight: "600",
//       style: "normal",
//     },
//   ],
//   variable: "--font-iransans",
//   display: "swap",
// });

const sansFont = localFont({
  src: [
    {
      path: "../../public/fonts/YekanBakhFaNum-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/YekanBakhFaNum-Light.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/YekanBakhFaNum-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/YekanBakhFaNum-SemiBold.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/YekanBakhFaNum-Bold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/YekanBakhFaNum-ExtraBold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/YekanBakhFaNum-Black.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/YekanBakhFaNum-ExtraBlack.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-yekanbakh", // CSS variable name
  display: "swap", // Optional
});


export default sansFont;


