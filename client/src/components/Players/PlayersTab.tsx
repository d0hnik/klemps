import { Title } from "../Title/Title";
import "./players.css";
import { useTranslation } from "react-i18next";
import { PlayerRow } from "./PlayersRow";
import type { Player } from "../../entities/player";

type Props = {
  players: Player[];
};

export function PlayersTab({ players }: Props) {
  const { t } = useTranslation();

  return (
    <section className="players-tab relative box-border rounded-xl pt-8 px-6 pb-6 w-full max-w-[510px]">
      <Title title={t("players.players")} />

      <div className="flex flex-col gap-y-3 mb-4">
        {players.map((player, index) => {
          return (
            <PlayerRow key={index} playerIndex={index + 1} player={player} />
          );
        })}
      </div>
    </section>
  );
}
