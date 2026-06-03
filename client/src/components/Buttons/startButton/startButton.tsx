import { useTranslation } from "react-i18next";

type Props = {
  onClick: () => void;
};

export function StartButton({ onClick }: Props) {
  const { t } = useTranslation();

  return (
    <button
      className="secondary-pixel-corners w-xl bg-green-600 text-white text-5xl border-8 border-red-700 button-animation mr-10"
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
