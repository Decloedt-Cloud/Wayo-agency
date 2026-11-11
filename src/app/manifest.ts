import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wayo Agency",
    short_name: "Wayo",
    description: "Cursor, Lovable or Bolt app buggy or worrying? Wayo Agency runs a vibe code audit, secures it, and takes it to production without a rewrite.",
    start_url: "/en",
    display: "standalone",
    background_color: "#0a0908",
    theme_color: "#0a0908",
    lang: "en",
    icons: [{ src: "/logos/wayo.avif", sizes: "552x552", type: "image/avif", purpose: "any" }],
  };
}
