import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function GameSeo() {
  const { t, i18n } = useTranslation();
  const title = t("gameSeo.title");
  const description = t("gameSeo.description");
  const language = i18n.resolvedLanguage || "en";

  useEffect(() => {
    const oldTitle = document.title;
    const oldLanguage = document.documentElement.lang;
    const oldRobots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const robots = oldRobots || document.createElement("meta");
    const oldRobotsContent = robots.content;
    robots.name = "robots";
    robots.content = "noindex, follow";
    if (!oldRobots) document.head.appendChild(robots);
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
      if (oldRobots) robots.content = oldRobotsContent;
      else robots.remove();
      document.title = oldTitle;
      document.documentElement.lang = oldLanguage;
      restoreMetadata.forEach((restore) => restore());
    };
  }, [title, description, language]);

  return <h1 className="sr-only">{t("gameSeo.heading")}</h1>;
}
