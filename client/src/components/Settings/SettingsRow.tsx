type SettingRowProps = {
  label: string;
  onClickFirst: () => void;
  onClickSecond: () => void;
  firstButtonLabel?: string;
  secondButtonLabel?: string;
};

export function SettingsRow({
  label,
  onClickFirst,
  onClickSecond,
  firstButtonLabel = "On",
  secondButtonLabel = "Off",
}: SettingRowProps) {
  return (
    <div className="border-b-1 pb-2 border-[var(--color-panel)] flex w-full items-center justify-between">
      <p className="text-2xl">{label}</p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClickFirst}
          className="secondary-pixel-corners text-2xl bg-[var(--color-green)] color-white w-20"
        >
          {firstButtonLabel}
        </button>
        <button
          type="button"
          onClick={onClickSecond}
          className="secondary-pixel-corners text-2xl bg-[var(--color-border)] color-white w-25"
        >
          {secondButtonLabel}
        </button>
      </div>
    </div>
  );
}
