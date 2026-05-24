import "./mainButton.css";

type Props = {
  text: string;
  onClick: () => void;
  active: boolean;
};

export function MainButton({ text, onClick, active }: Props) {
  const borderColor = active ? "#f6c453" : "#00fbff";

  return (
    <button
      className={`secondary-pixel-corners main-button ${
        active ? "main-button--active" : ""
      }`}
      style={
        {
          "--border-color": borderColor,
        } as React.CSSProperties
      }
      type="button"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
