import type { PlayerDrinksButtonType } from "../../entities/constants";
import { PLAYER_DRINKS_BUTTON_CONFIG } from "../helpers/constants";

type Props = {
  onClick: () => void;
  type: PlayerDrinksButtonType;
  disabled?: boolean;
};

export function PlayerDrinksButton({ onClick, type, disabled = false }: Props) {
  const config = PLAYER_DRINKS_BUTTON_CONFIG[type];

  const borderColor = disabled
    ? "[--border-color:var(--color-very-dark-gray)]"
    : config.borderColor;

  const iconColor = disabled ? "gray" : config.iconColor;

  const Icon = config.Icon;

  return (
    <button
      className={`
    secondary-pixel-corners
    w-10
    ${disabled ? "cursor-not-allowed" : "button-animation cursor-pointer"}
    h-10
    flex
    justify-center
    items-center
    ${borderColor}
  `}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      <Icon size={24} color={iconColor} />
    </button>
  );
}
