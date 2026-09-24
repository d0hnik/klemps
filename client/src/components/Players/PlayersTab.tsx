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

    activeRow.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [currentPlayerIndex, players.length]);

  return (
    <section
      className="container-border relative box-border mb-3 mx-1 w-[98%] max-w-[510px] rounded-xl px-1 pb-2 pt-8 sm:w-full sm:px-6 sm:pb-4"
      aria-labelledby="players-heading"
    >
      <Title id="players-heading" title={t("players.players")} level={2} />

      <div className="max-h-[260px] overflow-y-auto pr-2 overflow-visible pr-0 sm:max-h-[360px] md:max-h-[360px]">
        <ol className="relative mb-4 flex flex-col items-center gap-y-3">
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
      </div>
    </section>
  );
}
