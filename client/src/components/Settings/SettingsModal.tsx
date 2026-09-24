import { SettingsRow } from "./SettingsRow";

type SettingsModalProps = {
  open: boolean;
  onClose: () => void;
};

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  if (!open) {
    return;
  }

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/60 px-4
      "
      aria-label="Open settings"
      onClick={onClose}
    >
      <div
        className="
          w-full max-w-md
          rounded-2xl border-2 border-[var(--color-panel)]
          bg-[var(--color-dark-bg)] p-6 text-white
          shadow-2xl
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center mb-5">
          <div></div>
          <div className="text-3xl text-bold">SETTINGS</div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="cursor-pointer">
              <p
                className="
                    text-white text-2xl
                    bg-red-600 w-8 h-8
                    flex justify-center items-center rounded
                    border-2 border-[var(--color-panel)]
            "
              >
                X
              </p>
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <SettingsRow
            label={"Sound"}
            onClickFirst={function (): void {
              throw new Error("Function not implemented.");
            }}
            onClickSecond={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
          <SettingsRow
            label={"Music"}
            onClickFirst={function (): void {
              throw new Error("Function not implemented.");
            }}
            onClickSecond={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
          <SettingsRow
            label={"Language"}
            onClickFirst={function (): void {
              throw new Error("Function not implemented.");
            }}
            onClickSecond={function (): void {
              throw new Error("Function not implemented.");
            }}
            firstButtonLabel="Eesti"
            secondButtonLabel="English"
          />
        </div>
      </div>
    </div>
  );
}
