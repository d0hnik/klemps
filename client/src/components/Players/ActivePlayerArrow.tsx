import "./players.css";

type Props = {
  top: number;
  playerName: string;
};

export function ActivePlayerArrow({ top, playerName }: Props) {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-3 sm:-left-5 z-49 -translate-y-1/2 transition-[top] duration-300 ease-out"
        style={{
          top: `${top}px`,
        }}
      >
        <img
          src="/icons/arrowRight.svg"
          alt=""
          className="active-player-arrow size-8 sm:size-11 object-contain"
        />
      </div>

      <span className="sr-only" aria-live="polite">
        Current player: {playerName}
      </span>
    </>
  );
}
