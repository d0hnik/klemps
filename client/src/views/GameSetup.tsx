import { useState } from "react";
import { DifficultyTab } from "../components/Difficulty/DifficultyTab";
import { PlayersTabSetup } from "../components/Players/PlayersTabSetup";
import type { DifficultyName } from "../entities/difficulty/difficulty";
import { createGame } from "../entities/gameState";
import { BackButton } from "../components/Buttons/backButton/BackButton";
import { StartButton } from "../components/Buttons/startButton/startButton";
import { useNavigate } from "react-router-dom";
import { saveGameState } from "../entities/gameStorage";
import { PLAYER_AVATARS, type NewPlayerInput } from "../entities/player";

export function GameSetupView() {
  const navigate = useNavigate();

  const [playerInputs, setPlayerInputs] = useState<NewPlayerInput[]>(() =>
    Array.from({ length: 2 }, () => ({
      name: "",
      avatarSrc: PLAYER_AVATARS[0],
    })),
  );

  function createDefaultPlayerSetup(): NewPlayerInput {
    return {
      name: "",
      avatarSrc: PLAYER_AVATARS[0],
    };
  }

  const [playerCount, setPlayerCount] = useState<number>(2);

  const [difficultyName, setDifficultyName] = useState<DifficultyName>("EASY");

  function handleSetPlayerCount(count: number) {
    setPlayerCount(count);

    setPlayerInputs((currentInputs) =>
      Array.from(
        { length: count },
        (_, index) => currentInputs[index] ?? createDefaultPlayerSetup(),
      ),
    );
  }

  function handleSetPlayerName(playerIndex: number, name: string) {
    const arrayIndex = playerIndex - 1;

    setPlayerInputs((currentInputs) => {
      const nextInputs = [...currentInputs];
      nextInputs[arrayIndex].name = name;
      return nextInputs;
    });
  }

  function handleStartGame(
    players: NewPlayerInput[],
    difficultyName: DifficultyName,
  ) {
    const normalizePlayers = players.map((player, index) => {
      const trimmedName = player.name.trim();

      if (trimmedName != "") {
        return player;
      }

      player.name = `Player ${index + 1}`;

      return player;
    });

    saveGameState(createGame(normalizePlayers, difficultyName));

    navigate("/game");
  }

  return (
    <>
      <div className="flex flex-row justify-evenly">
        <PlayersTabSetup
          playerCount={playerCount}
          onSetPlayerCount={handleSetPlayerCount}
          onSetPlayerName={handleSetPlayerName}
          players={playerInputs}
        />
        <DifficultyTab
          selectedDifficulty={difficultyName}
          onSelectDifficulty={setDifficultyName}
        />
      </div>
      <div className="flex flex-row justify-between mt-10">
        <BackButton
          onClick={() => navigate("/")}
          iconSize={40}
          additionalStyle={"ml-16"}
        />
        <StartButton
          onClick={() => handleStartGame(playerInputs, difficultyName)}
        />
      </div>
    </>
  );
}
