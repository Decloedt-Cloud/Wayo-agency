import { getUi } from "@/lib/copy";
import { getLocale } from "@/lib/get-locale";
import { localePath } from "@/lib/locale";

export default async function NotFound() {
  const locale = await getLocale();
  const ui = getUi(locale);
  return (
    <main id="contenu" className="section">
      <div className="wrap">
        <h1 className="serif display">404</h1>
        <p className="muted">{ui.notFound}</p>
        <p><a className="btn" href={localePath(locale, "/")}>{ui.backHome}</a></p>
      </div>
    </main>
  );
}
