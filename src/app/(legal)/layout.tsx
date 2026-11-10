import type { ReactNode } from "react";
import { Footer } from "@/components/sections/Footer";
import { getUi } from "@/lib/copy";
import { getLocale } from "@/lib/get-locale";
import { legalFields } from "./fields";

export default async function LegalLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const ui = getUi(locale);
  const settings = await legalFields();
  return (
    <>
      <div className="section wrap">{children}</div>
      <Footer ui={ui} locale={locale} bookingUrl={settings.bookingUrl} />
    </>
  );
}
