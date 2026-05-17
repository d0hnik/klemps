import "./mainButton.css";

type Props = {
  text: string;
  onClick: () => void;
};

export function MainButton({ text, onClick }: Props) {
  return (
    <button
      className="secondary-pixel-corners main-button"
      type="button"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
