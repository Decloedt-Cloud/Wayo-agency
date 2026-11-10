import { HeroScene } from "@/components/client/HeroScene";
import { LanguageSwitch } from "@/components/client/LanguageSwitch";
import { ThemeToggle } from "@/components/client/ThemeToggle";
import type { Ui } from "@/lib/copy";
import type { Locale } from "@/lib/locale";
import type { OfferRecord } from "@/lib/queries";
import type { Theme } from "@/lib/theme";

export function Hero({ offers, ui, locale, theme, pathname }: { offers: OfferRecord[]; ui: Ui; locale: Locale; theme: Theme; pathname: string }) {
  return (
    <section className="hero">
      <header className="site-header">
        <div className="wrap site-bar">
          <a className="brand" href="#contenu">
            <span className="serif">Wayo</span>
            <span className="mono faint">Agency</span>
          </a>
          <nav className="nav mono" aria-label={ui.navLabel}>
            <a className="link" href="#constat">{ui.nav.constat}</a>
            <a className="link" href="#methode">{ui.nav.method}</a>
            <a className="link" href="#offres">{ui.nav.offers}</a>
            <a className="link" href="#faq">{ui.nav.faq}</a>
          </nav>
          <div className="site-tools">
            <LanguageSwitch locale={locale} pathname={pathname} label={ui.langLabel} />
            <ThemeToggle current={theme} light={ui.themeLight} dark={ui.themeDark} label={ui.themeLabel} />
            <a className="btn" href="#contact">{ui.book}</a>
          </div>
        </div>
      </header>
      <HeroScene labels={ui.canvas} />
      <div className="hero-veil" aria-hidden="true" />
      <div className="wrap hero-body">
        <h1 className="serif">
          <span className="hero-line"><span>{ui.hero1}</span></span>
          <span className="hero-line"><span className="accent">{ui.hero2}</span></span>
        </h1>
        <p className="hero-keyword">{ui.heroKeyword}</p>
        <div className="cols" style={{ marginTop: 28, alignItems: "flex-end" }}>
          <p className="hero-copy">{ui.heroIntro}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center" }}>
            <a className="btn" href="#contact">{ui.bookArrow}</a>
            <a className="link" href="#offres">{ui.seeOffers}</a>
          </div>
        </div>
      </div>
      <div className="hero-band">
        <div className="wrap band-grid" style={{ borderTop: 0, background: "transparent" }}>
          {offers.map((offer) => (
            <a key={offer.slug} href="#offres">
              <span className="mono" style={{ color: "var(--accent)" }}>{String(offer.position).padStart(2, "0")}</span>
              <span className="serif name">{offer.shortLabel}</span>
              <span className="faint" style={{ fontSize: 14 }}>{offer.shortDescription}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
