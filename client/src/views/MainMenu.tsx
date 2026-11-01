import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { HowToPlayModal } from "../components/Modals/HowToPlayModal";
import "@fontsource/pixelify-sans/400.css";
import "@fontsource/pixelify-sans/700.css";

const decorativeCards = [
  { src: "/cards/k-spade.png", size: 256, className: "-left-[39px] top-1 -rotate-19" },
  { src: "/cards/back.png", size: 512, className: "-right-10 top-1 rotate-19" },
  { src: "/cards/a-heart.png", size: 256, className: "left-[22px] top-6 -rotate-3" },
];

export function MainMenuView() {
  const { t } = useTranslation();
  const [rulesOpen, setRulesOpen] = useState(false);

  return (
    <section
      aria-labelledby="landing-title"
      className="mx-auto mb-12 grid grid-cols-1 w-[calc(100%-40px)] max-w-[460px] items-center gap-8 text-[var(--color-card)] md:mt-3 md:mb-20 md:w-[calc(100%-48px)] md:max-w-[1040px] md:grid-cols-[1fr_1.1fr] md:gap-16"
    >
      <div
        aria-hidden="true"
        className="relative row-start-2 grid min-h-[260px] place-items-center overflow-hidden rounded-[28px] border-3 border-[var(--color-panel)] bg-[#073039] shadow-[inset_0_0_0_7px_#062f36,inset_0_0_0_9px_#f6c45330,0_8px_0_#00181e] md:row-start-auto md:min-h-[390px]"
      >
        <span className="absolute top-3.5 text-xs tracking-[2px] text-[#c4d7ce] uppercase md:top-6 md:text-sm">
          {t("home.tableCaption")}
        </span>
        <div className="relative h-60 w-[300px] scale-[.78] md:h-[260px] md:scale-[.85] lg:scale-100">
          {decorativeCards.map(({ src, size, className }) => (
            <img
              key={src}
              src={src}
              alt=""
              width={size}
              height={size}
              className={`absolute size-64 object-contain [image-rendering:pixelated] drop-shadow-[0_8px_0_#00181e80] ${className}`}
            />
          ))}
        </div>
        <span className="absolute bottom-2 text-xl text-[var(--color-panel)] md:bottom-4 md:text-[26px]">♦</span>
      </div>

      <div className="text-center md:text-left">
        <p className="mb-4 text-[11px] tracking-[1.1px] text-[#8ed3d2] uppercase md:text-[13px] md:tracking-[1.7px]">
          {t("home.eyebrow")}
        </p>
        <h1
          id="landing-title"
          className="text-[clamp(42px,10vw,60px)] leading-[1.02] font-bold tracking-[-1.5px] text-shadow-[3px_4px_0_#00181e] md:text-[clamp(44px,5.3vw,66px)]"
        >
          {t("home.title")}<br />
          <span className="text-[var(--color-panel)]">{t("home.titleAccent")}</span>
        </h1>
        <p className="mx-auto mt-5 mb-6 max-w-[400px] text-lg leading-normal text-[#c4d7ce] md:mx-0 md:mt-6 md:mb-7 md:text-xl">
          {t("home.description")}
        </p>
        <div className="mx-auto flex flex-col gap-3.5 md:mx-0 md:max-w-[340px]">
          <Link
            to="/setup"
            className="flex min-h-[58px] cursor-pointer items-center justify-center gap-5 rounded-[3px] border-2 border-[#ffe3a0] bg-[var(--color-panel)] px-6 py-2.5 text-[25px] leading-tight text-[#102c34] shadow-[0_5px_0_#9d6d23,0_8px_0_#00181e] transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-5 focus-visible:outline-[var(--color-card)] active:translate-y-0.5 motion-reduce:transition-none"
          >
            <span>{t("home.playGame")}</span>
            <span aria-hidden="true" className="ml-auto">→</span>
          </Link>
          <button
            type="button"
            onClick={() => setRulesOpen(true)}
            className="flex min-h-[58px] cursor-pointer items-center justify-center rounded-[3px] border-2 border-[#51bfc8] bg-[#102f41] px-6 py-2.5 text-[25px] leading-tight text-[#b5f1f0] shadow-[0_4px_0_#00181e] transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-5 focus-visible:outline-[var(--color-card)] active:translate-y-0.5 motion-reduce:transition-none"
          >
            {t("home.howToPlay")}
          </button>
        </div>
        <p className="mt-[22px] text-[15px] text-[#8aaeb0]">{t("home.note")}</p>
      </div>

      {rulesOpen && <HowToPlayModal onClose={() => setRulesOpen(false)} />}
    </section>
  );
}
