import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function SetupSeo() {
  const { t, i18n } = useTranslation();
  const title = t("setupSeo.title");
  const description = t("setupSeo.description");
  const language = i18n.resolvedLanguage || "en";

  useEffect(() => {
    const oldTitle = document.title;
    const oldLanguage = document.documentElement.lang;
    document.title = title;
    document.documentElement.lang = language;

    const updates = [
      ['meta[name="description"]', description],
      ['meta[property="og:title"]', title],
      ['meta[property="og:description"]', description],
      ['meta[name="twitter:title"]', title],
      ['meta[name="twitter:description"]', description],
    ];
    const restoreMetadata = updates.map(([selector, value]) => {
      const meta = document.querySelector<HTMLMetaElement>(selector);
      const oldContent = meta?.content || "";
      if (meta) meta.content = value;
      return () => { if (meta) meta.content = oldContent; };
    });

    return () => {
      document.title = oldTitle;
      document.documentElement.lang = oldLanguage;
      restoreMetadata.forEach((restore) => restore());
    };
  }, [title, description, language]);

  return <h1 className="sr-only">{t("setupSeo.heading")}</h1>;
}
