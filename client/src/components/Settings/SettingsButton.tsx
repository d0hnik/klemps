import { IconSettings } from "@tabler/icons-react";

type SettingsButtonProps = {
  onClick: () => void;
};

export function SettingsButton({ onClick }: SettingsButtonProps) {
  return (
    <button
      type="button"
      className="rounded-lg p-2 border-2 border-[var(--color-panel)] cursor-pointer"
      aria-label="Open settings"
      onClick={onClick}
    >
      <IconSettings
        stroke={2}
        color="white"
        className="h-8 w-8 sm:h-12 sm:w-12 hover:scale-110 transition"
      />
    </button>
  );
}
