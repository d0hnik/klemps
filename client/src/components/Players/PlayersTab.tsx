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
  const listRef = useRef<HTMLDivElement>(null);

  const currentPlayer = players[currentPlayerIndex];

  useLayoutEffect(() => {
    const activeRow = rowRefs.current[currentPlayerIndex];

    if (!activeRow) {
      return;
    }

    const rowMiddle = activeRow.offsetTop + activeRow.offsetHeight / 2;

    setArrowTop(rowMiddle);

    const list = listRef.current;
    if (!list) return;

    const rowBottom = activeRow.offsetTop + activeRow.offsetHeight;
    if (activeRow.offsetTop < list.scrollTop) {
      list.scrollTo({ top: activeRow.offsetTop, behavior: "smooth" });
    } else if (rowBottom > list.scrollTop + list.clientHeight) {
      list.scrollTo({ top: rowBottom - list.clientHeight, behavior: "smooth" });
    }
  }, [currentPlayerIndex, players.length]);

  return (
    <section
      className="container-border relative mx-auto w-full min-w-0 max-w-[510px] rounded-xl px-1 pt-8 pb-2 sm:px-3 sm:pb-4"
      aria-labelledby="players-heading"
    >
      <Title id="players-heading" title={t("players.players")} level={2} />

      <div ref={listRef} className="game-player-list max-h-76 overflow-y-auto pr-1 pl-3 sm:pl-5">
        <ol className="relative flex flex-col gap-2">
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
