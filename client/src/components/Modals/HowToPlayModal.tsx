import { useEffect, useId, useRef, type MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { ROUND_ORDER } from "../../entities/roundType";

type HowToPlayModalProps = {
  onClose: () => void;
};

export function HowToPlayModal({ onClose }: HowToPlayModalProps) {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const introId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!dialog.open) dialog.showModal();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget) return;

    // Only dismiss clicks outside the dialog, not clicks on its padding.
    const { left, right, top, bottom } = event.currentTarget.getBoundingClientRect();
    if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) {
      event.currentTarget.close();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={introId}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="m-auto max-h-[calc(100dvh-40px)] w-[calc(100%-32px)] max-w-[540px] overflow-y-auto overscroll-contain rounded-lg border-3 border-[var(--color-panel)] bg-[#082a33] p-[22px] text-base leading-[1.4] text-[var(--color-card)] shadow-[8px_8px_0_#00181e] backdrop:bg-[#001318db] md:p-7 md:text-lg md:leading-[1.45]"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-[11px] tracking-[1.1px] text-[#8ed3d2] uppercase md:text-[13px] md:tracking-[1.7px]">
          {t("home.rules.eyebrow")}
        </p>
        <form method="dialog">
          <button
            type="submit"
            aria-label={t("home.rules.close")}
            autoFocus
            className="size-9 cursor-pointer border-2 border-[#51bfc8] bg-[#102f41] text-[26px] leading-none focus-visible:outline-3 focus-visible:outline-offset-5 focus-visible:outline-[var(--color-card)]"
          >
            <span aria-hidden="true">×</span>
          </button>
        </form>
      </div>
      <h2 id={titleId} className="mt-2 mb-3 text-4xl leading-[1.1] text-[var(--color-panel)]">
        {t("home.howToPlay")}
      </h2>
      <p id={introId}>{t("home.rules.intro")}</p>
      <ol className="my-5 grid list-none gap-3.5 p-0 md:my-6 md:gap-[18px]">
        {ROUND_ORDER.map((round, index) => (
          <li key={round} className="flex items-start gap-4">
            <span aria-hidden="true" className="text-2xl leading-tight text-[var(--color-panel)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="mb-[3px] text-[19px] leading-tight md:text-[21px]">
                {t(`guess.title.${round}`)}
              </h3>
              <p className="text-[#c4d7ce]">{t(`home.rules.rounds.${round}`)}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="border-t border-[#42616a] pt-[18px]">{t("home.rules.outcome")}</p>
      <p className="mt-3 mb-6 text-[15px] text-[#8ed3d2]">{t("home.rules.note")}</p>
      <form method="dialog">
        <button
          type="submit"
          className="flex min-h-[58px] w-full cursor-pointer items-center justify-center rounded-[3px] border-2 border-[#ffe3a0] bg-[var(--color-panel)] px-6 py-2.5 text-[25px] leading-tight text-[#102c34] shadow-[0_5px_0_#9d6d23,0_8px_0_#00181e] transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-5 focus-visible:outline-[var(--color-card)] active:translate-y-0.5 motion-reduce:transition-none"
        >
          {t("home.rules.done")}
        </button>
      </form>
    </dialog>
  );
}
