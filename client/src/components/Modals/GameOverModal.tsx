import type { CSSProperties } from "react";
import { IconTrophy } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import type { GameState } from "../../entities/gameState";
import { GameModal } from "./GameModal";

type Props = {
  gameState: GameState;
  saveError: boolean;
  onPlayAgain: () => void;
  onMainMenu: () => void;
};

export function GameOverModal({ gameState, saveError, onPlayAgain, onMainMenu }: Props) {
  const { t } = useTranslation();
  const totalGiven = gameState.players.reduce((total, player) => total + player.drinksGiven, 0);
  const totalTaken = gameState.players.reduce((total, player) => total + player.drinksTaken, 0);

  const footer = (
    <>
      {saveError && <p role="alert" className="mb-4 text-red-200">{t("drinkAllocation.saveError")}</p>}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onPlayAgain}
          className="secondary-pixel-corners min-h-12 w-full cursor-pointer bg-green-500 px-2 py-3 text-base font-bold text-green-950 hover:bg-green-400"
          style={{ "--border-color": "#86efac" } as CSSProperties}
        >{t("gameOver.playAgain")}</button>
        <button
          type="button"
          onClick={onMainMenu}
          className="secondary-pixel-corners min-h-12 w-full cursor-pointer bg-cyan-950 px-2 py-3 text-base text-cyan-100 hover:bg-cyan-900"
          style={{ "--border-color": "#67e8f9" } as CSSProperties}
        >{t("gameOver.mainMenu")}</button>
      </div>
    </>
  );

  return (
    <GameModal title={t("gameOver.title")} footer={footer}>
      <div className="mb-5 flex flex-col items-center gap-2 text-center">
        <IconTrophy size={48} className="text-amber-300" aria-hidden="true" />
        <p className="text-cyan-100">{t("gameOver.summary", { count: gameState.players.length })}</p>
      </div>
      <div className="mb-5 grid grid-cols-2 gap-3 text-center">
        <div className="bg-red-950 p-3">
          <p className="text-sm text-red-200">{t("drinks.given")}</p>
          <p className="text-4xl tabular-nums">{totalGiven}</p>
        </div>
        <div className="bg-blue-950 p-3">
          <p className="text-sm text-blue-200">{t("drinks.taken")}</p>
          <p className="text-4xl tabular-nums">{totalTaken}</p>
        </div>
      </div>
      <table className="w-full table-fixed text-left text-sm sm:text-base">
        <caption className="sr-only">{t("gameOver.statistics")}</caption>
        <thead className="text-cyan-200">
          <tr>
            <th scope="col" className="w-1/2 pb-3 font-normal">{t("players.players")}</th>
            <th scope="col" className="pb-3 text-center font-normal">{t("drinks.given")}</th>
            <th scope="col" className="pb-3 text-center font-normal">{t("drinks.taken")}</th>
          </tr>
        </thead>
        <tbody>
          {gameState.players.map((player) => (
            <tr key={player.id} className="border-t border-white/10">
              <th scope="row" className="py-3 pr-2 font-normal">
                <div className="flex min-w-0 items-center gap-2">
                  <img src={player.avatarSrc} alt="" className="size-8 shrink-0 object-contain" />
                  <span title={player.name} className="truncate">{player.name}</span>
                </div>
              </th>
              <td className="text-center text-red-200 tabular-nums">{player.drinksGiven}</td>
              <td className="text-center text-blue-200 tabular-nums">{player.drinksTaken}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="my-5 border-t border-amber-300/30 pt-4 text-center text-amber-200">{t("gameOver.joke")}</p>
    </GameModal>
  );
}
