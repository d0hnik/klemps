import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { HowToPlayModal } from "../components/Modals/HowToPlayModal";

export function MainMenuView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [rulesOpen, setRulesOpen] = useState(false);

  return (
    <section className="mx-auto mb-12 flex max-w-5xl flex-col items-center gap-10 px-6 text-white md:flex-row">
      <div
        aria-hidden="true"
        className="order-last w-full overflow-hidden rounded-2xl border-2 border-amber-300 bg-black/10 p-6 text-center md:order-first md:w-1/2"
      >
        <p className="text-sm tracking-widest text-teal-100 uppercase">
          {t("home.tableCaption")}
        </p>
        <div className="relative mx-auto my-4 h-64 w-60">
          <img src="/cards/k-spade.png" alt="" width="256" height="256" className="absolute top-2 -left-6 size-56 -rotate-15" />
          <img src="/cards/back.png" alt="" width="512" height="512" className="absolute top-2 left-6 size-56 rotate-15" />
          <img src="/cards/a-heart.png" alt="" width="256" height="256" className="absolute top-6 left-2 size-56 -rotate-3" />
        </div>
        <span className="text-2xl text-amber-300">♦</span>
      </div>

      <div className="w-full text-center md:w-1/2 md:text-left">
        <p className="mb-4 text-xs tracking-widest text-teal-200 uppercase">
          {t("home.eyebrow")}
        </p>
        <h1 className="text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl">
          {t("home.title")}<br />
          <span className="text-amber-300">{t("home.titleAccent")}</span>
        </h1>
        <p className="my-6 text-lg leading-relaxed text-teal-100">
          {t("home.description")}
        </p>
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => navigate("/setup")}
            className="cursor-pointer rounded border-2 border-amber-200 bg-amber-300 px-6 py-3 text-2xl text-teal-950 hover:bg-amber-200"
          >
            {t("home.playGame")}
          </button>
          <button
            type="button"
            onClick={() => setRulesOpen(true)}
            className="cursor-pointer rounded border-2 border-cyan-400 bg-cyan-950 px-6 py-3 text-2xl text-cyan-100 hover:bg-cyan-900"
          >
            {t("home.howToPlay")}
          </button>
        </div>
        <p className="mt-6 text-sm text-teal-200">{t("home.note")}</p>
      </div>

      <HowToPlayModal open={rulesOpen} onClose={() => setRulesOpen(false)} />
    </section>
  );
}
