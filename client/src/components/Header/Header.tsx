import { useState } from "react";
import Logo from "../Logo/Logo";
import { SettingsButton } from "../Settings/SettingsButton";
import { SettingsModal } from "../Settings/SettingsModal";

export function Header() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <header className="grid grid-cols-[1fr_auto_1fr] items-center px-4 py-3 mb-10">
        <div></div>
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
