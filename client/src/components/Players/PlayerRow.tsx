import {
  IconArrowBadgeLeftFilled,
  IconArrowBadgeRightFilled,
} from "@tabler/icons-react";
import "./players.css";

type Props = {
  playerIndex: number;
  avatarSrc: string;
};

const PLAYER_COLORS = [
  {
    color: "#e94b5e",
  },
  {
    color: "#ffd91a",
  },
  {
    color: "#44d07b",
  },
  {
    color: "#4da3ff",
  },
] as const;

export function PlayerRow({ playerIndex, avatarSrc }: Props) {
  const isEasy = playerIndex == 1;

  const colorModifier = isEasy ? "red" : "yellow";

  const color = PLAYER_COLORS[(playerIndex - 1) % PLAYER_COLORS.length];

  return (
    <div
      className={`player-row pixel-corners player-row__${colorModifier}-border`}
      style={
        {
          "--player-color": color.color,
        } as React.CSSProperties
      }
    >
      <button className="player-row__arrow-button" type="button">
        <IconArrowBadgeLeftFilled size={50} color="#f6c453" />
      </button>

      <img src={avatarSrc} alt="Player icon" className="player-row__avatar" />

      <div className="player-row__content">
        <span className={`player-row__index pixel-corners`}>
          P{playerIndex}
        </span>

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
