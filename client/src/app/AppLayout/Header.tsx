import { useState } from "react";
import { SettingsButton } from "../../components/Settings/SettingsButton";
import Logo from "../../components/Logo/Logo";
import { SettingsModal } from "../../components/Settings/SettingsModal";

export function Header() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <header className="mb-10 grid grid-cols-[1fr_auto_1fr] items-center px-4 py-3">
        <div aria-hidden="true" />

        <Logo />

        <div className="flex justify-end">
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
