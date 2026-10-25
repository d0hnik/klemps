import { useTranslation } from "react-i18next";

type Props = {
  onClick: () => void;
  disabled?: boolean;
};

export function ContinueButton({ onClick, disabled = false }: Props) {
  const { t } = useTranslation();

  const borderColor = disabled
    ? "[--border-color:var(--color-very-dark-gray)]"
    : "bg-[var(--color-bg)]";

  return (
    <button
      type="button"
      className={`
        flex 
        justify-center 
        ${disabled ? "" : "button-animation "}
        items-center 
        text-2xl 
        text-white 
        pixel-corners 
        min-h-[50px] 
        min-w-[140px] 
        w-80 
        ${borderColor}
        `}
      onClick={onClick}
      disabled={disabled}
    >
      {t("game.continue")}
    </button>
  );
}
