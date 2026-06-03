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
        <div className="grid grid-cols-[1fr_auto_1fr] items-center ">
          <div></div>
          <div className="text-2xl text-bold">SETTINGS</div>
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
      </div>
    </div>
  );
}
