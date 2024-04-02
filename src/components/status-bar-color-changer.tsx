"use client";

import { useEffect } from "react";

export default function StatusBarColorChanger({
  color,
}: {
  color: { light: string; dark: string };
}) {
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: light)");

    const metaTag = (document.querySelector("meta[name='theme-color']") ??
      document.createElement("meta")) as HTMLMetaElement;

    if (metaTag.attributes.length === 0) {
      metaTag.name = "theme-color";
      metaTag.content = media.matches ? color.light : color.dark;
      document.head.appendChild(metaTag);
    } else {
      metaTag.content = media.matches ? color.light : color.dark;
    }

    const handler = (e: MediaQueryListEvent) => {
      console.log(e);
      if (e.matches) {
        if (metaTag.attributes.length === 0) {
          metaTag.name = "theme-color";
          metaTag.content = color.light;
          document.head.appendChild(metaTag);
        } else {
          metaTag.content = color.light;
        }
      } else {
        if (metaTag.attributes.length === 0) {
          metaTag.name = "theme-color";
          metaTag.content = color.dark;
          document.head.appendChild(metaTag);
        } else {
          metaTag.content = color.dark;
        }
      }
    };

    media.addEventListener("change", handler);

    return () => {
      media.removeEventListener("change", handler);
    };
  }, [color.dark, color.light]);

  return <></>;
}
