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
        size={48}
        className="hover:scale-110 transition"
      />
    </button>
  );
}
