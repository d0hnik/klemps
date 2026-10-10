type Props = {
  number: number;
};

export function PlayerAssignedDrinksCounter({ number }: Props) {
  return (
    <div
      className={`
    secondary-pixel-corners
    w-10
    h-10
    flex
    justify-center
    items-center
    [--border-color:var(--color-panel)]
  `}
    >
      {number}
    </div>
  );
}
