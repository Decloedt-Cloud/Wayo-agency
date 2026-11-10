import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wayo Agency",
    short_name: "Wayo",
    description: "Audit, réparation et mise en production de code généré par IA.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0908",
    theme_color: "#0a0908",
    lang: "fr",
    icons: [{ src: "/logos/wayo.avif", sizes: "552x552", type: "image/avif", purpose: "any" }],
  };
}
