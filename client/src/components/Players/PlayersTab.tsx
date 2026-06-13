import { Title } from "../Title/Title";
import "./players.css";
import { useTranslation } from "react-i18next";
import { PlayerRow } from "./PlayersRow";
import type { Player } from "../../entities/player";

type Props = {
  players: Player[];
  currentPlayerIndex: number;
};

const PLAYER_ROW_HEIGHT = 83;
const PLAYER_ROW_GAP = 24;

export function PlayersTab({ players, currentPlayerIndex }: Props) {
  const { t } = useTranslation();

  const currentPlayer = players[currentPlayerIndex];

  const arrowTop =
    currentPlayerIndex * (PLAYER_ROW_HEIGHT + PLAYER_ROW_GAP) +
    PLAYER_ROW_HEIGHT / 2;

  return (
    <section className="players-tab relative box-border w-full max-w-[510px] rounded-xl px-6 pb-6 pt-8">
      <Title title={t("players.players")} />

      <div className="relative mb-4 flex flex-col gap-y-3">
        {currentPlayer && (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-[-25px] z-50 -translate-y-1/2 transition-[top] duration-300 ease-out"
              style={{
                top: `${arrowTop}px`,
              }}
            >
              <img
                src="/icons/arrowRight.svg"
                alt=""
                className="active-player-arrow h-11 w-11 object-contain"
              />
            </div>

            <span className="sr-only" aria-live="polite">
              {currentPlayer.name}
            </span>
          </>
        )}

        {players.map((player, index) => (
          <PlayerRow key={index} playerIndex={index + 1} player={player} />
        ))}
      </div>
    </section>
  );
}
