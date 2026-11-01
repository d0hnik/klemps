import { useTranslation } from "react-i18next";
import type { NewPlayerInput } from "../../entities/player";
import { PLAYER_COUNT_OPTIONS } from "../helpers/players";
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
    <section aria-labelledby="setup-players" className="container-border relative min-w-0 rounded-xl px-3 pt-8 pb-5 sm:px-5">
      <Title id="setup-players" index="1" title={t("players.players")} />
      <ol className="mb-6 flex max-h-96 flex-col gap-3 overflow-y-auto p-1">
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
      <fieldset>
        <legend className="mb-3 text-lg text-white">{t("game.selectPlayers")}</legend>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6">
          {PLAYER_COUNT_OPTIONS.map((count) => (
            <button
              key={count}
              type="button"
              aria-pressed={players.length === count}
              onClick={() => onSetPlayerCount(count)}
              className={`cursor-pointer rounded border-2 py-2 text-2xl ${players.length === count ? "border-amber-300 bg-amber-300 text-teal-950" : "border-cyan-400 bg-cyan-950 text-white hover:bg-cyan-900"}`}
            >
              {count}
            </button>
          ))}
        </div>
      </fieldset>
    </section>
  );
}
