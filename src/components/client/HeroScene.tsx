"use client";

import dynamic from "next/dynamic";

const HeroCanvas = dynamic(
  () => import("@/components/client/HeroCanvas").then((mod) => mod.HeroCanvas),
  { ssr: false },
);

export function HeroScene({ labels }: { labels: readonly [string, string, string] }) {
  return <HeroCanvas labels={labels} />;
}
