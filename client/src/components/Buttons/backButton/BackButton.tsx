import { IconArrowNarrowLeft } from "@tabler/icons-react";
import "./backButton.css";

type Props = {
  onClick: () => void;
  additionalStyle: string | undefined;
  iconSize: number;
};

export function BackButton({ onClick, additionalStyle, iconSize }: Props) {
  return (
    <button
      className={`secondary-pixel-corners back-button button-animation ${additionalStyle}`}
      style={
        {
          "--border-color": "#00fbff",
        } as React.CSSProperties
      }
      type="button"
      onClick={onClick}
    >
      <IconArrowNarrowLeft stroke={2} size={iconSize} /> BACK
    </button>
  );
}
