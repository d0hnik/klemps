import { useLayoutEffect, useRef, useState } from "react";
import { Title } from "../Title/Title";
import "./players.css";
import { useTranslation } from "react-i18next";
import type { Player } from "../../entities/player";
import { ActivePlayerArrow } from "./ActivePlayerArrow";
import { PlayerRow } from "./PlayerRow";

type Props = {
  players: Player[];
  currentPlayerIndex: number;
};

export function PlayersTab({ players, currentPlayerIndex }: Props) {
  const { t } = useTranslation();

  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [arrowTop, setArrowTop] = useState(0);

  const currentPlayer = players[currentPlayerIndex];

  useLayoutEffect(() => {
    const activeRow = rowRefs.current[currentPlayerIndex];

    if (!activeRow) {
      return;
    }

    const rowMiddle = activeRow.offsetTop + activeRow.offsetHeight / 2;

    setArrowTop(rowMiddle);
  }, [currentPlayerIndex, players.length]);

  return (
    <section
      className="container-border relative box-border w-full max-w-[510px] rounded-xl px-1 sm:px-6 pb-2 sm:pb-4 pt-8 mx-1"
      aria-labelledby="players-heading"
    >
      <Title id="players-heading" title={t("players.players")} level={2} />

      <ol className="relative mb-4 flex flex-col gap-y-3 items-center">
        {currentPlayer && (
          <ActivePlayerArrow top={arrowTop} playerName={currentPlayer.name} />
        )}

        {players.map((player, index) => (
          <PlayerRow
            key={index}
            playerIndex={index + 1}
            player={player}
            isActive={index === currentPlayerIndex}
            rowRef={(node) => {
              rowRefs.current[index] = node;
            }}
          />
        ))}
      </ol>
    </section>
  );
}
