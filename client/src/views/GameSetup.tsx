import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DifficultyTab } from "../components/Difficulty/DifficultyTab";
import { PlayersTabSetup } from "../components/Players/PlayersTabSetup";
import { StartButton } from "../components/Buttons/startButton/startButton";
import { getDefaultAvatarIndex, getNextAvatarIndex } from "../components/helpers/players";
import type { DifficultyName } from "../entities/difficulty/difficulty";
import { createGame } from "../entities/gameState";
import { saveGameState } from "../entities/gameStorage";
import { PLAYER_AVATARS, type NewPlayerInput } from "../entities/player";

function createDefaultPlayer(index: number): NewPlayerInput {
  return { name: "", avatarSrc: PLAYER_AVATARS[getDefaultAvatarIndex(index)] };
}

export function GameSetupView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [players, setPlayers] = useState(() => Array.from({ length: 2 }, (_, index) => createDefaultPlayer(index)));
  const [difficultyName, setDifficultyName] = useState<DifficultyName>("EASY");
  const [error, setError] = useState("");

  function handleSetPlayerCount(count: number) {
    setPlayers((current) => Array.from({ length: count }, (_, index) => current[index] ?? createDefaultPlayer(index)));
  }

  function handleSetPlayerName(playerIndex: number, name: string) {
    setPlayers((current) => current.map((player, index) =>
      index === playerIndex - 1 ? { ...player, name } : player,
    ));
  }

  function handleChangeAvatar(playerIndex: number, direction: "left" | "right") {
    setPlayers((current) => current.map((player, index) => {
      if (index !== playerIndex - 1) return player;
      const avatarIndex = PLAYER_AVATARS.findIndex((src) => src === player.avatarSrc);
      const nextIndex = getNextAvatarIndex(avatarIndex, direction);
      return { ...player, avatarSrc: PLAYER_AVATARS[nextIndex] };
    }));
  }

  function handleStartGame() {
    const normalizedPlayers = players.map((player, index) => ({
      ...player,
      name: player.name.trim() || `${t("players.player")} ${index + 1}`,
    }));

    try {
      saveGameState(createGame(normalizedPlayers, difficultyName));
    } catch {
      setError(t("setup.saveError"));
      return;
    }
    navigate("/game");
  }

  return (
    <>
      <div className="flex flex-col items-center gap-10 px-2 lg:flex-row lg:justify-evenly lg:gap-6 lg:px-4">
        <PlayersTabSetup
          players={players}
          onSetPlayerCount={handleSetPlayerCount}
          onSetPlayerName={handleSetPlayerName}
          onChangeAvatar={handleChangeAvatar}
        />
        <DifficultyTab selectedDifficulty={difficultyName} onSelectDifficulty={setDifficultyName} />
      </div>
      {error && <p role="alert" className="mt-6 text-center text-red-300">{error}</p>}
      <div className="mt-10 mb-6 px-2">
        <StartButton onClick={handleStartGame} />
      </div>
    </>
  );
}
