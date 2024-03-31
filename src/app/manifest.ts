import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    theme_color: "#efdca9",
    background_color: "#471f00",
    icons: [
      {
        purpose: "maskable",
        sizes: "512x512",
        src: "icon512_maskable.png",
        type: "image/png",
      },
      {
        purpose: "any",
        sizes: "512x512",
        src: "icon512_rounded.png",
        type: "image/png",
      },
    ],
    orientation: "portrait-primary",
    display: "standalone",
    dir: "auto",
    lang: "es-PE",
    name: "D'diego MS",
    start_url: "/",
    scope: "/",
    description: "PoC de una aplicacion PWA para la empresa D'Diego",
    categories: ["business", "productivity"],
  };
}
