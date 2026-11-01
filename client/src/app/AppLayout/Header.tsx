import { useState } from "react";
import { SettingsButton } from "../../components/Settings/SettingsButton";
import Logo from "../../components/Logo/Logo";
import { SettingsModal } from "../../components/Settings/SettingsModal";

export function Header() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <header className="mb-10 flex items-center justify-between gap-3 px-4 py-3 sm:grid sm:grid-cols-[1fr_auto_1fr]">
        <div aria-hidden="true" className="hidden sm:block" />

        <Logo />

        <div className="flex shrink-0 justify-end">
          <SettingsButton onClick={() => setSettingsOpen(true)} />
        </div>
      </header>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
