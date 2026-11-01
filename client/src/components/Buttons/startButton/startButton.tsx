import { useTranslation } from "react-i18next";

type Props = {
  onClick: () => void;
};

export function StartButton({ onClick }: Props) {
  const { t } = useTranslation();

  return (
    <button
      className="secondary-pixel-corners w-full max-w-xl bg-green-600 text-white border-8 border-red-700 button-animation min-h-14 text-2xl sm:text-4xl lg:text-5xl"
      type="button"
      style={
        {
          "--border-color": "lime",
        } as React.CSSProperties
      }
      onClick={onClick}
    >
      {t("game.startGame")}
    </button>
  );
}
