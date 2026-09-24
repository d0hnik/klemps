import type { PlayerDrinksButtonType } from "../../entities/constants";
import { PLAYER_DRINKS_BUTTON_CONFIG } from "../helpers/constants";

type Props = {
  onClick: () => void;
  type: PlayerDrinksButtonType;
};

export function PlayerDrinksButton({ onClick, type }: Props) {
  const config = PLAYER_DRINKS_BUTTON_CONFIG[type];

  return (
    <button
      className={`
    secondary-pixel-corners
    button-animation
    w-10
    h-10
    flex
    justify-center
    items-center
    cursor-pointer
    ${config.borderColor}
  `}
      type="button"
      onClick={onClick}
    >
      {config.icon}
    </button>
  );
}
