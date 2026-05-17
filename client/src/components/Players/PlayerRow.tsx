import {
  IconArrowBadgeLeftFilled,
  IconArrowBadgeRightFilled,
  IconUserCircle,
} from "@tabler/icons-react";
import "./players.css";

type Props = {
  playerIndex: number;
};

export function PlayerRow({ playerIndex }: Props) {
  return (
    <div className="player-row pixel-corners">
      <button className="player-row__arrow-button" type="button">
        <IconArrowBadgeLeftFilled size={50} color="#f6c453" />
      </button>

      <div className="player-row__avatar">
        <IconUserCircle stroke={2} size={60} />
      </div>

      <div className="player-row__content">
        <span className="player-row__index pixel-corners">P{playerIndex}</span>

        <input
          type="text"
          placeholder={`PLAYER ${playerIndex} NAME`}
          className="player-row__input"
        />
      </div>

      <button className="player-row__arrow-button" type="button">
        <IconArrowBadgeRightFilled size={50} color="#f6c453" />
      </button>
    </div>
  );
}
