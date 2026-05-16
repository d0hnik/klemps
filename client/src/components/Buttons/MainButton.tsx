import "./mainButton.css";

type Props = {
  text: string;
};

export function MainButton({ text }: Props) {
  return (
    <button className="secondary-pixel-corners main-button" type="button">
      {text}
    </button>
  );
}
