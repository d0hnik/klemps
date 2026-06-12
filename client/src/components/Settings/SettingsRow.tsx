type SettingRowProps = {
  label: string;
  onClickFirst: () => void;
  onClickSecond: () => void;
};

export function SettingsRow({
  label,
  onClickFirst,
  onClickSecond,
}: SettingRowProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <p className="text-3xl">{label}</p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClickFirst}
          className="secondary-pixel-corners text-2xl bg-[var(--color-green)] color-white w-20"
        >
          ON
        </button>
        <button
          type="button"
          onClick={onClickSecond}
          className="secondary-pixel-corners text-2xl bg-[var(--color-border)] color-white w-25"
        >
          OFF
        </button>
      </div>
    </div>
  );
}
