import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

export function PageMetadata() {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();
  const isSetup = pathname === "/setup" || pathname === "/setup/";
  const page = isSetup ? "setup" : "home";
  const title = t(`${page}.seoTitle`);
  const description = t(`${page}.seoDescription`);
  const language = i18n.resolvedLanguage || "en";

  useEffect(() => {
    document.title = title;
    document.documentElement.lang = language;

    for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) {
      document.querySelector(selector)?.setAttribute("content", title);
    }
    for (const selector of ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]']) {
      document.querySelector(selector)?.setAttribute("content", description);
    }
  }, [title, description, language]);

  return null;
}
