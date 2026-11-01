import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ROUND_ORDER } from "../../entities/roundType";

type HowToPlayModalProps = {
  open: boolean;
  onClose: () => void;
};

export function HowToPlayModal({ open, onClose }: HowToPlayModalProps) {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="rules-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="m-auto max-h-[90dvh] w-11/12 max-w-lg overflow-y-auto rounded-xl border-2 border-amber-300 bg-cyan-950 text-white backdrop:bg-black/70"
    >
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="rules-title" className="text-3xl text-amber-300">
            {t("home.howToPlay")}
          </h2>
          <button type="button" onClick={onClose} aria-label={t("home.rules.close")} className="cursor-pointer px-2 text-3xl">
            ×
          </button>
        </div>
        <p>{t("home.rules.intro")}</p>
        <ol className="my-6 list-decimal space-y-4 pl-6">
          {ROUND_ORDER.map((round) => (
            <li key={round}>
              <h3 className="text-lg text-amber-300">{t(`guess.title.${round}`)}</h3>
              <p className="text-teal-100">{t(`home.rules.rounds.${round}`)}</p>
            </li>
          ))}
        </ol>
        <p>{t("home.rules.outcome")}</p>
        <p className="my-4 text-sm text-teal-200">{t("home.rules.note")}</p>
        <button
          type="button"
          onClick={onClose}
          className="w-full cursor-pointer rounded bg-amber-300 py-3 text-xl text-teal-950 hover:bg-amber-200"
        >
          {t("home.rules.done")}
        </button>
      </div>
    </dialog>
  );
}
