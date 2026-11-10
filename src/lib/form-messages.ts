import type { Locale } from "@/lib/locale";

export const formErrors: Record<Locale, Record<"name" | "email" | "offer" | "stack" | "message" | "consent", string>> = {
  fr: {
    name: "Indiquez un nom (2 à 120 caractères).",
    email: "Indiquez un email valide.",
    offer: "Choisissez une offre.",
    stack: "200 caractères maximum.",
    message: "Décrivez votre problème (10 à 4000 caractères).",
    consent: "Le consentement est obligatoire.",
  },
  en: {
    name: "Enter a name (2 to 120 characters).",
    email: "Enter a valid email.",
    offer: "Choose an offer.",
    stack: "200 characters maximum.",
    message: "Describe your problem (10 to 4000 characters).",
    consent: "Consent is required.",
  },
  ar: {
    name: "اكتب اسماً (من حرفين إلى 120).",
    email: "اكتب بريداً إلكترونياً صالحاً.",
    offer: "اختر عرضاً.",
    stack: "200 حرف كحد أقصى.",
    message: "صف المشكلة (من 10 إلى 4000 حرف).",
    consent: "الموافقة إلزامية.",
  },
};
