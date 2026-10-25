import { IconArrowNarrowLeft } from "@tabler/icons-react";

type Props = {
  onClick: () => void;
  additionalStyle: string | undefined;
  iconSize: number;
};

export function BackButton({ onClick, additionalStyle, iconSize }: Props) {
  return (
    <button
      className={`
    secondary-pixel-corners
    button-animation
    bg-[var(--color-bg)]
    w-[215px]
    flex
    justify-center
    items-center
    cursor-pointer
    text-[40px]
    text-white
    brightness-[0.85]
    [--border-color:var(--color-cyan)]
    ${additionalStyle}
  `}
      type="button"
      onClick={onClick}
    >
      <IconArrowNarrowLeft stroke={2} size={iconSize} /> BACK
    </button>
  );
}
