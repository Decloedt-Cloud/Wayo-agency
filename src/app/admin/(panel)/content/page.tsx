import { asc } from "drizzle-orm";
import { createFaq, moveFaq, toggleFaq, updateOffer, updateSettings } from "../../actions";
import { getDb } from "@/lib/db";
import { faqItems, offers, siteSettings } from "@/lib/schema";

export default async function ContentPage() {
  const db = getDb();
  const offerRows = await db.select().from(offers).orderBy(asc(offers.position));
  const faqRows = await db.select().from(faqItems).orderBy(asc(faqItems.position));
  const [settings] = await db.select().from(siteSettings).limit(1);

  return (
    <>
      <h1 className="serif" style={{ fontSize: 56, margin: 0 }}>Contenu</h1>
      {offerRows.map((offer) => (
        <form key={offer.id} action={updateOffer} style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 28, borderTop: "1px solid var(--line)", paddingTop: 20 }}>
          <input type="hidden" name="id" value={offer.id} />
          <p className="mono accent">{offer.slug}</p>
          <input className="field" name="name" defaultValue={offer.name} aria-label="Nom" />
          <input className="field" name="shortLabel" defaultValue={offer.shortLabel} aria-label="Libellé court" />
          <input className="field" name="shortDescription" defaultValue={offer.shortDescription} aria-label="Description courte" />
          <textarea className="field" name="description" defaultValue={offer.description} aria-label="Description" />
          <textarea className="field" name="includes" defaultValue={offer.includes.join("\n")} aria-label="Inclus, une ligne par élément" />
          <input className="field" name="priceLabel" defaultValue={offer.priceLabel ?? ""} aria-label="Prix" placeholder="Prix, vide = sur devis" />
          <input className="field" name="delayLabel" defaultValue={offer.delayLabel ?? ""} aria-label="Délai" placeholder="Délai, vide = sur devis" />
          <label><input type="checkbox" name="published" defaultChecked={offer.published} /> Publié</label>
          <button className="btn" type="submit">Enregistrer l'offre</button>
        </form>
      ))}
      <h2 className="serif" style={{ fontSize: 40, marginTop: 48 }}>FAQ</h2>
      {faqRows.map((item) => (
        <div key={item.id} style={{ borderTop: "1px solid var(--line)", padding: "16px 0" }}>
          <p className="serif" style={{ fontSize: 28, margin: 0 }}>{item.question}</p>
          <p className="muted">{item.answer}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <form action={moveFaq}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="direction" value="up" /><button className="btn" type="submit">Monter</button></form>
            <form action={moveFaq}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="direction" value="down" /><button className="btn" type="submit">Descendre</button></form>
            <form action={toggleFaq}>
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="published" value={String(item.published)} />
              <button className="btn" type="submit">{item.published ? "Dépublier" : "Publier"}</button>
            </form>
          </div>
        </div>
      ))}
      <form action={createFaq} style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
        <input className="field" name="question" aria-label="Question" placeholder="Question" />
        <textarea className="field" name="answer" aria-label="Réponse" placeholder="Réponse" />
        <button className="btn" type="submit">Ajouter une question</button>
      </form>
      <h2 className="serif" style={{ fontSize: 40, marginTop: 48 }}>Paramètres</h2>
      <form action={updateSettings} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input className="field" name="contactEmail" defaultValue={settings?.contactEmail ?? ""} aria-label="Email de contact" placeholder="Email de contact" />
        <input className="field" name="bookingUrl" defaultValue={settings?.bookingUrl ?? ""} aria-label="URL de réservation" placeholder="URL de réservation" />
        <input className="field" name="legalName" defaultValue={settings?.legalName ?? ""} aria-label="Raison sociale" placeholder="Raison sociale" />
        <textarea className="field" name="legalAddress" defaultValue={settings?.legalAddress ?? ""} aria-label="Adresse" placeholder="Adresse" />
        <input className="field" name="legalId" defaultValue={settings?.legalId ?? ""} aria-label="Identifiant légal" placeholder="Identifiant légal" />
        <button className="btn" type="submit">Enregistrer les paramètres</button>
      </form>
    </>
  );
}
