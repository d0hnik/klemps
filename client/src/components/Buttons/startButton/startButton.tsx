import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

type Props = {
  onClick: () => void;
};

export function StartButton({ onClick }: Props) {
  const { t } = useTranslation();

  return (
    <button
      className="secondary-pixel-corners button-animation flex min-h-14 cursor-pointer w-full max-w-sm items-center justify-center gap-3 bg-green-500 px-6 py-3 text-2xl font-bold text-green-950 hover:bg-green-400 focus-visible:brightness-125 sm:text-3xl"
      type="button"
      style={
        {
          "--border-color": "#86efac",
        } as React.CSSProperties
      }
      onClick={onClick}
    >
      <IconPlayerPlayFilled size={24} aria-hidden="true" />
      {t("game.startGame")}
    </button>
  );
}
