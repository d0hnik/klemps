import "./players.css";
import { PLAYER_COLORS } from "../../entities/player";

type Props = {
  playerIndex: number;
  playerName: string;
  avatarSrc: string;
  onNameChange: (name: string) => void;
  onPreviousAvatar: () => void;
  onNextAvatar: () => void;
};

export function PlayerRow({
  playerIndex,
  playerName,
  avatarSrc,
  onNameChange,
  onPreviousAvatar,
  onNextAvatar,
}: Props) {
  const color = PLAYER_COLORS[(playerIndex - 1) % PLAYER_COLORS.length];

  return (
    <div
      className={`player-row pixel-corners`}
      style={
        {
          "--player-color": color.color,
        } as React.CSSProperties
      }
    >
      <button
        className="player-row__arrow-button"
        type="button"
        onClick={onPreviousAvatar}
      >
        <img src="/icons/arrowLeft.svg" alt="Previous" />
      </button>

      <img src={avatarSrc} alt="Player icon" className="player-row__avatar" />

      <div className="player-row__content">
        <span className={`player-row__index pixel-corners`}>
          P{playerIndex}
        </span>

        <input
          type="text"
          value={playerName}
          placeholder={`PLAYER ${playerIndex} NAME`}
          className="player-row__input"
          onChange={(event) => onNameChange(event.target.value)}
        />
      </div>

      <button
        className="player-row__arrow-button"
        type="button"
        onClick={onNextAvatar}
      >
        <img src="/icons/arrowRight.svg" alt="Next" />
      </button>
    </div>
  );
}
