import { LanguageSwitch } from "@/components/client/LanguageSwitch";
import { ThemeToggle } from "@/components/client/ThemeToggle";
import { getUi } from "@/lib/copy";
import { getLocale, getPathname } from "@/lib/get-locale";
import { getTheme } from "@/lib/get-theme";
import { localePath } from "@/lib/locale";

export default async function NotFound() {
  const locale = await getLocale();
  const pathname = await getPathname();
  const theme = (await getTheme()) ?? "dark";
  const ui = getUi(locale);
  const home = localePath(locale, "/");

  return (
    <div className="not-found">
      <header className="site-header">
        <div className="wrap site-bar">
          <a className="brand" href={home}>
            <span className="serif">Wayo</span>
            <span className="mono faint">Agency</span>
          </a>
          <div className="site-tools">
            <LanguageSwitch locale={locale} pathname={pathname} label={ui.langLabel} />
            <ThemeToggle current={theme} light={ui.themeLight} dark={ui.themeDark} label={ui.themeLabel} />
          </div>
        </div>
      </header>
      <main id="contenu" className="not-found-main">
        <div className="wrap not-found-copy">
          <p className="mono not-found-code">404</p>
          <h1 className="serif">{ui.notFoundTitle}</h1>
          <p>{ui.notFound}</p>
          <p className="not-found-actions">
            <a className="btn" href={home}>{ui.backHome}</a>
            <a className="link" href={localePath(locale, "/#offres")}>{ui.seeOffers}</a>
          </p>
        </div>
      </main>
    </div>
  );
}
