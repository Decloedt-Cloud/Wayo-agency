import type { ReactNode } from "react";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return <div className="section wrap">{children}</div>;
}
