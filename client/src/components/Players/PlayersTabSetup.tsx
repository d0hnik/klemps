import { useTranslation } from "react-i18next";
import type { NewPlayerInput } from "../../entities/player";
import { PLAYER_COUNT_OPTIONS } from "../helpers/players";
import { MainButton } from "../Buttons/MainButton";
import { Title } from "../Title/Title";
import { PlayerRowSetup } from "./PlayerRowSetup";
import "./players.css";

type Props = {
  onSetPlayerCount: (count: number) => void;
  onSetPlayerName: (playerIndex: number, name: string) => void;
  onChangeAvatar: (playerIndex: number, direction: "left" | "right") => void;
  players: NewPlayerInput[];
};

export function PlayersTabSetup({ players, onSetPlayerCount, onSetPlayerName, onChangeAvatar }: Props) {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="setup-players" className="container-border relative w-full max-w-[510px] min-w-0 rounded-xl pt-7 pb-6 lg:flex-1 lg:px-6 lg:pt-8">
      <Title id="setup-players" index="1" title={t("players.players")} />
      <ol className="mb-4 flex h-64 flex-col items-center gap-3 overflow-y-auto">
        {players.map((player, index) => (
          <PlayerRowSetup
            key={index}
            playerIndex={index + 1}
            playerName={player.name}
            avatarSrc={player.avatarSrc}
            onNameChange={(name) => onSetPlayerName(index + 1, name)}
            onPreviousAvatar={() => onChangeAvatar(index + 1, "left")}
            onNextAvatar={() => onChangeAvatar(index + 1, "right")}
          />
        ))}
      </ol>
      <fieldset className="px-2 lg:px-0">
        <legend className="text-xl text-white">{t("game.selectPlayers")}</legend>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {PLAYER_COUNT_OPTIONS.map((count) => (
            <MainButton
              key={count}
              text={String(count)}
              active={players.length === count}
              onClick={() => onSetPlayerCount(count)}
            />
          ))}
        </div>
      </fieldset>
    </section>
  );
}
